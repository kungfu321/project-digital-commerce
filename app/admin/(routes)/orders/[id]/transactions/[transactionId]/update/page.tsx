import UpdateTransactionForm from "@/components/admin/order/transaction/update-transaction-form";
import PageHeader from "@/components/admin/page-header";
import { getOrderTransaction, getShopPaymentMethods } from "@/lib/getDataSVOnly";

const UpdateTransactionPage = async ({ params }: { params: { id: string, transactionId: string } }) => {
  const { data: transaction } = await getOrderTransaction(params);
  const { data: paymentMethods } = await getShopPaymentMethods();

  if (!transaction) {
    throw Error;
  }

  return (
    <div>
      <PageHeader title="Update a transaction" />
      <UpdateTransactionForm
        data={transaction}
        paymentMethods={paymentMethods}
      />
    </div>
  )
}

export default UpdateTransactionPage;
