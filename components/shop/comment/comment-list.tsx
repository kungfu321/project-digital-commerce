import { CommentProduct, PaginationType } from "@/types";
import CommentProductItem from "./comment-product-item";
import CommentLoadMore from "./comment-load-more";

interface CommentListProps {
  data: CommentProduct[];
  pagination: PaginationType;
}

const CommentList: React.FC<CommentListProps> = ({
  data,
  pagination
}) => {
  return (
    <div className="space-y-8 px-4 pb-8">
      {
        data?.map(item => <CommentProductItem key={item.id} data={item} />)
      }
      <CommentLoadMore pagination={pagination} />
    </div>
  )
}

export default CommentList;
