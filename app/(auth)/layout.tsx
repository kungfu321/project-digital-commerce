import { cn } from "@/lib/utils";

const AuthLayout = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className={cn(
      "p-6",
      "lg:p-4"
    )}>
      {props.children}
    </div>
  )
}

export default AuthLayout;
