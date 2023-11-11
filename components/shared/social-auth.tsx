import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SocialAuthProps extends React.HTMLAttributes<HTMLElement> {
}

const SocialAuth: React.FC<SocialAuthProps> = ({ className }) => {
  return (
    <div className={cn(
      "flex space-x-2",
      className
    )}>
      <Button variant="outline" className="w-full">
        <Image
          src="/icons/google.svg"
          width={24}
          height={24}
          alt="Google" />
      </Button>
      <Button variant="outline" className="w-full">
        <Image
          src="/icons/facebook.svg"
          width={24}
          height={24}
          alt="Facebook" />
      </Button>
      <Button variant="outline" className="w-full">
        <Image
          src="/icons/twitter.svg"
          width={24}
          height={24}
          alt="Twitter" />
      </Button>
    </div>
  )
}

export default SocialAuth;
