'use client';

import { Product } from "@prisma/client";
import Image from "next/image";
import useSWRInfinite from 'swr/infinite';

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import ProductCard from "./product/product-card";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

interface SearchResultProps {
  title?: string | React.ReactNode;
  className?: string;
}

const SearchResult: React.FC<SearchResultProps> = ({
  title,
  className,
}) => {
  const searchParams = useSearchParams();

  const {
    data,
    size,
    setSize,
    isLoading
  } = useSWRInfinite(
    (index) =>
      `/api/products?${searchParams.toString()}&skip=${index}`,
  );

  const products: Product[] = (data ? [].concat(...data) : []).map(({ data }) => data).flat();
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.pagination?.total <= 0;
  const pagination = data?.[0]?.pagination;
  const isReachingEnd = isEmpty || products.length >= pagination?.total;

  return (
    <Card className={cn(
      "p-4",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl">{title}</h2>
      </div>
      {
        isEmpty ?
          <div className="text-center text-muted-foreground flex flex-col items-center">
            <Image
              src='/images/illustration_404.svg'
              width={354}
              height={260}
              alt="404" />
          </div>
          :
          <div className={cn(
            "grid grid-cols-1 gap-4",
            "lg:grid-cols-4"
          )}>
            {
              products.map(item => <ProductCard key={item.id} data={item} />)
            }
          </div>
      }

      {
        !isReachingEnd && data &&
        <div className="text-center mt-4">
          <Button
            onClick={() => setSize(size + 1)}
            disabled={isLoadingMore}>Load more</Button>
        </div>
      }
    </Card>
  )
}

export default SearchResult;
