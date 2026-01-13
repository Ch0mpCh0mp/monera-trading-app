// src/types/window.d.ts oder direkt am Anfang deiner Seite
export {}; // macht das File zu einem Modul

declare global {
  interface Window {
    handleGoogleLogin?: (response: GoogleCredentialResponse) => void;
  }
}
