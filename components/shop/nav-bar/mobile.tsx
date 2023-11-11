"use client";

import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Mobile = () => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="pr-0">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="border-none pt-10">
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Mobile;
