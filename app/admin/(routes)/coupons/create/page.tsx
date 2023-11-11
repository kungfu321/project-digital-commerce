import CreateCouponForm from "@/components/admin/coupon/create-coupon-form";
import PageHeader from "@/components/admin/page-header";

const CreateCouponPage = async () => {
  return (
    <div>
      <PageHeader title="Create a new coupon" />
      <CreateCouponForm />
    </div>
  )
}

export default CreateCouponPage;
