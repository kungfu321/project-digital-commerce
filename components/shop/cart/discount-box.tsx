import { useEffect, useState } from "react";
import { Coupon } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { postRequest } from "@/lib/request";
import { cn } from "@/lib/utils";
import { AffiliateCheck } from "@/types";

interface DiscountBoxProps extends React.HTMLAttributes<HTMLElement> {
  placeholder: string;
  onApply: <T>(value: T) => void;
  onRemove: () => void;
  url: string;
  data?: Coupon | AffiliateCheck;
}

const DiscountBox: React.FC<DiscountBoxProps> = ({
  placeholder,
  url,
  onApply,
  onRemove,
  data,
  className
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCode(data?.code || '');
  }, [data]);

  const handleCheck = async () => {
    if (data) {
      setCode('');
      return onRemove();
    }

    try {
      setLoading(true);
      const resp = await postRequest({
        url,
        body: {
          code,
        }
      });

      if (!resp?.success) {
        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      onApply(resp.data);
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn(
      "relative",
      className
    )}>
      <Input
        className="h-10"
        onChange={(e) => setCode(e.target.value)}
        value={code}
        disabled={!!data || loading}
        placeholder={placeholder} />
      <Button
        className={cn(
          "absolute p-0 top-0 right-4 text-primary",
          "hover:bg-transparent"
        )}
        disabled={loading || !code}
        onClick={handleCheck}
        variant="ghost">{data ? 'Remove' : 'Apply'}</Button>
    </div>
  )
}

export default DiscountBox;
