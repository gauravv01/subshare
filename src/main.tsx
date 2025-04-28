import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AppProvider } from "./context/AppProvider";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
          </AppProvider>

  </React.StrictMode>
);
