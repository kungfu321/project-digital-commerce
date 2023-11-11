import Logo from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import Image from "next/image";
import SocialAuth from "./social-auth";

interface AuthContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  title: string;
  headerTitle: string;
  description: string;
  image: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  className,
  title,
  description,
  image,
  headerTitle
}) => {
  return (
    <div className={cn(
      "lg:grid lg:grid-flow-row lg:grid-cols-5",
      className
    )}>
      <div className="lg:col-span-1 lg:shadow-lg lg:dark:bg-secondary lg:rounded-lg lg:h-[calc(100vh-32px)]">
        <Logo href="/" className={cn(
          "mb-4",
          "lg:pt-10 lg:pl-10 lg:mb-0"
        )} />
        <div className={cn(
          "hidden",
          "lg:flex lg:flex-col lg:justify-center lg:h-full"
        )}>
          <h3 className="mb-10 ml-10">{headerTitle}</h3>
          <Image
            src={image}
            width={364}
            height={273}
            alt="illustration login" />
        </div>
      </div>
      <div className="lg:col-span-4 lg:mt-[20%]">
        <div className="max-w-md mx-auto">
          <h4>{title}</h4>
          <div className="text-muted-foreground text-sm font-light">{description}</div>
          <SocialAuth className="pb-4 pt-8" />
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthContainer;
