"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { NAVIGATION } from "@/constants";
import { NavigationType } from "@/types";
import NavigationItem from "./navigation-item";

const Navigation = () => {
  const pathname = usePathname();
  const [currentOpen, setCurrentOpen] = useState<string | null>();

  const handleActivateMenu = (url?: string) => {
    return url === pathname;
  }

  const handleOpenCloseMenu = (nav: NavigationType) => {
    if (nav.slug === currentOpen) {
      return setCurrentOpen(null);
    }

    return setCurrentOpen(nav.slug);
  }

  return (
    <div className="mt-4 text-muted-foreground">
      {
        NAVIGATION.map((nav, index) => <NavigationItem
          key={index}
          nav={nav}
          currentOpen={currentOpen}
          handleOpenCloseMenu={handleOpenCloseMenu}
          handleActivateMenu={handleActivateMenu}
        />)
      }
    </div>
  )
}

export default Navigation;
