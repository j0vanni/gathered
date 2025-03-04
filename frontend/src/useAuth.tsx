import { useState, useEffect } from "react";
import axios from "axios";
import api from "./globals";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${api}/auth/user`, {
          withCredentials: true,
        });

        if (res.data) {
          setUser(res.data.token);
        }
      } catch (error) {
        console.error("User not authenticated", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading };
}
