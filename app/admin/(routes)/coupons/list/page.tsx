import Link from "next/link";
import { Plus } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getCoupons } from "@/lib/getDataSVOnly";
import CouponTable from "@/components/admin/coupon/coupon-table";

const CouponsPage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data: coupons, pagination } = await getCoupons({ ...searchParams });

  return (
    <div>
      <PageHeader title="Coupon List">
        <div className="text-end">
          <Link href="/admin/coupons/create">
            <Button><Plus /> <span className="ml-2">New Coupon</span></Button>
          </Link>
        </div>
      </PageHeader>

      <CouponTable
        data={coupons}
        pagination={pagination}
        className="mt-8" />
    </div>
  )
}

export default CouponsPage;
