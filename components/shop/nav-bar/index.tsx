import Logo from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import SearchBar from "./search-bar";
import MobileMenu from "./mobile";
import Cart from "./cart";
import UserDropdown from "./user-dropdown";
import { getUserInfo } from "@/lib/getDataSVOnly";

const NavBar = async () => {
  const { data: userInfo } = await getUserInfo();

  return (
    <div className="py-4 shadow-sm bg-background">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Logo href="/" />
        <div className={cn(
          "flex items-center space-x-2",
          "lg:space-x-4"
        )}>
          <SearchBar />
          <UserDropdown userInfo={userInfo} />
          <Cart />
          <MobileMenu />
        </div>
      </div>
    </div>
  )
}

export default NavBar;
