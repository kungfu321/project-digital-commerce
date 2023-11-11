import { BadgeCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, dateTimeFormatted, firstLetters } from "@/lib/utils";
import { CommentProduct } from "@/types";
import Image from "next/image";

interface CommentProductItemProps {
  data: CommentProduct;
}

const CommentProductItem: React.FC<CommentProductItemProps> = ({ data }) => {
  return (
    <div className={cn(
      "w-full",
      "lg:grid lg:grid-cols-12"
    )}>
      <div className={cn(
        "flex items-center space-x-4 col-span-1",
        "lg:flex-col lg:text-center lg:space-x-0 lg:col-span-2"
      )}>
        <Avatar className="lg:w-16 lg:h-16">
          {
            data.user.imageUrl &&
            <Image
              src={data.user.imageUrl}
              width={64}
              height={64}
              alt={data.user.name || ''} />
          }
          <AvatarFallback>{firstLetters(data.user.name)}</AvatarFallback>
        </Avatar>
        <div className="lg:mt-2">
          <div>{data.user.name}</div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {dateTimeFormatted(data.createdAt)}
          </div>
        </div>
      </div>
      <div className={cn(
        "w-full mt-4",
        "lg:col-span-10 lg:mt-0"
      )}>
        {
          data.user.orders.length > 0 &&
          <div className="text-primary flex items-center text-sm">
            <BadgeCheck size={18} className="fill-primary text-white" />
            <span className="ml-1 font-light">Verified purchase</span>
          </div>
        }
        <p className="mt-1 font-light">{data.text}</p>
      </div>
    </div>
  )
}

export default CommentProductItem;
