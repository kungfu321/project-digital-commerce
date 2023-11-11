"use client";

import { CopyIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { absoluteUrl } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface ProductReferProps {
  refCode?: string;
}

const ProductRefer: React.FC<ProductReferProps> = ({
  refCode
}) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const [_value, copy] = useCopyToClipboard();

  const fullUrl = absoluteUrl(`${pathname}${refCode ? '?ref=' + refCode : ''}`);

  const handleCopy = () => {
    copy(fullUrl);
    toast({ description: 'Copied' });
  }

  return (
    <div>
      <div className="text-lg font-semibold mb-1 mt-4">Refer friends</div>
      <div className="text-sm text-muted-foreground">Friends get 5% off product prices and you receive a permanent commission.</div>
      <div className="flex items-center space-x-2 mt-4">
        <Input readOnly defaultValue={fullUrl} />
        <Button onClick={handleCopy}>
          <CopyIcon size={18} />
        </Button>
      </div>
    </div>
  )
}

export default ProductRefer;
