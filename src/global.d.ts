declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: Record<string, unknown>,
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

export {};
