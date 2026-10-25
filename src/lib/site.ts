/** Resolve public assets and internal routes correctly at a domain root or subpath. */
export function withBase(path = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

/** A production URL exists only when the deployer explicitly provides SITE_URL. */
export function absoluteUrl(path: string, site?: URL): string | undefined {
  return site ? new URL(withBase(path), site).href : undefined;
}
