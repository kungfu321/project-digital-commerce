"use client";

import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "@/components/shared/logo";
import Navigation from "./navigation";
import ThemeToggle from "../../shared/theme-toggle";

const MobileSideBar = () => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="p-0">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="border-none">
          <Logo />
          <div className="absolute bottom-6 left-2">
            <ThemeToggle />
          </div>
          <Navigation />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileSideBar;
