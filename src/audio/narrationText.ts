export function narrationKey(text: string): string {
  return text.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}\p{M}]+/gu, ' ').trim();
}

export function narrationPhrases(text: string): string[] {
  return text.trim().split(/(?<=[.!?؟…])\s+/u).map(part => part.trim()).filter(part => narrationKey(part).length > 0);
}
