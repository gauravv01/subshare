import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthProvider";
import { ProfileProvider } from "./context/ProfileProvider";
import { BankProvider } from "./context/BankProvider";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <BankProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </BankProvider>
      </ProfileProvider>
    </AuthProvider>
  </React.StrictMode>
);
