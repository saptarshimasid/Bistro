import { build } from 'esbuild';

await build({
  entryPoints: ['api/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  outfile: 'api/index.js',
  packages: 'external',
  sourcemap: false,
});

console.log('API serverless function bundled to api/index.js');
