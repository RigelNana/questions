import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.questions.app',
  appName: '刷题工具',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
