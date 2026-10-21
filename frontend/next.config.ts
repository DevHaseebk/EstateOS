import type { NextConfig } from 'next';

const config: NextConfig = {
  agentRules: false,
  // Shared public-site template (Phase 3b): TypeScript/CSS source compiled by this app.
  transpilePackages: ['site-template'],
  // Local HTTPS proxy wildcard for agency sites (dev/https/Caddyfile, Phase 4a).
  allowedDevOrigins: ['*.sites.estateos.localhost'],
};

export default config;
