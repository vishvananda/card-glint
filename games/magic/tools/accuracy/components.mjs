import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { cachedFetch } from './cache.mjs';
import { mapLimit, root } from './common.mjs';
import { presentation } from './adapter.mjs';

export async function fetchComponents(entries, opts) {
  const server = await createServer({ configFile: false, root, server: { middlewareMode: true } });
  try {
    const { canvasAssetUrls } = await server.ssrLoadModule(
      '/games/magic/src/presentation/canvas-assets.ts',
    );
    const { isRetro, RETRO_FONT, RETRO_SYMBOL_FONT } = await server.ssrLoadModule(
      '/games/magic/src/presentation/retro-frame.ts',
    );
    const css = await readFile(path.join(root, 'games/magic/fonts.css'), 'utf8');
    const urls = [
      ...new Set(
        [
          ...[...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]),
          ...(entries.some((e) => !e.issue && isRetro(presentation(e).face))
            ? [RETRO_FONT, RETRO_SYMBOL_FONT]
            : []),
          ...entries.filter((e) => !e.issue).flatMap((e) => canvasAssetUrls(presentation(e).face)),
        ].filter((url) => url?.startsWith('https://')),
      ),
    ];
    return await mapLimit(urls, 2, (url) => cachedFetch(url, opts));
  } finally {
    await server.close();
  }
}
