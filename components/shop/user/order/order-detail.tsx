'use client';

import { Card } from "@/components/ui/card";
import { currencyFormatted, dateTimeFormatted } from "@/lib/utils";
import OrderDetailTable from "./order-detail-table";
import { ShopUserOrder } from "@/types";

interface OrderDetailProps {
  data: ShopUserOrder;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  data
}) => {
  let couponDiscount = 0;
  let affiliateDiscount = 0;
  if (data?.coupon) {
    if (data?.coupon.type === 'fixed') {
      couponDiscount = data?.coupon.discount;
    } else {
      couponDiscount = data.subTotal * data?.coupon.discount / 100;
    }
  }
  if (data?.affiliateId) {
    affiliateDiscount = (data.subTotal - couponDiscount) * Number(data.affiliateFriendEarnings) / 100;
  }

  return (
    <Card className="p-4">
      <div className="border-b border-dashed pb-4 mb-4 space-y-1">
        <h4 className=''>Order detail #{data.orderId}</h4>
        <div className='text-sm text-muted-foreground'>Date created: {dateTimeFormatted(data.createdAt, 'mm:HH dd MMM yyyy')}</div>
        <div className="text-sm text-muted-foreground">Status: <span className="text-foreground">{data.status}</span></div>
      </div>
      <OrderDetailTable data={data.orderItems} />
      <div className="border-t border-dashed pt-4 mt-4 text-end justify-end flex items-center">
        <div className="space-y-2">
          <div>Items Subtotal:</div>
          {
            data?.coupon &&
            <div>Coupon:</div>
          }
          {
            data?.affiliateId &&
            <div>Ref code:</div>
          }
          <div className="text-lg">Order Total:</div>
        </div>
        <div className="space-y-2 ml-8 font-semibold">
          <div>{currencyFormatted(data.subTotal)}</div>
          {
            data?.coupon &&
            <div>{currencyFormatted(couponDiscount)}</div>
          }
          {
            data?.affiliateId &&
            <div>{currencyFormatted(affiliateDiscount)}</div>
          }
          <div className="text-red-500 text-lg">{currencyFormatted(data.total)}</div>
        </div>
      </div>
    </Card>
  )
}

export default OrderDetail;
