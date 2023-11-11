import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingFormProps {
}

const LoadingForm: React.FC<LoadingFormProps> = ({
}) => {
  return (
    <div className="">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-8 bg-background w-56 mb-3" />
          <Skeleton className="h-6 bg-background w-96" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-8">
        <Card className={cn(
          "p-4 col-span-4 h-fit space-y-4",
          "lg:col-span-3"
        )}>
          {
            Array.from({ length: 6 }).map((_item, index) =>
              <div key={index}>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 mt-2" />
              </div>
            )
          }
        </Card>
        <div className={cn(
          "col-span-4 h-fit space-y-4",
          "lg:col-span-1"
        )}>
          <Card className="p-4 space-y-4">
            {
              Array.from({ length: 3 }).map((_item, index) =>
                <div key={index}>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 mt-2" />
                </div>
              )
            }
          </Card>
          <Skeleton className="h-10 bg-background" />
        </div>
      </div>
    </div>
  )
}

export default LoadingForm;
