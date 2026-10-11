export const fetchCardAsset = (url: string, options: RequestInit = {}) =>
  fetch(url, { ...options, mode: 'cors' });
