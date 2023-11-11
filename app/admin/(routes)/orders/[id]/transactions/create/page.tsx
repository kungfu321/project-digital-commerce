import PageHeader from "@/components/admin/page-header";
import CreateTransactionForm from "@/components/admin/order/transaction/create-transaction-form";
import { getShopPaymentMethods } from "@/lib/getDataSVOnly";

const CreateTransactionPage = async ({ params }: { params: { id: string } }) => {
  const { data: paymentMethods } = await getShopPaymentMethods();

  return (
    <div>
      <PageHeader title="Create a new transaction" />
      <CreateTransactionForm
        orderId={params.id}
        paymentMethods={paymentMethods} />
    </div>
  )
}

export default CreateTransactionPage;
