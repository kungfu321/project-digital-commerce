import { BadgePercent, BookMarked, Layers3, LayoutDashboard, Settings2, ShoppingBasket, ShoppingCart, Store, User } from "lucide-react";

interface NavIconProps {
  icon: string;
}

const iconComponents: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  product: ShoppingCart,
  setting: Settings2,
  user: User,
  category: Layers3,
  shop: Store,
  blog: BookMarked,
  coupon: BadgePercent,
  order: ShoppingBasket
};

const NavIcon: React.FC<NavIconProps> = ({ icon, ...props }) => {
  const IconComponent = iconComponents[icon];
  return IconComponent ? <IconComponent {...props} /> : null;
};

export default NavIcon;
