namespace NodeJS {
  interface ProcessEnv {
    REVALIDATE_SECRET: string;
    API_URL: string;
  }
}
namespace Window {
  interface Window {
    stonks?: {
      trackEvent?: (event: string, payload?: any) => void;
    };
  }
}
