import PageHeader from "@/components/admin/page-header";
import CreateBannerForm from "@/components/admin/banner/create-banner-form";

const CreateBannerPage = async () => {
  return (
    <div>
      <PageHeader title="Create a new banner" />
      <CreateBannerForm />
    </div>
  )
}

export default CreateBannerPage;
