import api from "@/globals";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  highlight: string;
  muted: string;
  mutedForeground: string;
  border: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

const defaultTheme: ThemeColors = {
  background: "#121212",
  foreground: "#E0E0E0",
  primary: "#1E1E1E",
  secondary: "#2C2C2C",
  highlight: "#BB86FC",
  muted: "#2A2A2A",
  mutedForeground: "#B0B0B0",
  border: "#333333",
  info: "#64B5F6",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#CF6679",
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

  const applyTheme = (colors: ThemeColors) => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, hex]) => {
      if (key === "mutedForeground") {
        root.style.setProperty(`--muted-foreground`, hexToHSL(hex));
      } else {
        root.style.setProperty(`--${key}`, hexToHSL(hex));
      }
    });
  };

  const getColors = async (): Promise<ThemeColors> => {
    const res = await axios.get(api + "/auth/getColors", {
      withCredentials: true,
    });

    return res.data;
  };

  useEffect(() => {
    checkLogin();
    const storedTheme = localStorage.getItem("userTheme");
    if (storedTheme?.includes("sidebarBackground")) {
      applyTheme(defaultTheme);
      setThemeColors(defaultTheme);
    } else {
      getColors()
        .then((colors) => {
          applyTheme(colors);
          setThemeColors(colors);
          localStorage.setItem("userTheme", JSON.stringify(colors));
        })
        .catch((err) => {
          console.error("Error loading theme colors:", err);
          toast.error("Error loading theme colors");
          applyTheme(defaultTheme);
          setThemeColors(defaultTheme);
          localStorage.removeItem("userTheme");
        });
    }
  }, []);

  return { themeColors, setThemeColors, applyTheme };
};
