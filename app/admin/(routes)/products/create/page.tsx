import PageHeader from "@/components/admin/page-header";
import CreateProductForm from "@/components/admin/product/create-product-form";
import { getCategories, getProducts } from "@/lib/getDataSVOnly";

const CreateProductPage = async () => {
  const { data: categories } = await getCategories();
  const { data: products } = await getProducts();

  return (
    <div>
      <PageHeader title="Create a new product" />
      <CreateProductForm
        categories={categories}
        products={products}
      />
    </div>
  )
}

export default CreateProductPage;
