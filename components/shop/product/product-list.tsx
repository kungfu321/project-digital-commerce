import { Product } from "@prisma/client";
import Image from "next/image";

import ProductCard from "./product-card";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ProductListProps {
  title?: string | React.ReactNode;
  data: Product[],
  className?: string;
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  data,
  className,
}) => {
  return (
    <Card className={cn(
      "p-4",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl">{title}</h2>
      </div>
      {
        data?.length > 0 ?
          <div className={cn(
            "grid grid-cols-1 gap-4",
            "lg:grid-cols-4"
          )}>
            {
              data.map((item, index) => <ProductCard key={index} data={item} />)
            }
          </div>
          :
          <div className="text-center text-muted-foreground flex flex-col items-center">
            <Image
              src='/images/illustration_404.svg'
              width={354}
              height={260}
              alt="404" />
          </div>
      }
    </Card>
  )
}

export default ProductList;
