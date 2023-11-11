import SidebarNav from "@/components/shared/sidebar-nav";
import { SHOP_USER_NAV } from "@/constants";
import { cn } from "@/lib/utils";

const ShopUserLayout = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className={cn(
      "grid grid-cols-1 w-full mt-4 space-y-2",
      "lg:grid-cols-4 lg:gap-4 lg:space-y-0"
    )}>
      <SidebarNav
        items={SHOP_USER_NAV}
        className="col-span-1 h-fit" />
      <div className="col-span-3 h-fit">{props.children}</div>
    </div>
  )
}

export default ShopUserLayout;
