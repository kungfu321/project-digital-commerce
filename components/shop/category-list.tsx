import { Category } from "@prisma/client";

import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryListProps extends React.HTMLAttributes<HTMLElement> {
  data: Category[];
}

const COLORS = [
  'bg-rose-500',
  'bg-primary',
  'bg-teal-500',
  'bg-sky-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-blue-500',
  'bg-purple-500',
];

const CategoryList: React.FC<CategoryListProps> = ({
  data,
  className
}) => {
  return (
    <Card className={cn(
      "p-4",
      className
    )}>
      <div className={cn(
        "grid grid-cols-2 gap-4",
        "lg:grid-cols-4"
      )}>
        {
          data?.map((item, index) => <Link href={`/search?category=${item.slug}`} key={item.slug}>
            <Card
              className={cn(
                "p-2 text-center h-20 flex items-center justify-center text-background text-lg",
                COLORS[index]
              )}>
              <div>{item.name}</div>
            </Card>
          </Link>)
        }
      </div>
    </Card>
  )
}

export default CategoryList;
