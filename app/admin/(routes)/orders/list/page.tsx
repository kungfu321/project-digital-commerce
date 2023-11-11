import OrderTable from "@/components/admin/order/order-table";
import PageHeader from "@/components/admin/page-header";
import { getOrders } from "@/lib/getDataSVOnly";

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data: orders, pagination } = await getOrders({ ...searchParams });

  return (
    <div>
      <PageHeader title="Order List" />

      <OrderTable
        data={orders}
        pagination={pagination}
        className="mt-8" />
    </div>
  )
}

export default OrdersPage;
