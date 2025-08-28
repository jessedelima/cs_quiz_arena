import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Routes from "./Routes";

// Substitua pelo seu Client ID do Google OAuth
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "seu-client-id-do-google";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Routes />
    </GoogleOAuthProvider>
  );
}

export default App;
