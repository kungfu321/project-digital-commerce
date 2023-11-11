"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {
        theme === "dark" ?
          <Moon />
          :
          <Sun />
      }
    </Button>
  );
}

export default ThemeToggle;
