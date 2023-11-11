"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { OrderItem } from "@prisma/client";

import { cn, currencyFormatted } from "@/lib/utils";
import TableBase from "@/components/shared/table-base";

interface OrderDetailTableProps extends React.HTMLAttributes<HTMLElement> {
  data: OrderItem[];
}

const columns: ColumnDef<OrderItem>[] = [
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
        <div className="font-medium truncate">{row.getValue("productName")}</div>
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
];

const OrderDetailTable: React.FC<OrderDetailTableProps> = ({ data, className }) => {
  return (
    <TableBase
      data={data}
      className={cn(
        "shadow-none border-none p-0",
        className
      )}
      columns={columns}
    />
  )
}

export default OrderDetailTable;
