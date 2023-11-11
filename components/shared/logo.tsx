import { Command } from "lucide-react";
import { Poppins } from 'next/font/google';
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
}

const poppins = Poppins({ weight: "700", subsets: ['latin'] });

const Logo: React.FC<LogoProps> = ({ className, href = '#' }) => {
  return (
    <Link href={href} className={cn(
      "flex items-center animate-pulse",
      "hover:animate-none",
      className
    )}>
      <Command color="#16a34a" />
      <span className={cn(
        "ml-1 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-primary to-90%",
        poppins.className
      )}>
        OKeyXin
      </span>
    </Link>
  )
}

export default Logo;
