'use client';

import { Coupon } from "@prisma/client";

import { cn, currencyFormatted } from "@/lib/utils";
import DiscountBox from "./discount-box";
import useStore from "@/hooks/useStore";
import { useCartStore } from "@/hooks/useCartStore";
import { AffiliateCheck } from "@/types";

const OrderSummary = () => {
  const cartCoupon = useStore(useCartStore, (state) => state.coupon);
  const cartAffiliateDiscount = useStore(useCartStore, (state) => state.affiliateDiscount);
  const cartItems = useStore(useCartStore, (state) => state.items) || [];
  const { handleAddCoupon, handleAddAffiliateDiscount } = useCartStore();

  const subTotal = cartItems.reduce((p, c) => p + (c.price * c.quantity), 0);
  let couponDiscount = 0;
  let affiliateDiscount = 0;
  if (cartCoupon) {
    if (cartCoupon.type === 'fixed') {
      couponDiscount = cartCoupon.discount;
    } else {
      couponDiscount = subTotal * cartCoupon.discount / 100;
    }
  }

  if (cartAffiliateDiscount) {
    affiliateDiscount = (subTotal - couponDiscount) * cartAffiliateDiscount.discountPercent / 100;
  }

  return (
    <div>
      <div className={cn(
        "bg-background rounded-lg p-4 shadow-lg"
      )}>
        <div className="text-lg font-medium">Order Summary</div>
        {
          !!cartItems.length &&
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-dashed text-muted-foreground">
              <div className="space-y-2">
                <div>Sub Total</div>
                <div>Coupon Discount</div>
                <div>Ref Discount</div>
              </div>
              <div className="text-end space-y-2">
                <div>{currencyFormatted(subTotal)}</div>
                <div>{couponDiscount ? currencyFormatted(couponDiscount) : '0'}</div>
                <div>{affiliateDiscount ? currencyFormatted(affiliateDiscount) : '0'}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4 font-medium text-lg">
              <div>Total</div>
              <div className="text-red-500">{currencyFormatted(subTotal - couponDiscount - affiliateDiscount)}</div>
            </div>
            <DiscountBox
              placeholder="Coupon code"
              url="/api/coupons/check"
              data={cartCoupon}
              onApply={(value) => handleAddCoupon(value as Coupon)}
              onRemove={handleAddCoupon}
              className="mb-4"
            />
            <DiscountBox
              placeholder="Ref code"
              url="/api/affiliates/check"
              data={cartAffiliateDiscount}
              onApply={(value) => handleAddAffiliateDiscount(value as AffiliateCheck)}
              onRemove={handleAddAffiliateDiscount}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default OrderSummary;
