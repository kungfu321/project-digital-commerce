import { BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NotificationDropdown = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative"
        >
          <BellIcon fill="#919EAB" color="#919EAB" />
          <div className="absolute top-0 right-2 bg-red-500 rounded-full w-5 h-5 text-center flex items-center justify-center">
            <span className="text-sm font-semibold text-white mt-0.5">2</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  )
}

export default NotificationDropdown;
