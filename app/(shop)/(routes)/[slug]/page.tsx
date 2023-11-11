import Comment from "@/components/shop/comment";
import ProductDescription from "@/components/shop/product/product-description";
import ProductInfo from "@/components/shop/product/product-info";
import { getShopProduct } from "@/lib/getDataSVOnly";

const ProductDetailPage = async ({
  params, searchParams
}: {
  params: { slug: string },
  searchParams: { skip: string }
}) => {
  const { data: product } = await getShopProduct({ slug: params.slug });

  if (!product) {
    throw Error;
  }

  return (
    <div className="space-y-4">
      <ProductInfo
        data={product}
        className="mt-2" />
      <ProductDescription data={product.description} />
      <Comment productId={product.id} {...searchParams} />
    </div>
  )
}

export default ProductDetailPage;
