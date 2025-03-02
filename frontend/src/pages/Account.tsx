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
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Account() {
  const root = document.documentElement;
  const style = getComputedStyle(root);

  const [themeColors, setThemeColors] = useState({
    background: hslToHex(style.getPropertyValue("--background").trim()),
    foreground: hslToHex(style.getPropertyValue("--foreground").trim()),
    primary: hslToHex(style.getPropertyValue("--primary").trim()),
    secondary: hslToHex(style.getPropertyValue("--secondary").trim()),
    muted: hslToHex(style.getPropertyValue("--muted").trim()),
    accent: hslToHex(style.getPropertyValue("--accent").trim()),
    card: hslToHex(style.getPropertyValue("--card").trim()),
    border: hslToHex(style.getPropertyValue("--border").trim()),
    sidebarBackground: hslToHex(
      style.getPropertyValue("--sidebar-background").trim()
    ),
    sidebarForeground: hslToHex(
      style.getPropertyValue("--sidebar-foreground").trim()
    ),
    sidebarPrimary: hslToHex(
      style.getPropertyValue("--sidebar-primary").trim()
    ),
    sidebarPrimaryForeground: hslToHex(
      style.getPropertyValue("--sidebar-primary-foreground").trim()
    ),
    sidebarAccent: hslToHex(style.getPropertyValue("--sidebar-accent").trim()),
    sidebarAccentForeground: hslToHex(
      style.getPropertyValue("--sidebar-accent-foreground").trim()
    ),
    sidebarBorder: hslToHex(style.getPropertyValue("--sidebar-border").trim()),
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

  const handleColorChange = (property: string, value: string) => {
    setThemeColors((prev) => ({ ...prev, [property]: value }));
    const hslValue = hexToHSL(value);
    document.documentElement.style.setProperty(`--${property}`, hslValue);
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

    if (res.status !== 200) {
      window.location.href = "/";
    }

    return res.data;
  };

  const getColors = async () => {
    const res = await axios.get(api + "/auth/getColors", {
      withCredentials: true,
    });

    return res.data;
  };

  useEffect(() => {
    getUser()
      .then((data) => {
        setName(data.displayName);
        setEmail(data.email);
        setPfp(data.photo);
      })
      .catch((err) => {
        console.log(err);
        window.location.href = "/";
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
        muted: themeColors.muted,
        accent: themeColors.accent,
        card: themeColors.card,
        border: themeColors.border,
        sidebarBackground: themeColors.sidebarBackground,
        sidebarForeground: themeColors.sidebarForeground,
        sidebarPrimary: themeColors.sidebarPrimary,
        sidebarPrimaryForeground: themeColors.sidebarPrimaryForeground,
        sidebarAccent: themeColors.sidebarAccent,
        sidebarAccentForeground: themeColors.sidebarAccentForeground,
        sidebarBorder: themeColors.sidebarBorder,
      },
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      localStorage.setItem("userTheme", JSON.stringify(themeColors));
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
        <h1 className="text-2xl font-bold mt-4">{name}</h1>
        <h2 className="text-sm text-muted-foreground mb-2">{email}</h2>
      </div>

      <Card className="mt-8 w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center">Theme Customization</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(themeColors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="capitalize">
                  {key}
                </Label>
                <div className="relative">
                  <input
                    type="color"
                    id={key}
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-md border border-input bg-background"
                  />
                </div>
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
