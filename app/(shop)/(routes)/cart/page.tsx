import CartAction from "@/components/shop/cart/cart-action";
import OrderSummary from "@/components/shop/cart/order-summary";
import ProductTable from "@/components/shop/cart/product-table";
import { SWRProvider } from "@/components/swr-provider";
import { getShopPaymentMethods, getUserInfo } from "@/lib/getDataSVOnly";
import { cn } from "@/lib/utils";

const CartPage = async () => {
  const { data: paymentMethods } = await getShopPaymentMethods();
  const { data: userInfo } = await getUserInfo();

  return (
    <div className={cn(
      "mt-8",
      "lg:grid lg:grid-cols-3 gap-4"
    )}>
      <div className="lg:col-span-2">
        <ProductTable />
      </div>
      <div className={cn(
        "mt-4",
        "lg:mt-0"
      )}>
        <SWRProvider>
          <OrderSummary />
        </SWRProvider>
        <CartAction
          userInfo={userInfo}
          paymentMethods={paymentMethods} />
      </div>
    </div>
  )
}

export default CartPage;
