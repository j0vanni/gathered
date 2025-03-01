import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Search from "./pages/Search.tsx";
import App from "./App.tsx";
import Lists from "./pages/Lists.tsx";
import Account from "./pages/Account.tsx";
import Login from "./pages/Login.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
