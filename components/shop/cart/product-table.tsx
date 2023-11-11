"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { cn, currencyFormatted } from "@/lib/utils";
import { CartItem } from "@/types";
import TableBase from "@/components/shared/table-base";
import { useCartStore } from "@/hooks/useCartStore";
import { InputUpdateQuantity } from "@/components/ui/input-update-quantity";
import { useToast } from "@/components/ui/use-toast";
import useStore from "@/hooks/useStore";

interface ProductTableProps extends React.HTMLAttributes<HTMLElement> {
}

const ProductTable: React.FC<ProductTableProps> = ({ className }) => {
  const cartItems = useStore(useCartStore, (state) => state.items) || [];
  const { handleUpdateItemQuantity, handleGetItemQuantityById } = useCartStore();
  const { toast } = useToast();

  const columns: ColumnDef<CartItem>[] = useMemo(() => {
    const handleUpdateCartQuantity = (cartItem: CartItem, action: string) => {
      const itemQuantity = handleGetItemQuantityById(cartItem.id);
      if (action === 'INCREMENT' && cartItem.maxPurchaseQuantity && cartItem.maxPurchaseQuantity <= itemQuantity) {
        return toast({
          variant: "destructive",
          description: `The maximum quantity that can be purchased is ${cartItem.maxPurchaseQuantity} product(s)`
        });
      }

      handleUpdateItemQuantity(cartItem.id, action);
    }

    return [
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2 max-w-[20rem]">
            <Image
              src={row.original.imageUrl}
              width={64}
              height={64}
              className="rounded-lg"
              alt={row.getValue("name")} />
            <div className="truncate">
              <Link
                href={`/${row.original.slug}`}
                className="font-medium truncate text-foreground">
                {row.getValue("name")}
              </Link>
            </div>
          </div>
        )
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => currencyFormatted(row.getValue("price")),
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => (
          <InputUpdateQuantity
            onIncrement={() => handleUpdateCartQuantity(row.original, 'INCREMENT')}
            onDecrement={() => handleUpdateCartQuantity(row.original, 'DECREMENT')}
            value={row.original.quantity} />
        )
      },
      {
        accessorKey: "totalPrice",
        header: "Total Price",
        cell: ({ row }) => currencyFormatted(row.original.price * row.original.quantity),
      },
    ];
  }, [handleGetItemQuantityById, handleUpdateItemQuantity, toast]);

  return (
    <div className={cn(
      "bg-background rounded-lg p-4 border shadow-lg",
      className
    )}>
      {
        !cartItems.length ?
          <div className="text-center flex flex-col items-center">
            <div className="text-lg font-medium">Cart is empty</div>
            <div className="text-sm text-muted-foreground mt-2 mb-4">Add products to your cart and return to this page to pay</div>
            <Image
              src="/images/illustration-cart-empty.svg"
              width={328}
              height={240}
              priority={true}
              alt="cart empty" />
          </div>
          :
          <>
            <div className="mb-4 text-lg font-medium flex items-center">
              <span>Cart</span>
              <span className="ml-1 text-muted-foreground text-sm">
                ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
              </span>
            </div>
            <TableBase
              data={cartItems}
              columns={columns}
              className="border-none shadow-none p-0"
            />
          </>
      }
    </div>
  )
}

export default ProductTable;
