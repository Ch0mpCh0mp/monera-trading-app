export {};

declare global {
  interface Window {
    handleGoogleLogin: (response: any) => void;
  }
}
