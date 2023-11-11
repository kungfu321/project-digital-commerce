import WalletTable from "@/components/shop/user/wallet/wallet-table";
import { getShopUserWallet } from "@/lib/getDataSVOnly";

const WalletPage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data, pagination } = await getShopUserWallet(searchParams);

  return (
    <div>
      <WalletTable data={data} pagination={pagination} />
    </div>
  )
}

export default WalletPage;
