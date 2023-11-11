import { Product } from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";

import { cn, currencyFormatted } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ProductCardProps extends React.HTMLAttributes<HTMLElement> {
  data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ data, className }) => {
  const calculateDiscountPercent = useMemo(() => {
    const price = data.price;
    const discountPrice = data.discountPrice;

    const result = Math.round(((price - discountPrice) / price) * 100);
    return `-${result}%`;
  }, [data]);

  return (
    <Card className={cn(
        "aspect-video relative",
        className
      )}>
      <div className="relative aspect-video mb-2">
        <Link href={`/${data.slug}`}>
          <Image
            src={data.imageUrl}
            fill
            priority
            sizes=""
            className="rounded-lg"
            alt={data.name} />
        </Link>
        {
          !data.stock &&
          <Badge
            variant="secondary"
            className="absolute top-1 right-1">Out of stock</Badge>
        }
      </div>
      <div className={cn(
        "p-2",
        "lg:min-h-[88px]"
      )}>
        <Link
          href={`/${data.slug}`}
          className="line-clamp-2 text-sm text-foreground">{data.name}</Link>
        <Link
          href={`/${data.slug}`}
          className="flex items-center space-x-2 mt-2 font-semibold text-foreground">
          <span>{currencyFormatted(data.discountPrice)}</span>
          <span className="text-muted-foreground line-through font-medium">{currencyFormatted(data.price)}</span>
          <Badge variant="destructive">{calculateDiscountPercent}</Badge>
        </Link>
      </div>
    </Card>
  )
}

export default ProductCard;
