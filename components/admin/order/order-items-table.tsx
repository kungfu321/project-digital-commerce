"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { MouseEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { currencyFormatted } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TableBase from "@/components/shared/table-base";
import { OrderItem } from "@prisma/client";
import { deleteRequest } from "@/lib/request";
import AlertDialogDelete from "@/components/shared/alert-dialog-delete";
import AddOrderItemForm from "./add-order-item-form";
import { useToast } from "@/components/ui/use-toast";
import { OrderExtra } from "@/types";

interface OrderItemsTableProps extends React.HTMLAttributes<HTMLElement> {
  order: OrderExtra;
  canAdd?: boolean;
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ order, canAdd, className }) => {
  const { toast } = useToast();
  const router = useRouter();

  const columns: ColumnDef<OrderItem>[] = useMemo(
    () => {
      const handleDelete = async (e: MouseEvent<HTMLButtonElement>, orderId: number, orderItemId: number) => {
        try {
          e.preventDefault();
          e.stopPropagation();
          const resp = await deleteRequest({
            url: `/admin/api/orders/${orderId}/delete-order-item?orderItemId=${orderItemId}`
          });

          if (!resp?.success) {
            return toast({ variant: "destructive", description: resp?.error?.message });
          }

          router.refresh();
          toast({ description: "Delete order item successfully" });
        } catch (error) {
          console.log(error);
          toast({ variant: "destructive", description: "There was a problem with your request." });
        }
      };

      return [
        {
          accessorKey: "productName",
          header: "Product",
          cell: ({ row }) => (
            <div className="flex items-center space-x-2">
              <Image
                src={row.original.productImageUrl}
                width={64}
                height={64}
                className="rounded-lg"
                alt={row.getValue("productName")} />
              <div className="truncate">
                <div className="font-medium truncate">{row.getValue("productName")}</div>
                <div className="text-sm truncate mt-1 text-muted-foreground">{row.original.note}</div>
              </div>
            </div>
          )
        },
        {
          accessorKey: "productDiscountPrice",
          header: "Cost",
          cell: ({ row }) => currencyFormatted(row.getValue("productDiscountPrice")),
        },
        {
          accessorKey: "quantity",
          header: "Quantity",
          cell: ({ row }) => (
            <div>x {row.getValue("quantity")}</div>
          ),
        },
        {
          accessorKey: "total",
          header: "Total",
          cell: ({ row }) => currencyFormatted(row.original.quantity * row.original.productDiscountPrice),
        },
        {
          accessorKey: "action",
          header: "Action",
          cell: ({ row }) => (
            <div>
              <AlertDialogDelete
                onDelete={(e) => handleDelete(e, row.original.orderId, row.original.id)}
                description={<div className="font-semibold text-red-500">
                  {row.original.productName}
                </div>}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={order.orderItems.length <= 1 || !canAdd}
                  className="text-red-500">
                  <Trash2 size={18} />
                </Button>
              </AlertDialogDelete>
            </div>
          ),
        },
      ];
    },
    [router, toast, order.orderItems, canAdd]
  );

  let couponDiscount = 0;
  let affiliateDiscount = 0;
  if (order?.coupon) {
    if (order?.coupon.type === 'fixed') {
      couponDiscount = order?.coupon.discount;
    } else {
      couponDiscount = order.subTotal * order?.coupon.discount / 100;
    }
  }
  if (order?.affiliateId) {
    affiliateDiscount = (order.subTotal - couponDiscount) * Number(order.affiliateFriendEarnings) / 100;
  }

  return (
    <div className={className}>
      <TableBase
        data={order.orderItems}
        columns={columns}
        className="shadow-none border-none"
      />

      <div className="text-end p-4 border-b border-t flex items-center justify-end text-muted-foreground">
        <div className="space-y-4">
          <div>Items Subtotal:</div>
          {
            order?.coupon &&
            <div>Coupon: (<Link href={`/admin/coupons/${order?.coupon?.id}/update`} className="uppercase">{order?.coupon?.code}</Link>)</div>
          }
          {
            order?.affiliate &&
            <div>Ref code: (<Link href={`/admin/users/${order?.affiliate?.userId}/update`} className="uppercase">{order?.affiliate?.code}</Link>)</div>
          }
          <div className="text-lg">Order Total:</div>
        </div>
        <div className="space-y-4 ml-8 font-semibold">
          <div>{currencyFormatted(order.subTotal)}</div>
          {
            order?.coupon &&
            <div>{currencyFormatted(couponDiscount)}</div>
          }
          {
            order?.affiliate &&
            <div>{currencyFormatted(affiliateDiscount)}</div>
          }
          <div className="text-red-500 text-lg">{currencyFormatted(order.total)}</div>
        </div>
      </div>

      {
        canAdd &&
        <AddOrderItemForm />
      }
    </div>
  )
}

export default OrderItemsTable;
