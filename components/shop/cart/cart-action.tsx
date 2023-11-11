'use client';

import { PaymentMethod as PaymentMethodType, User } from "@prisma/client";
import { useRouter } from "next/navigation";

import PaymentMethod from "../payment-method";
import { postRequest } from "@/lib/request";
import { useToast } from "@/components/ui/use-toast";
import useStore from "@/hooks/useStore";
import { useCartStore } from "@/hooks/useCartStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CartActionProps {
  paymentMethods: PaymentMethodType[];
  userInfo: User;
}

const CartAction: React.FC<CartActionProps> = ({
  paymentMethods,
  userInfo
}) => {
  const cartItems = useStore(useCartStore, (state) => state.items) || [];
  const cartCoupon = useStore(useCartStore, (state) => state.coupon);
  const cartAffiliateDiscount = useStore(useCartStore, (state) => state.affiliateDiscount);
  const { handleResetCart } = useCartStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = async (method: PaymentMethodType) => {
    try {
      const resp = await postRequest({
        url: '/api/orders/create',
        body: {
          paymentMethodId: method.id,
          couponCode: cartCoupon?.code,
          refCode: cartAffiliateDiscount?.code,
          cart: cartItems
        }
      });

      if (!resp?.success) {
        toast({ variant: "destructive", description: resp?.error?.message });
        return null;
      }

      handleResetCart();
      router.refresh();
      return resp.data;
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
      return null;
    }
  }

  return (
    <div>
      {
        userInfo ?
          <PaymentMethod
            className="mt-4"
            onCheckout={handleCheckout}
            showPaymentButton={!!cartItems.length}
            data={paymentMethods} />
          :
          <Link href={`/login?cb=/cart`}>
            <Button className="w-full mt-4">Login to checkout</Button>
          </Link>
      }
    </div>
  )
}

export default CartAction;
