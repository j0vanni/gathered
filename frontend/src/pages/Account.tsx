import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api from "@/globals";
import useAuth from "@/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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

function Account() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const root = document.documentElement;
  const style = getComputedStyle(root);

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

  const [themeColors, setThemeColors] = useState({
    background: hslToHex(style.getPropertyValue("--background").trim()),
    foreground: hslToHex(style.getPropertyValue("--foreground").trim()),
    primary: hslToHex(style.getPropertyValue("--primary").trim()),
    secondary: hslToHex(style.getPropertyValue("--secondary").trim()),
    highlight: hslToHex(style.getPropertyValue("--highlight").trim()),
    muted: hslToHex(style.getPropertyValue("--muted").trim()),
    mutedForeground: hslToHex(
      style.getPropertyValue("--muted-foreground").trim()
    ),
    border: hslToHex(style.getPropertyValue("--border").trim()),
    info: hslToHex(style.getPropertyValue("--info").trim()),
    success: hslToHex(style.getPropertyValue("--success").trim()),
    warning: hslToHex(style.getPropertyValue("--warning").trim()),
    error: hslToHex(style.getPropertyValue("--error").trim()),
  });

  useEffect(() => {
    getColors()
      .then((data) => {
        let colors = data;
        if (colors.background)
          root.style.setProperty("--background", hexToHSL(colors.background));
        if (colors.foreground)
          root.style.setProperty("--foreground", hexToHSL(colors.foreground));
        if (colors.primary)
          root.style.setProperty("--primary", hexToHSL(colors.primary));
        if (colors.secondary)
          root.style.setProperty("--secondary", hexToHSL(colors.secondary));
        if (colors.muted)
          root.style.setProperty("--muted", hexToHSL(colors.muted));
        if (colors.accent)
          root.style.setProperty("--accent", hexToHSL(colors.accent));
        if (colors.card)
          root.style.setProperty("--card", hexToHSL(colors.card));
        if (colors.border)
          root.style.setProperty("--border", hexToHSL(colors.border));
        if (colors.sidebarBackground)
          root.style.setProperty(
            "--sidebar-background",
            hexToHSL(colors.sidebarBackground)
          );
        if (colors.sidebarForeground)
          root.style.setProperty(
            "--sidebar-foreground",
            hexToHSL(colors.sidebarForeground)
          );
        if (colors.sidebarPrimary)
          root.style.setProperty(
            "--sidebar-primary",
            hexToHSL(colors.sidebarPrimary)
          );
        if (colors.sidebarPrimaryForeground)
          root.style.setProperty(
            "--sidebar-primary-foreground",
            hexToHSL(colors.sidebarPrimaryForeground)
          );
        if (colors.sidebarAccent)
          root.style.setProperty(
            "--sidebar-accent",
            hexToHSL(colors.sidebarAccent)
          );
        if (colors.sidebarAccentForeground)
          root.style.setProperty(
            "--sidebar-accent-foreground",
            hexToHSL(colors.sidebarAccentForeground)
          );
        localStorage.setItem("userTheme", JSON.stringify(colors));

        setThemeColors(colors);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const handleColorChange = (property: string, value: string) => {
  //   setThemeColors((prev) => ({ ...prev, [property]: value }));
  //   const hslValue = hexToHSL(value);
  //   document.documentElement.style.setProperty(`--${property}`, hslValue);
  // };

  const deriveColorsFromBackground = (backgroundColor: string) => {
    const bgHSL = hexToHSL(backgroundColor);
    const [h, s, l] = bgHSL
      .split(" ")
      .map((val) => parseFloat(val.replace("%", "")));

    const primaryLightness =
      l < 50 ? Math.min(l + 20, 100) : Math.max(l - 20, 0);
    const secondaryLightness =
      l < 50 ? Math.min(l + 25, 100) : Math.max(l - 25, 0);
    const mutedLightness = l < 50 ? Math.min(l + 15, 60) : Math.max(l - 20, 15);
    const mutedSaturation = Math.max(s - 50, 0);

    const colors = {
      background: backgroundColor,
      foreground: l > 50 ? "#000000" : "#ffffff",
      primary: `#${hslToHex(
        `${h} ${Math.min(s + 10, 100)}% ${primaryLightness}%`
      ).substring(1)}`,
      secondary: `#${hslToHex(
        `${(h + 10) % 360} ${Math.min(s + 5, 100)}% ${secondaryLightness}%`
      ).substring(1)}`,
      highlight: `#${hslToHex(`${h} ${s}% ${Math.min(l + 10, 100)}%`).substring(
        1
      )}`,
      muted: `#${hslToHex(
        `${h} ${mutedSaturation}% ${mutedLightness}%`
      ).substring(1)}`,
      mutedForeground: `#${hslToHex(
        `${h} ${Math.max(s - 20, 0)}% ${l < 50 ? 30 : 70}%`
      ).substring(1)}`,
      border: `#${hslToHex(
        `${h} ${Math.max(s - 40, 0)}% ${
          l < 50 ? Math.max(l - 15, 0) : Math.min(l + 15, 100)
        }%`
      ).substring(1)}`,
      info: `#${hslToHex(`210 90% 50%`).substring(1)}`,
      success: `#${hslToHex(`120 80% 40%`).substring(1)}`,
      warning: `#${hslToHex(`40 100% 50%`).substring(1)}`,
      error: `#${hslToHex(`0 90% 50%`).substring(1)}`,
    };

    setThemeColors(colors);
  };

  const handleThemeColorChange = (value: string) => {
    deriveColorsFromBackground(value);

    Object.entries(themeColors).forEach(([key, colorValue]) => {
      document.documentElement.style.setProperty(
        `--${key}`,
        hexToHSL(colorValue)
      );
    });
  };

  function hslToHex(hsl: string) {
    if (!hsl) return "#000000";
    const [h, s, l] = hsl.split(" ").map((val) => parseFloat(val));
    const hslToRgb = (h: number, s: number, l: number) => {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [255 * f(0), 255 * f(8), 255 * f(4)];
    };
    const rgb = hslToRgb(h, s, l);
    const toHex = (x: number) => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
  }

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pfp, setPfp] = useState("");

  const getUser = async () => {
    const res = await axios.get(api + "/auth/user", {
      withCredentials: true,
    });

    return res.data;
  };

  const getColors = async () => {
    const res = await axios.get(api + "/auth/getColors", {
      withCredentials: true,
    });

    const localTheme = localStorage.getItem("userTheme");

    if (localTheme && !JSON.parse(localTheme).sidebarBackground) {
      const parsedTheme = JSON.parse(localTheme);
      setThemeColors(parsedTheme);
      return parsedTheme;
    }

    if (res.data.sidebarBackground) {
      return defaultTheme;
    } else {
      return res.data;
    }
  };

  useEffect(() => {
    getUser().then((data) => {
      const user = data.token;
      setName(user.displayName);
      setEmail(user.email);
      setPfp(user.photo);
      getColors();
    });
  }, []);

  const handleSignOut = async () => {
    await axios.get(api + "/auth/signout", {
      withCredentials: true,
    });

    window.location.href = "/";
  };

  const handleSave = async () => {
    const res = await axios.post(
      api + "/auth/saveColors",
      {
        background: themeColors.background,
        foreground: themeColors.foreground,
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        highlight: themeColors.highlight,
        muted: themeColors.muted,
        mutedForeground: themeColors.mutedForeground,
        border: themeColors.border,
        info: themeColors.info,
        success: themeColors.success,
        warning: themeColors.warning,
        error: themeColors.error,
      },
      {
        withCredentials: true,
      }
    );

    localStorage.setItem("userTheme", JSON.stringify(themeColors));
    if (res.status === 200) {
      toast.success("Theme updated");
    } else {
      toast.error("Failed to save theme");
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex flex-col items-center mt-20">
        <Avatar className="w-24 h-24">
          <AvatarImage
            src={pfp}
            alt={name}
            referrerPolicy="no-referrer"
            className="object-cover"
          />
          <AvatarFallback>
            {name.slice(0, 2).toUpperCase() || ""}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold mt-4 text-primary-secondary">
          {name}
        </h1>
        <h2 className="text-sm text-secondary-foreground mb-2">{email}</h2>
      </div>

      <Card className="mt-8 w-full max-w-md mx-4 bg-muted">
        <CardHeader>
          <CardTitle className="text-center">Theme Customization</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="themeColor" className="capitalize">
              Theme Color
            </Label>
            <div className="relative">
              <input
                type="color"
                id="themeColor"
                value={themeColors.primary}
                onChange={(e) => handleThemeColorChange(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-md border border-input bg-background"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {Object.entries(themeColors).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full border border-gray-200"
                  style={{ backgroundColor: value }}
                />
                <span className="text-xs mt-1 capitalize">{key}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="default" onClick={handleSave}>
            Save
          </Button>
        </CardFooter>
      </Card>

      <div className="flex-grow" />
      <Button className="mb-8" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}

export default Account;
