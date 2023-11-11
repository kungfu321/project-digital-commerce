import CreateCategoryForm from "@/components/admin/category/create-category-form";
import PageHeader from "@/components/admin/page-header";

const CreateCategoryPage = async () => {
  return (
    <div>
      <PageHeader title="Create a new category" />
      <CreateCategoryForm />
    </div>
  )
}

export default CreateCategoryPage;
