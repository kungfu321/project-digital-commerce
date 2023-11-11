import Link from "next/link";
import { ChevronRight, CircleDotDashed, DotIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { NavigationType } from "@/types";
import NavIcon from "./nav-icon";

interface NavigationItemProps {
  nav: NavigationType;
  currentOpen?: string | null;
  handleActivateMenu: (url?: string) => boolean;
  handleOpenCloseMenu: (nav: NavigationType) => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  nav,
  currentOpen,
  handleActivateMenu,
  handleOpenCloseMenu
}) => {
  const RenderDiv = (props: { children: React.ReactNode }) => {
    const { children } = props;

    return <div {...props}>{children}</div>
  }

  const Comp = nav.url ? Link : RenderDiv;

  return (
    <div className="py-4">
      <Comp href={nav.url ?? '#'}>
        <div className={cn(
          "flex items-center text-muted-foreground justify-between",
          "hover:cursor-pointer hover:text-primary hover:font-medium",
          handleActivateMenu(nav.url) && "text-primary font-medium"
        )}
          onClick={() => handleOpenCloseMenu(nav)}>
          <div className="flex items-center">
            {
              nav.icon &&
              <NavIcon icon={nav.icon} />
            }
            <span className="ml-4 text-lg">{nav.title}</span>
          </div>
          {
            nav.children &&
            <ChevronRight className={cn(
              currentOpen === nav.slug && "transition duration-300 rotate-90"
            )} />
          }
        </div>
      </Comp>
      {
        nav.slug === currentOpen && nav.children?.map((navChild, index) =>
          navChild.hidden ? null :
            <Link
              href={navChild.url as string}
              key={index}
              className={cn(
                "flex items-center pt-4 text-muted-foreground",
                "hover:cursor-pointer hover:text-primary hover:font-medium",
                handleActivateMenu(navChild.url) && "text-primary font-medium"
              )}>
              {
                handleActivateMenu(navChild.url) ?
                  <div className="w-6 h-6 flex items-center justify-center">
                    <CircleDotDashed size={12} />
                  </div>
                  :
                  <DotIcon />
              }
              <span className="ml-4 text-lg">{navChild.title}</span>
            </Link>
        )
      }
    </div>
  )
}

export default NavigationItem;
