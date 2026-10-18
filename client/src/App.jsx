import React from "react";
import { RouterProvider } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
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
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #d8e1eb",
                borderRadius: "14px",
                fontSize: "13px",
                fontWeight: "600",
                boxShadow: "0 10px 30px -4px rgba(15, 23, 42, 0.12)",
              },
              success: {
                iconTheme: {
                  primary: "#dc3838",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </InterviewProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;


