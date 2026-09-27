import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project sites serve the app from /<repo-name>/, so derive
// the base from the Actions environment when building there. Locally (and
// on hosts like Vercel) this stays '/'.
const githubBase = (() => {
  if (process.env.GITHUB_ACTIONS !== 'true') return '/';
  const repo = process.env.GITHUB_REPOSITORY || '';
  const name = repo.split('/')[1];
  return name ? `/${name}/` : '/';
})();

export default defineConfig({
  plugins: [react()],
  base: githubBase,
});
