import Link from "next/link";
import { Plus } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/getDataSVOnly";
import CategoryTable from "@/components/admin/category/category-table";

const CategoriesPage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data: categories, pagination } = await getCategories({ ...searchParams });

  return (
    <div>
      <PageHeader title="Category List">
        <div className="text-end">
          <Link href="/admin/categories/create">
            <Button><Plus /> <span className="ml-2">New Category</span></Button>
          </Link>
        </div>
      </PageHeader>

      <CategoryTable
        data={categories}
        pagination={pagination}
        className="mt-8" />
    </div>
  )
}

export default CategoriesPage;
