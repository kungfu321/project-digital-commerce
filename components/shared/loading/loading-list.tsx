import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingListProps {
  rowCount: number;
  showPagination?: boolean;
  showRightButton?: boolean;
  showHeader?: boolean;
  itemClassName?: string;
}

const LoadingList: React.FC<LoadingListProps> = ({
  rowCount,
  showPagination = true,
  showRightButton = true,
  showHeader = true,
  itemClassName
}) => {
  return (
    <div>
      {
        showHeader &&
        <div className="flex justify-between mb-8">
          <div>
            <Skeleton className="h-8 bg-background w-56 mb-3" />
            <Skeleton className="h-6 bg-background w-96" />
          </div>
          {
            showRightButton &&
            <Skeleton className="h-10 bg-background w-40" />
          }
        </div>
      }

      <Card className="p-4 space-y-1">
        <Skeleton className="h-12" />
        <div>
          {
            Array.from({ length: 10 }).map((_item, index) =>
              <div key={index} className={cn(
                "flex items-center justify-between h-16",
                itemClassName
              )}>
                {
                  Array.from({ length: rowCount }).map((_item, index) =>
                    <Skeleton key={index} className="h-5 w-32" />
                  )
                }
              </div>
            )
          }
        </div>
        {
          showPagination &&
          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        }
      </Card>
    </div>
  )
}

export default LoadingList;
