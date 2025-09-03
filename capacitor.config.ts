import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.phantomone.neurodash',
  appName: 'neuro-spark-dash',
  webDir: 'dist',
  server: {
    url: 'https://f48dae56-dfa4-4f1e-ae8d-b26755b8a9b4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
};

export default config;