"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

const SidebarNav: React.FC<SidebarNavProps> = ({ className, items, ...props }) => {
  const pathname = usePathname()

  return (
    <Card
      className={cn(
        "flex space-x-2 p-2 items-center",
        "lg:flex-col lg:space-x-0 lg:space-y-1 lg:items-start",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-secondary hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start text-foreground w-full"
          )}
        >
          {item.title}
        </Link>
      ))}
    </Card>
  )
}

export default SidebarNav;
