import MobileSideBar from "../side-bar/mobile-side-bar";
import UserDropdown from "./user-dropdown";
import { cn } from "@/lib/utils";
import NotificationDropdown from "./notification-dropdown";
import ThemeToggle from "../../shared/theme-toggle";
import { getUserInfo } from '@/lib/getDataSVOnly';

const TopBar = async () => {
  const { data: userInfo } = await getUserInfo();

  return (
    <div className={cn(
      "flex items-center justify-between p-4 space-x-8 sticky top-0 bg-background z-50",
      "lg:justify-end"
    )}>
      <MobileSideBar />
      <div className="flex items-center">
        <ThemeToggle />
        <NotificationDropdown />
        <div className="ml-4">
          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </div>
  )
}

export default TopBar;
