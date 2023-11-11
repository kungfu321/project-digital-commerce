import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  data: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  className,
  data
}) => {
  if (!data) return null;

  return (
    <Card className={cn(
      "p-2 px-4",
      className
    )}>
      <div className="prose prose-base dark:prose-invert prose-h2:mt-1 prose-p:my-1">
        <div dangerouslySetInnerHTML={{ __html: data }} />
      </div>
    </Card>
  )
}

export default ProductDescription;
