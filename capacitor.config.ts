import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.infurbanistica.starter',
  appName: 'infurbanistica',
  webDir: 'dist',
  plugins: {
    Geolocation: {
      androidAccuracy: 'high',  // Utiliza el GPS de alta precisión
    },
  },
};

export default config;
