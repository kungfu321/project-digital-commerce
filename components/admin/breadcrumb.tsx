"use client";

import { DotIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { NAVIGATION } from "@/constants";
import { cn } from "@/lib/utils";
import { NavigationType } from "@/types";

const Breadcrumb = () => {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const getBreadcrumbs = (array: NavigationType[], url: string): string[] =>
      array.flatMap((item) => {
        const urlPattern = new RegExp(
          `^${item.url?.replace(/\[id\]/g, '(\\d+)')}$`
        );

        if (urlPattern.test(url)) {
          if (item.breadcrumbs) {
            return item.breadcrumbs;
          }
        } else if (item.children) {
          const childBreadcrumbs = getBreadcrumbs(item.children, url);
          if (childBreadcrumbs.length) {
            return [item.title, ...childBreadcrumbs];
          }
        }
        return [];
      });

    return getBreadcrumbs(NAVIGATION, pathname);
  }, [pathname]);


  return (
    <div className="flex items-center text-sm">
      <Link
        href="/admin/dashboard"
        className={cn(
          "text-muted-foreground",
          "hover:text-primary"
        )}>Dashboard</Link>
      {
        breadcrumbs.map((item, index) =>
          <div
            key={item}
            className={cn(
              "flex items-center text-muted-foreground",
              index === breadcrumbs.length - 1 && "opacity-60"
            )}
          >
            <DotIcon />
            <span>{item}</span>
          </div>)
      }
    </div>
  )
}

export default Breadcrumb;
