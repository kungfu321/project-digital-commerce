import Link from "next/link";
import { Plus } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getBanners } from "@/lib/getDataSVOnly";
import BannerTable from "@/components/admin/banner/banner-table";

const BannersPage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data: banners, pagination } = await getBanners({ ...searchParams });

  return (
    <div>
      <PageHeader title="Banner List">
        <div className="text-end">
          <Link href="/admin/banners/create">
            <Button><Plus /> <span className="ml-2">New Banner</span></Button>
          </Link>
        </div>
      </PageHeader>

      <BannerTable
        data={banners}
        pagination={pagination}
        className="mt-8" />
    </div>
  )
}

export default BannersPage;
