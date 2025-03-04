import { Route, Routes } from "react-router";
import "./index.css";
import Layout from "./layout";
import Account from "./pages/Account";
import Lists from "./pages/Lists";
import Login from "./pages/Login";
import Search from "./pages/Search";
import { useTheme } from "./useTheme";
import ProtectedRoutes from "./utils/ProtectedRoutes";

function App() {
  useTheme();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/account" element={<Account />} />
          <Route path="/search" element={<Search />} />
          <Route path="/lists" element={<Lists />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
