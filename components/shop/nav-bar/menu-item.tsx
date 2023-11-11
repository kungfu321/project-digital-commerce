import { cn } from "@/lib/utils";
import Link from "next/link";

interface MenuItemProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, href, isActive }) => {
  return (
    <Link href={href} className={cn(
      "text-foreground flex items-center text-sm font-medium",
      "hover:text-primary",
      isActive && "text-primary"
    )}>
      {
        icon &&
        <span className="mr-2">{icon}</span>
      }
      <span>{title}</span>
    </Link>
  )
}

export default MenuItem;
