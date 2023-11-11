"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/hooks/useCartStore";
import useStore from "@/hooks/useStore";

const Cart = () => {
  const totalQuantity = useStore(useCartStore, (state) => state.totalQuantity);
  const router = useRouter();

  const handleMoveToCheckout = () => {
    router.push("/cart");
  }

  return (
    <Button
      variant="ghost"
      className="relative"
      onClick={handleMoveToCheckout}>
      <ShoppingBag />
      {
        !!totalQuantity &&
        <div className="absolute bottom-0 right-1 bg-red-500 rounded-full w-6 h-6 text-center flex items-center justify-center">
          <span className="text-sm font-semibold text-white mt-0.5">{totalQuantity}</span>
        </div>
      }
    </Button>
  )
}

export default Cart;
