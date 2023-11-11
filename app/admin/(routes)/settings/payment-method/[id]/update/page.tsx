import UpdatePaymentMethodForm from "@/components/admin/setting/payment-method/update-payment-method-form";
import { getPaymentMethod } from "@/lib/getDataSVOnly";

const UpdatePaymentMethodPage = async ({ params }: { params: { id: string } }) => {
  const { data: paymentMethod } = await getPaymentMethod(params);
  if (!paymentMethod) {
    throw Error;
  }

  return (
    <div>
      <UpdatePaymentMethodForm data={paymentMethod} />
    </div>
  )
}

export default UpdatePaymentMethodPage;
