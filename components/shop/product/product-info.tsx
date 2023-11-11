import { Category, Product, User } from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, currencyFormatted } from "@/lib/utils";
import ProductAction from "./product-action";
import ProductRefer from "./product-refer";
import { getUserInfo } from "@/lib/getDataSVOnly";
import { Card } from "@/components/ui/card";

interface ProductInfoProps extends React.HTMLAttributes<HTMLElement> {
  data: Product & {
    productsVariants: Product[];
    category: Category;
  };
}

const ProductInfo: React.FC<ProductInfoProps> = async ({
  data,
  className,
}) => {
  const calculateDiscountPercent = useMemo(() => {
    const price = data.price;
    const discountPrice = data.discountPrice;

    const result = Math.round(((price - discountPrice) / price) * 100);
    return `-${result}%`;
  }, [data]);
  const { data: userInfo } = await getUserInfo();

  return (
    <Card className={cn(
      "p-2 pb-4",
      className
    )}>
      <div className={cn(
        "grid grid-cols-1",
        "lg:grid-cols-8 lg:gap-8"
      )}>
        <div className="relative aspect-video col-span-3">
          <Image
            src={data.imageUrl}
            fill
            sizes=""
            className="rounded-lg"
            alt={data.name} />
        </div>
        <div className="mt-4 col-span-3">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant='destructive'>{calculateDiscountPercent}</Badge>
            <div className="text-sm text-muted-foreground">Sku: {data.sku}</div>
          </div>
          <h2 className="text-lg">{data.name}</h2>
          <div className="text-sm text-muted-foreground mt-2">
            Available: <span>{data.stock > 0 ? 'In Stock' : ' Out of Stock'}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Category:
            <Link
              href={`/category/${data.category.slug}`}
              className={cn(
                "text-muted-foreground ml-1",
                "hover:underline hover:text-primary"
              )}>
              {data.category.name}
            </Link>
          </div>
          <div className="text-lg border-b border-dashed pb-4 my-4">
            <span className="text-muted-foreground line-through font-medium">{currencyFormatted(data.price)}</span>
            <span className="font-semibold ml-2">{currencyFormatted(data.discountPrice)}</span>
          </div>
          {
            data.productsVariants.length > 0 &&
            <div className="border-b border-dashed pb-2 my-4">
              <div className="text-lg font-semibold mb-2">{data.variantLabel}</div>
              <div className="flex flex-wrap items-center">
                <Link href={`/${data.slug}`} className="ml-2 mb-2">
                  <Button size='sm' className="px-2 h-7">{data.shortName || data.name}</Button>
                </Link>
                {
                  data.productsVariants.map(item =>
                    <Link key={item.id} href={`/${item.slug}`} className="ml-2 mb-2">
                      <Button variant='outline' size='sm' className="px-2 h-7">{item.shortName || item.name}</Button>
                    </Link>
                  )
                }
              </div>
            </div>
          }
          <ProductAction data={data} />
        </div>
        <div className="col-span-2">
          <ProductRefer refCode={userInfo?.affiliate?.code} />
        </div>
      </div>
    </Card>
  )
}

export default ProductInfo;
