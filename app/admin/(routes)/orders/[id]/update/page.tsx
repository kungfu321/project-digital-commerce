import UpdateOrderForm from "@/components/admin/order/update-order-form";
import PageHeader from "@/components/admin/page-header";
import { SWRProvider } from "@/components/swr-provider";
import { getOrder } from "@/lib/getDataSVOnly";

const UpdateOrderPage = async ({ params }: { params: { id: string } }) => {
  const { data: order } = await getOrder({ id: params.id });

  if (!order) {
    throw Error;
  }

  return (
    <div>
      <PageHeader title="Update a order" />
      <SWRProvider>
        <UpdateOrderForm
          data={order}
        />
      </SWRProvider>
    </div>
  )
}

export default UpdateOrderPage;
