import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import Search from "./pages/Search.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Search />
  </StrictMode>
);
