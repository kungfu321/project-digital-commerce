import Comment from "@/components/shop/comment";
import ProductDescription from "@/components/shop/product/product-description";
import ProductInfo from "@/components/shop/product/product-info";
import { getShopProduct } from "@/lib/getDataSVOnly";
import { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: { slug: string },
}): Promise<Metadata> {
  const { data: { gallery, description, seo } } = await getShopProduct({ slug: params.slug });

  return {
    title: seo.title,
    description: seo.metaDescription || description,
    openGraph: {
      images: [seo.ogImage, ...gallery],
    },
  }
}

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description,
  }

  return (
    <div className="space-y-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductInfo
        data={product}
        className="mt-2" />
      <ProductDescription data={product.description} />
      <Comment productId={product.id} {...searchParams} />
    </div>
  )
}

export default ProductDetailPage;
