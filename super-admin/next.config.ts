import type { NextConfig } from 'next';

const config: NextConfig = {
  agentRules: false,
  // Local HTTPS proxy host (dev/https/Caddyfile); Next dev blocks other hosts by default.
  allowedDevOrigins: ['control.estateos.localhost'],
};

export default config;
