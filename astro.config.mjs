import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import auth from 'auth-astro';
import { resolve } from 'node:path';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react(), auth()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Allow toolkit/ai/ to resolve npm packages from traction's node_modules
      alias: {
        '@yuyuqueen/resilient-llm': resolve('./node_modules/@yuyuqueen/resilient-llm'),
        '@anthropic-ai/sdk': resolve('./node_modules/@anthropic-ai/sdk'),
        'openai': resolve('./node_modules/openai'),
        '@google/generative-ai': resolve('./node_modules/@google/generative-ai'),
      },
    },
  },
});
