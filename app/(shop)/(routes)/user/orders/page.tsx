import OrderTable from "@/components/shop/user/order/order-table";
import { getShopUserOrders } from "@/lib/getDataSVOnly";

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data: orders, pagination } = await getShopUserOrders(searchParams);

  return (
    <div>
      <OrderTable data={orders} pagination={pagination} />
    </div>
  )
}

export default OrdersPage;
