export type AssetFetcher = (url: string, options?: RequestInit) => Promise<Response>;
let fetcher: AssetFetcher = (url, options) => fetch(url, { ...options, mode: 'cors' });
export function setAssetFetcher(value: AssetFetcher): void {
  fetcher = value;
}
export function fetchAsset(url: string, options?: RequestInit): Promise<Response> {
  return fetcher(url, options);
}
