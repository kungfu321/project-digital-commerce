import { DollarSign, ShoppingBasketIcon, ShoppingCartIcon, UserIcon } from "lucide-react";

import OverviewCard from "@/components/shop/dashboard/overview-card";
import { cn, currencyFormatted } from "@/lib/utils";
import { getAnalytics, getOrders, getProducts } from "@/lib/getDataSVOnly";
import OrderTable from "@/components/admin/order/order-table";
import { Card } from "@/components/ui/card";
import ProductTable from "@/components/admin/product/product-table";

type AnalyticItemType = {
  totalRevenue: number;
  totalOrders: number;
  totalProductsSold: number;
  totalUsers: number;
  totalLastMonthRevenue: number;
  totalLastMonthOrders: number;
  totalLastMonthProductsSold: number;
  totalLastMonthUsers: number;
}

interface AnalyticsType extends AnalyticItemType {
  thisMonth: AnalyticItemType[];
  lastMonth: AnalyticItemType[];
  revenueFromLastMonth: number;
  ordersFromLastMonth: number;
  productsSoldFromLastMonth: number;
  usersFromLastMonth: number;
}

const DashboardPage = async () => {
  const { data: analytics } = await getAnalytics<AnalyticsType>();
  const { data: orders } = await getOrders({ status: 'PENDING' });
  const { data: products } = await getProducts({ isBestseller: true });

  const renderDesc = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}% from last month`;
  };

  return (
    <div>
      <div className={cn(
        "space-y-4",
        "lg:grid lg:grid-cols-4 lg:gap-4 lg:space-y-0"
      )}>
        <OverviewCard
          title="Revenue"
          value={currencyFormatted(analytics.totalRevenue)}
          description={renderDesc(analytics.revenueFromLastMonth)}
          icon={<DollarSign size={18} />}
        />
        <OverviewCard
          title="Orders"
          value={analytics.totalOrders}
          description={renderDesc(analytics.ordersFromLastMonth)}
          icon={<ShoppingBasketIcon size={18} />}
        />
        <OverviewCard
          title="Product Sold"
          value={analytics.totalProductsSold}
          description={renderDesc(analytics.productsSoldFromLastMonth)}
          icon={<ShoppingCartIcon size={18} />}
        />
        <OverviewCard
          title="New Users"
          value={analytics.totalUsers}
          description={renderDesc(analytics.usersFromLastMonth)}
          icon={<UserIcon size={18} />}
        />
      </div>
      <div className="mt-4 space-y-4">
        <Card className="p-4">
          <div className="mb-4 text-lg font-medium">New Orders</div>
          <OrderTable
            data={orders}
            className="border-none shadow-none p-0" />
        </Card>
        <Card className="p-4">
          <div className="mb-4 text-lg font-medium">Best Seller</div>
          <ProductTable
            data={products}
            className="border-none shadow-none p-0" />
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage;
