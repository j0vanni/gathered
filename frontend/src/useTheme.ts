import { useState, useEffect } from "react";
import axios from "axios";
import api from "@/globals";

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  muted: string;
  accent: string;
  card: string;
  border: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBackground: string;
  sidebarBorder: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
}

const defaultTheme: ThemeColors = {
  accent: "#f5f5f5",
  background: "#ffffff",
  border: "#000000",
  card: "#ffffff",
  foreground: "#000000",
  muted: "#f5f5f5",
  primary: "#171717",
  secondary: "#000000",
  sidebarAccent: "#f4f4f5",
  sidebarAccentForeground: "#18181b",
  sidebarBackground: "#fafafa",
  sidebarBorder: "#e5e7eb",
  sidebarForeground: "#3f3f46",
  sidebarPrimary: "#18181b",
  sidebarPrimaryForeground: "#fafafa",
};

function hexToHSL(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 0%";

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = (h || 0) / 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
    l * 100
  )}%`;
}

export const useTheme = () => {
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultTheme);

  const applyTheme = (colors: ThemeColors) => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, hex]) => {
      root.style.setProperty(`--${key}`, hexToHSL(hex));
    });
  };

  const checkLogin = async () => {
    try {
      await axios.get(api + "/auth/user", {
        withCredentials: true,
      });
    } catch {
      applyTheme(defaultTheme);
      setThemeColors(defaultTheme);
      localStorage.removeItem("userTheme");
    }
  };

  const getColors = async (): Promise<ThemeColors> => {
    const res = await axios.get(api + "/auth/getColors", {
      withCredentials: true,
    });
    return res.data;
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("userTheme");
    if (storedTheme) {
      const colors: ThemeColors = JSON.parse(storedTheme);
      applyTheme(colors);
      setThemeColors(colors);
      checkLogin();
    } else {
      getColors()
        .then((colors) => {
          applyTheme(colors);
          setThemeColors(colors);
          localStorage.setItem("userTheme", JSON.stringify(colors));
        })
        .catch((err) => {
          console.error("Error loading theme colors:", err);
          applyTheme(defaultTheme);
          setThemeColors(defaultTheme);
          localStorage.removeItem("userTheme");
        });
    }
  }, []);

  return { themeColors, setThemeColors, applyTheme };
};
