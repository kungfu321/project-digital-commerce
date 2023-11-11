"use client";

import { CopyIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { absoluteUrl, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Card } from "@/components/ui/card";
import { UserExtra } from "@/types";
import { putRequest } from "@/lib/request";
import { useState } from "react";

interface AffiliateInfoProps {
  userInfo: UserExtra;
}

const AffiliateInfo: React.FC<AffiliateInfoProps> = ({
  userInfo
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [_value, copy] = useCopyToClipboard();
  const [loading, setLoading] = useState(false);

  const fullUrl = absoluteUrl(`${pathname}?ref=${userInfo?.affiliate?.code}`);

  const handleCopy = () => {
    copy(fullUrl);
    toast({ description: 'Copied' });
  }

  const handleUpdate = async (earnings: number) => {
    try {
      setLoading(true);
      const resp = await putRequest({
        url: '/api/user/affiliates/update',
        body: {
          earnings
        }
      });
      if (!resp?.success) {
        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      router.refresh();
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Card className="p-4 space-y-4">
        <div>
          <div className="text-lg font-medium">Referral link</div>
          <div className="flex items-center space-x-2 mt-4">
            <Input readOnly defaultValue={fullUrl} />
            <Button onClick={handleCopy}>
              <CopyIcon size={18} />
            </Button>
          </div>
        </div>
        <div className="border-t border-dashed pt-4">
          <div className="text-lg font-medium mb-4">Setting</div>
          <Card className={cn(
            "p-4",
            "lg:flex lg:items-center lg:justify-between"
          )}>
            <div className="flex items-center text-center justify-around w-full">
              <div>
                <div className="text-sm text-muted-foreground mb-4">You receive</div>
                <div className="font-semibold">{userInfo?.affiliate?.earnings}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-4">Friends receive</div>
                <div className="font-semibold">{userInfo?.affiliate?.friendEarnings}%</div>
              </div>
            </div>
            <div className="text-center w-full">
              <div className="text-sm text-muted-foreground">Choose the percentage you want to receive</div>
              <div className="space-x-1 mt-4">
                {
                  Array.from({ length: 6 }).map((_item, index) =>
                    <Button
                      key={index}
                      disabled={loading}
                      onClick={() => handleUpdate(index)}
                      variant={index === userInfo?.affiliate?.earnings ? 'default' : 'outline'}
                      size="sm">{index}%</Button>
                  )
                }
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  )
}

export default AffiliateInfo;
