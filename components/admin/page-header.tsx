import { cn } from "@/lib/utils";
import Breadcrumb from "./breadcrumb";

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, children, className }) => {
  return (
    <div className={cn(
      "w-full",
      "lg:flex lg:justify-between",
      className
    )}>
      <div>
        <h4 className="mb-2">{title}</h4>
        <Breadcrumb />
      </div>
      <div>{children}</div>
    </div>
  )
}

export default PageHeader;
