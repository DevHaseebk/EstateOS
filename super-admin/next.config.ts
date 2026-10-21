import type { NextConfig } from 'next';

const config: NextConfig = {
  agentRules: false,
  // Shared public-site template (Phase 3b): TypeScript/CSS source compiled by each app.
  transpilePackages: ['site-template'],
  // Local HTTPS proxy host (dev/https/Caddyfile); Next dev blocks other hosts by default.
  allowedDevOrigins: ['control.estateos.localhost'],
};

export default config;
