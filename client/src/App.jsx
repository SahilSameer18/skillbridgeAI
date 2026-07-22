import React from "react";
import { RouterProvider } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { router } from "./routes/app.routes";
import { AuthProvider } from "./context/AuthContext";
import { InterviewProvider } from "./context/InterviewContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

