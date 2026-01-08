export {};

interface GoogleCredentialResponse {
  credential: string;
  clientId?: string;
}

declare global {
  interface Window {
    handleGoogleLogin: (response: GoogleCredentialResponse) => void;
  }
}
