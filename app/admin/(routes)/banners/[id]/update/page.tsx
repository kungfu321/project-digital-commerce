import PageHeader from "@/components/admin/page-header";
import { getBanner } from "@/lib/getDataSVOnly";
import UpdateBannerForm from "@/components/admin/banner/update-banner-form";

const UpdateBannerPage = async ({ params }: { params: { id: string } }) => {
  const { data: banner } = await getBanner({ id: params.id });

  if (!banner) {
    throw Error;
  }

  return (
    <div>
      <PageHeader title="Update a banner" />
      <UpdateBannerForm
        data={banner}
      />
    </div>
  )
}

export default UpdateBannerPage;
