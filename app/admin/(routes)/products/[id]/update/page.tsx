import PageHeader from "@/components/admin/page-header";
import UpdateProductForm from "@/components/admin/product/update-product-form";
import { getCategories, getProduct, getProducts } from "@/lib/getDataSVOnly";

const UpdateProductPage = async ({ params }: { params: { id: string } }) => {
  const { data: product } = await getProduct({ id: params.id });

  if (!product) {
    throw Error;
  }

  const { data: categories } = await getCategories();
  const { data: products } = await getProducts();

  return (
    <div>
      <PageHeader title="Update a product" />
      <UpdateProductForm
        categories={categories}
        products={products}
        data={product}
      />
    </div>
  )
}

export default UpdateProductPage;
