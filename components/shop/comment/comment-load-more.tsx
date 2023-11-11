'use client';

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PaginationType } from "@/types";
import { usePathname, useRouter } from "next/navigation";

interface CommentLoadMoreProps {
  pagination: PaginationType;
}

const CommentLoadMore: React.FC<CommentLoadMoreProps> = ({ pagination }) => {
  const [skip, setSkip] = useState(pagination?.skip);
  const router = useRouter();
  const pathname = usePathname();

  const handleUpdatePage = (action: string) => {
    let newSkip = skip;
    if (action === 'PREVIOUS') {
      newSkip = newSkip - pagination.take;
    } else {
      newSkip = newSkip + pagination.take;
    }

    setSkip(newSkip);

    const current = new URLSearchParams({ skip: String(newSkip) });
    router.push(`${pathname}?${current.toString()}#comments`);
  }

  if (pagination?.pageCount <= 1) return null;

  return (
    <div className="w-full text-center space-x-2">
      <Button
        size="sm"
        disabled={pagination?.skip <= 0}
        onClick={() => handleUpdatePage('PREVIOUS')}
        variant="secondary">Previous</Button>
      <Button
        size="sm"
        disabled={(pagination?.skip + pagination?.take) >= pagination?.total}
        onClick={() => handleUpdatePage('NEXT')}
        variant="secondary">Next</Button>
    </div>
  )
}

export default CommentLoadMore;
