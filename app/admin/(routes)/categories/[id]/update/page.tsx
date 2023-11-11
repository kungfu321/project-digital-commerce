import UpdateCategoryForm from "@/components/admin/category/update-category-form";
import PageHeader from "@/components/admin/page-header";
import { getCategory } from "@/lib/getDataSVOnly";

const UpdateCategoryPage = async ({ params }: { params: { id: string } }) => {
  const { data: category } = await getCategory({ id: params.id });

  if (!category) {
    throw Error;
  }

  return (
    <div>
      <PageHeader title="Update a category" />
      <UpdateCategoryForm
        data={category}
      />
    </div>
  )
}

export default UpdateCategoryPage;
