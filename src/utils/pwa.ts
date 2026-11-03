import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

let swRegistered = false;
let _updateSW: ((reloadPage?: boolean) => Promise<void>) | null = null;
const _updateListeners: Array<() => void> = [];
let _needsRefresh = false;

export function initServiceWorker(): void {
  if (swRegistered || typeof window === 'undefined') return;
  swRegistered = true;
  try {
    _updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        _needsRefresh = true;
        _updateListeners.forEach((fn) => fn());
      },
    });
  } catch {
    // Ignore SW registration restrictions in sandboxed environments
  }
}

export function useServiceWorkerUpdate() {
  const [needsRefresh, setNeedsRefresh] = useState(_needsRefresh);

  useEffect(() => {
    const notify = () => setNeedsRefresh(true);
    _updateListeners.push(notify);
    return () => {
      const idx = _updateListeners.indexOf(notify);
      if (idx !== -1) _updateListeners.splice(idx, 1);
    };
  }, []);

  const applyUpdate = () => _updateSW?.(true);
  return { needsRefresh, applyUpdate };
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let cachedDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    cachedDeferredPrompt = e as BeforeInstallPromptEvent;
  });
  window.addEventListener('appinstalled', () => {
    cachedDeferredPrompt = null;
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => cachedDeferredPrompt,
  );
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    if (cachedDeferredPrompt) {
      setDeferredPrompt(cachedDeferredPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      cachedDeferredPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(cachedDeferredPrompt);
    };

    const handleAppInstalled = () => {
      cachedDeferredPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    const promptEvent = deferredPrompt ?? cachedDeferredPrompt;
    if (!promptEvent) return false;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      cachedDeferredPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    install,
  };
}

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
