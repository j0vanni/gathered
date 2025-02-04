import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Search from "./pages/Search.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Search />
  </StrictMode>
);
