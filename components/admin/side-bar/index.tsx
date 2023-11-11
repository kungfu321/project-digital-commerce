import Logo from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import Navigation from "./navigation";

interface SideBarProps extends React.HTMLAttributes<HTMLElement> {
}

const SideBar: React.FC<SideBarProps> = ({ className }) => {
  return (
    <div className={cn(
      "w-72 border-r border-dashed h-screen p-4",
      className
    )}>
      <Logo href="/" />

      <Navigation />
    </div>
  )
}

export default SideBar;
