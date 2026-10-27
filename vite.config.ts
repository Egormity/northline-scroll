import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) loadEnvFile('.env');

export default defineConfig(() => {
  const configured = process.env.PORT?.trim();
  const port = configured ? Number(configured) : undefined;
  if (port !== undefined && (!Number.isInteger(port) || port < 1 || port > 65_535)) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  return {
    plugins: [react()],
    base: './',
    server: { host: '0.0.0.0', port: port ?? 4408, strictPort: true },
    preview: { host: '0.0.0.0', port: port ?? 4409, strictPort: true },
  };
});
