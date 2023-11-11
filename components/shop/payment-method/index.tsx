'use client';

import { PaymentMethod as PaymentMethodType } from "@prisma/client";

import MoMoMethod from "./methods/momo";
import { cn } from "@/lib/utils";
import { OrderPayment } from "@/types";

interface PaymentMethodProps extends React.HTMLAttributes<HTMLElement> {
  data: PaymentMethodType[];
  showPaymentButton: boolean;
  onCheckout: (method: PaymentMethodType) => Promise<OrderPayment | null>;
}

const paymentMethodComponents: Record<string, React.FC<any>> = {
  momo: MoMoMethod,
};

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  data,
  className,
  onCheckout,
  showPaymentButton
}) => {
  return (
    <div className={cn(
      "space-y-2",
      className
    )}>
      {
        showPaymentButton &&
        <div className="text-sm text-center text-muted-foreground">
          Click to create a payment order immediately
        </div>
      }
      {data.map((item) => {
        const PaymentComponent = paymentMethodComponents[item.code];
        if (PaymentComponent) {
          return <PaymentComponent
            key={item.code}
            onCheckout={onCheckout}
            showPaymentButton={showPaymentButton}
            data={item} />;
        }
        return null;
      })}
    </div>
  )
}

export default PaymentMethod;
