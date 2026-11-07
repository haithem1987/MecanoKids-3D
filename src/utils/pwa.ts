import { useEffect, useState, useSyncExternalStore } from 'react';

let swRegistered = false;
let registration: ServiceWorkerRegistration | undefined;
let reloadRequired = false;
let saveBeforeReload: (() => boolean) | undefined;
let lastActivationRequest = 0;
const updateListeners = new Set<() => void>();

function notifyUpdate() {
  updateListeners.forEach(listener => listener());
}

function needsRefresh() {
  return reloadRequired || Boolean(registration?.waiting && navigator.serviceWorker.controller);
}

function subscribeToUpdates(listener: () => void) {
  updateListeners.add(listener);
  return () => { updateListeners.delete(listener); };
}

function applyUpdate(save: () => boolean) {
  if (reloadRequired) {
    if (save()) window.location.reload();
    return;
  }
  const worker = registration?.waiting;
  if (!worker || Date.now() - lastActivationRequest < 5000 || !save()) return;
  saveBeforeReload = save;
  lastActivationRequest = Date.now();
  worker.postMessage({ type: 'SKIP_WAITING' });
}

export function initServiceWorker(): void {
  if (swRegistered || !import.meta.env.PROD || typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  swRegistered = true;
  const workers = navigator.serviceWorker;
  let currentController = workers.controller;
  workers.addEventListener('controllerchange', () => {
    const nextController = workers.controller;
    const changedVersion = currentController && nextController && nextController !== currentController;
    currentController = nextController;
    if (changedVersion) reloadRequired = true;
    const save = saveBeforeReload;
    saveBeforeReload = undefined;
    if (changedVersion && save?.()) {
      window.location.reload();
      return;
    }
    notifyUpdate();
  });

  void workers.register(`${import.meta.env.BASE_URL}sw.js`, { updateViaCache: 'none' }).then(registered => {
    registration = registered;
    const watchInstall = () => registered.installing?.addEventListener('statechange', notifyUpdate);
    registered.addEventListener('updatefound', watchInstall);
    watchInstall();
    notifyUpdate();

    let checking = false;
    let lastCheck = 0;
    const check = () => {
      if (checking || registered.installing || registered.waiting || document.hidden || !navigator.onLine) return;
      if (Date.now() - lastCheck < 5000) return;
      checking = true;
      lastCheck = Date.now();
      void registered.update().catch(() => {
        // A temporary network failure leaves the installed version available.
      }).finally(() => {
        checking = false;
        notifyUpdate();
      });
    };
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    window.addEventListener('online', () => {
      lastCheck = 0;
      check();
    });
    window.setInterval(check, 120_000);
    check();
  }).catch(() => {
    // Service workers are optional in browsers that block registration.
  });
}

export function useServiceWorkerUpdate() {
  return { needsRefresh: useSyncExternalStore(subscribeToUpdates, needsRefresh, () => false), applyUpdate };
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
