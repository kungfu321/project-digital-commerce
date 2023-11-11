import PaymentMethodTable from '@/components/admin/setting/payment-method/payment-method-table'
import { getPaymentMethods } from '@/lib/getDataSVOnly';

const PaymentMethodPage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data: paymentMethods, pagination } = await getPaymentMethods(searchParams);

  return (
    <div>
      <PaymentMethodTable data={paymentMethods} pagination={pagination} />
    </div>
  )
}

export default PaymentMethodPage;
