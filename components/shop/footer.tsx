import { cn } from "@/lib/utils";
import Logo from "../shared/logo";
import ThemeToggle from "../shared/theme-toggle";

const Footer = () => {
  return (
    <footer className="bg-background mt-8">
      <div className={cn(
        "max-w-6xl mx-auto p-4 py-8 grid grid-cols-1 gap-4",
        "lg:grid-cols-3"
      )}>
        <div className="flex items-center space-x-4">
          <Logo href="/" />
          <ThemeToggle />
        </div>
        <div className="text-sm text-muted-foreground text-center">
          Copyright 2023 © OKeyXin
        </div>
      </div>
    </footer>
  )
}

export default Footer;
