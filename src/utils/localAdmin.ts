export function allowsLocalAdmin(dev: boolean, enabled: boolean, url: URL): boolean {
  return dev && enabled
    && url.hostname === '127.0.0.1'
    && url.searchParams.get('admin') === '1';
}

export const localAdminActive = import.meta.env.DEV && typeof window !== 'undefined'
  && allowsLocalAdmin(true, import.meta.env.OCTO_LOCAL_ADMIN === true, new URL(window.location.href));
