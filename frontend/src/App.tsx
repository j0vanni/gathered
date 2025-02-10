import React from "react";
import "./index.css";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import Layout from "./layout";
import { Route, Routes } from "react-router";
import Search from "./pages/Search";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/search" element={<Search />} />
      </Routes>
    </Layout>
  );
}

export default App;
