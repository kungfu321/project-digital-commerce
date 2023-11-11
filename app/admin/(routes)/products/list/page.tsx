import Link from "next/link";
import { Plus } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import ProductTable from "@/components/admin/product/product-table";
import { getProducts } from "@/lib/getDataSVOnly";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data: products, pagination } = await getProducts({ ...searchParams });

  return (
    <div>
      <PageHeader title="Product List">
        <div className="text-end">
          <Link href="/admin/products/create">
            <Button><Plus /> <span className="ml-2">New Product</span></Button>
          </Link>
        </div>
      </PageHeader>

      <ProductTable
        data={products}
        pagination={pagination}
        className="mt-8" />
    </div>
  )
}

export default ProductsPage;
