/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_BASE_URL: string;
    readonly [key: string]: string;
  };
} 