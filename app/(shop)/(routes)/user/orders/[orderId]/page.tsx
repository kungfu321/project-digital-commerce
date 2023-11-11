import OrderDetail from "@/components/shop/user/order/order-detail";
import { getShopUserOrder } from "@/lib/getDataSVOnly";

const OrderDetailPage = async ({ params }: { params: { orderId: string } }) => {
  const { data: order } = await getShopUserOrder({ orderId: params.orderId });

  return (
    <div>
      <OrderDetail data={order} />
    </div>
  )
}

export default OrderDetailPage;
