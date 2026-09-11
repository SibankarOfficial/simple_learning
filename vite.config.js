import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The authored content stays in one place. Vite serves it directly in development
// and this plugin includes the same JSON paths in the production output.
function contentAssets() {
  const root = fileURLToPath(new URL('./content/', import.meta.url));
  return {
    name: 'learning-content',
    generateBundle() {
      for (const file of readdirSync(root, { recursive: true })) {
        if (file.endsWith('.json')) this.emitFile({
          type: 'asset', fileName: `content/${file.replaceAll('\\', '/')}`,
          source: readFileSync(`${root}/${file}`),
        });
      }
    },
  };
}

export default defineConfig({ plugins: [react(), contentAssets()], base: './' });
