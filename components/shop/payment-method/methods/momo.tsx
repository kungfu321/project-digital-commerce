'use client';

import { PaymentMethod } from "@prisma/client";
import { useState } from "react";
import QRCode from 'qrcode.react';
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { OrderPayment } from "@/types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn, currencyFormatted } from "@/lib/utils";
import Image from "next/image";

interface MoMoMethodProps {
  data: PaymentMethod;
  showPaymentButton: boolean;
  onCheckout: (method: PaymentMethod) => Promise<OrderPayment | null>;
}

const MoMoMethod: React.FC<MoMoMethodProps> = ({
  data,
  onCheckout,
  showPaymentButton
}) => {
  const [order, setOrder] = useState<OrderPayment>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    const order = await onCheckout(data);

    if (order) {
      setOrder(order);
    }
    setLoading(false);
  }

  const handleRedirectAfterPaid = () => {
    router.push(`/user/orders/${order?.orderId}`);
  }

  return (
    <div>
      {
        showPaymentButton &&
        <Button
          className={cn(
            "w-full bg-[#ae2070]",
            "hover:bg-[#ae2070]/90"
          )}
          disabled={loading}
          onClick={handleCheckout}>
          <Image src={`/icons/payment-method/${data.code}.svg`} width={30} height={30} alt={data.name} />
          <span className="ml-2">{data.description}</span>
        </Button>
      }

      {
        order?.qrCodeValue &&
        <Dialog open={!!order.qrCodeValue}>
          <DialogContent>
            <div className="text-center">
              <div className="w-full flex flex-col items-center space-y-4">
                <div>
                  Open <strong>MoMo App</strong> and scan the QRCode
                </div>
                <QRCode
                  value={order.qrCodeValue}
                  size={200}
                  className="border p-4 rounded-lg"
                  renderAs="canvas" />
                <div className="border p-4 rounded-lg border-red-500 w-full">
                  <div className="text-3xl font-semibold text-red-500">
                    {currencyFormatted(order.total)}
                  </div>
                  <div className="mt-1 text-muted-foreground text-lg">
                    NOTE: OKX{order.orderId}
                  </div>
                </div>
                <Button onClick={handleRedirectAfterPaid}>I have already paid</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      }
    </div>
  )
}

export default MoMoMethod;
