import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('MISSING_API_KEY');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface IncomingChatTurn {
  role: 'user' | 'model';
  text: string;
}

interface BlueprintContextPayload {
  vehicleName: string;
  category: string;
  tierLabel: string;
  placedParts: string[];
  remainingParts: string[];
  nextValidPartName: string | null;
  visualStyleLabel: string;
}

function formatGeminiError(error: unknown): { status: number; message: string } {
  const raw = error instanceof Error ? error.message : String(error);
  if (raw.includes('MISSING_API_KEY') || raw.includes('API_KEY_INVALID') || raw.includes('400')) {
    return {
      status: 400,
      message:
        'Clé API Gemini manquante ou invalide : vérifiez GEMINI_API_KEY dans votre fichier .env (en local) ou dans Settings > Secrets.',
    };
  }
  if (raw.includes('PERMISSION_DENIED') || raw.includes('403')) {
    return {
      status: 403,
      message:
        'Accès refusé par Gemini API. Vérifiez votre clé API dans le panneau Settings > Secrets.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message:
        'Quota temporairement atteint. Patientez quelques secondes ou sélectionnez une clé avec facturation dans Settings > Secrets.',
    };
  }
  return {
    status: 500,
    message: "Mécano Léo ajuste ses outils dans l'atelier. Réessaie dans un instant !",
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Multi-turn chatbot endpoint for Mécano Léo (workshop mascot)
  app.post('/api/mascot/chat', async (req: Request, res: Response) => {
    try {
      const {
        history = [],
        message = '',
        mode = 'general',
        context,
      } = req.body as {
        history?: IncomingChatTurn[];
        message?: string;
        mode?: 'fast' | 'general';
        context?: BlueprintContextPayload;
      };

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Le message est requis.' });
        return;
      }

      const ai = getGenAIClient();
      const selectedModel = mode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';

      const contextDescription = context
        ? [
            `Véhicule actuel : ${context.vehicleName} (${context.category}, ${context.tierLabel}).`,
            `Style visuel choisi : ${context.visualStyleLabel}.`,
            `Pièces déjà assemblées : ${context.placedParts.length > 0 ? context.placedParts.join(', ') : 'Aucune pour le moment'}.`,
            `Pièces restantes dans le tiroir : ${context.remainingParts.length > 0 ? context.remainingParts.join(', ') : 'Toutes les pièces sont montées !'}.`,
            context.nextValidPartName
              ? `Prochaine pièce logique recommandée : ${context.nextValidPartName}.`
              : 'Le véhicule est entièrement assemblé ! Félicite chaleureusement le jeune mécanicien.',
          ].join('\n')
        : '';

      const systemInstruction = [
        'Tu es Mécano Léo, le chef mécanicien bienveillant et enthousiaste de MécanoKids 3D, un atelier éducatif pour enfants de 6 à 10 ans.',
        'Règles importantes :',
        '1. Réponds toujours en français simple, chaleureux, curieux et adapté aux enfants de 6 à 10 ans.',
        '2. Garde des réponses courtes et aérées (2 à 4 phrases maximum) pour une lecture facile.',
        "3. Si l'enfant demande un indice d'assemblage, guide-le vers la prochaine pièce logique en expliquant son rôle mécanique réel (ex: pourquoi on pose le châssis ou le moteur avant le capot).",
        "4. Si l'enfant pose une question sur les voitures, bateaux, avions ou la science, explique le phénomène avec une image concrète du quotidien.",
        '5. Reste strictement dans un cadre éducatif sécurisé pour enfants.',
        contextDescription ? `\nÉtat en direct de l'établi 3D :\n${contextDescription}` : '',
      ].join('\n');

      const formattedHistory = history
        .filter((turn) => turn && typeof turn.text === 'string' && turn.text.trim().length > 0)
        .slice(-14)
        .map((turn) => ({
          role: turn.role === 'model' ? 'model' : 'user',
          parts: [{ text: turn.text }],
        }));

      const chat = ai.chats.create({
        model: selectedModel,
        history: formattedHistory,
        config: {
          systemInstruction,
          ...(selectedModel === 'gemini-3.8-flash'
            ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
            : {}),
        },
      });

      const response = await chat.sendMessage({
        message: message.trim(),
      });

      res.json({
        reply:
          response.text ??
          'Bravo jeune mécano ! Regarde bien la silhouette lumineuse sur le plateau pour poser ta prochaine pièce.',
        modelUsed: selectedModel,
      });
    } catch (error) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // Google Search Grounding endpoint for real-world vehicle Discovery Sheet
  app.post('/api/discovery', async (req: Request, res: Response) => {
    try {
      const { vehicleName, category, realWorldQuery, partsCount } = req.body as {
        vehicleName?: string;
        category?: string;
        realWorldQuery?: string;
        partsCount?: number;
      };

      if (!vehicleName) {
        res.status(400).json({ error: 'Nom du véhicule requis.' });
        return;
      }

      const ai = getGenAIClient();
      const queryTopic = realWorldQuery || vehicleName;

      const prompt = [
        `Un enfant de 6 à 10 ans vient de terminer l'assemblage 3D de "${vehicleName}" (${partsCount ?? 5} pièces mécaniques, famille : ${category ?? 'transport'}).`,
        `Utilise Google Search sur le sujet "${queryTopic}" pour rédiger une courte fiche découverte passionnante et vérifiée en français.`,
        'Structure ta réponse avec exactement 3 courts points commençant chacun par un titre en gras :',
        '1. **Comment ça marche en vrai** : explique simplement le principe mécanique ou physique réel.',
        '2. **Un record ou chiffre réel** : donne une vraie mesure, vitesse, taille ou date historique vérifiée.',
        '3. **Le savais-tu ?** : raconte une anecdote étonnante mais vraie adaptée aux 6-10 ans.',
        'Garde chaque point court (1 à 2 phrases claires).',
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Tu es un rédacteur scientifique jeunesse francophone rigoureux et captivant pour les 6-10 ans. Utilise des informations réelles issues de la recherche.',
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const sources: Array<{ title: string; uri: string }> = [];
      const seenUris = new Set<string>();

      for (const chunk of rawChunks) {
        const uri = chunk?.web?.uri;
        const title = chunk?.web?.title;
        if (uri && !seenUris.has(uri)) {
          seenUris.add(uri);
          sources.push({
            title: title || 'Source encyclopédique',
            uri,
          });
        }
      }

      res.json({
        content:
          response.text ??
          `Félicitations pour la construction de **${vehicleName}** ! Ce véhicule combine structure porteuse et propulsion mécanique pour se déplacer avec précision.`,
        sources: sources.slice(0, 4),
      });
    } catch (error) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  const isProduction =
    process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MécanoKids 3D lancé sur http://localhost:${PORT}`);
  });
}

startServer();
