import React from "react";
import "./index.css";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import Layout from "./layout";
import { Route, Routes } from "react-router";
import Search from "./pages/Search";
import Lists from "./pages/Lists";
import Account from "./pages/Account";
import Login from "./pages/Login";
import { useLocation } from "react-router";
import { useTheme } from "./useTheme";

function App() {
  useTheme();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/search" element={<Search />} />
        <Route path="/lists" element={<Lists />} />
      </Routes>
    </Layout>
  );
}

export default App;
