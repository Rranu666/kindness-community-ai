import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kindnesscommunityfoundation.kindlearn',
  appName: 'KindLearn',
  webDir: 'www',

  // Load the live KindLearn website — always up to date, no rebundling needed
  server: {
    url: 'https://kindnesscommunityfoundation.com/kindlearn',
    cleartext: false,
    androidScheme: 'https',
  },

  android: {
    backgroundColor: '#7C3AED',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  ios: {
    backgroundColor: '#7C3AED',
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: true,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#7C3AED',
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'Default',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
      fadeInDuration: 200,
      fadeOutDuration: 400,
    },
    StatusBar: {
      style: 'Light',
      backgroundColor: '#7C3AED',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
