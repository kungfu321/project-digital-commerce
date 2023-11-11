import AffiliateInfo from "@/components/shop/user/affiliate/affiliate-info";
import AffiliateTable from "@/components/shop/user/affiliate/affiliate-table";
import { getShopUserAffiliates, getUserInfo } from "@/lib/getDataSVOnly";

const AffiliatePage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data: userInfo } = await getUserInfo();
  const { data, pagination } = await getShopUserAffiliates(searchParams);

  return (
    <div className="space-y-4">
      <AffiliateInfo userInfo={userInfo} />
      <AffiliateTable
        data={data?.orders}
        point={data?.point}
        pagination={pagination} />
    </div>
  )
}

export default AffiliatePage;
