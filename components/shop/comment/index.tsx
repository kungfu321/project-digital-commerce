import { cn } from "@/lib/utils";
import CommentBoxForm from "./comment-box-form";
import CommentList from "./comment-list";
import { getShopProductComments, getUserInfo } from "@/lib/getDataSVOnly";
import { Card } from "@/components/ui/card";

interface CommentProps extends React.HTMLAttributes<HTMLElement> {
  productId: string;
  skip?: string;
}

const Comment: React.FC<CommentProps> = async ({
  className,
  productId,
  skip
}) => {
  const { data: comments, pagination } = await getShopProductComments({ productId, skip });

  const { data: userInfo } = await getUserInfo();

  return (
    <Card className={cn(
      "p-2",
      className
    )}>
      <h3 className="text-lg mb-2" id="comments">Comments</h3>
      <div className="border-b border-dashed pb-4 mb-4">
        <CommentBoxForm
          userId={userInfo?.id}
          productId={productId} />
      </div>
      <CommentList
        data={comments}
        pagination={pagination}
      />
    </Card>
  )
}

export default Comment;
