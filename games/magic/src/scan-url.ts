/** Upgrade only an exact image-host printing URL, retaining custom URLs. */
export function fullResolutionScan(url: string): string {
  return url.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    '$1png$2.png',
  );
}
