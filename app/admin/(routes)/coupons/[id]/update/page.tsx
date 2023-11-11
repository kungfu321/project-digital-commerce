import UpdateCouponForm from "@/components/admin/coupon/update-coupon-form";
import PageHeader from "@/components/admin/page-header";
import { getCoupon } from "@/lib/getDataSVOnly";

const UpdateCouponPage = async ({ params }: { params: { id: string } }) => {
  const { data: coupon } = await getCoupon({ id: params.id });

  if (!coupon) {
    throw Error;
  }

  return (
    <div>
      <PageHeader title="Update a coupon" />
      <UpdateCouponForm
        data={coupon}
      />
    </div>
  )
}

export default UpdateCouponPage;
