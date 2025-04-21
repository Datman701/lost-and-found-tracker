// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppTheme from "./shared-theme/AppTheme";
import App from "./App";
import "./index.css";

// Handle initial dark mode to prevent flash
const darkModeScript = `
  if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
`;

const scriptElement = document.createElement('script');
scriptElement.textContent = darkModeScript;
document.head.appendChild(scriptElement);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppTheme>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppTheme>
    </AuthProvider>
  </React.StrictMode>
);

