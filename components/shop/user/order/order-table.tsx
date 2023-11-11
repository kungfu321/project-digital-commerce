"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@prisma/client";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { currencyFormatted, dateTimeFormatted } from "@/lib/utils";
import { PaginationType } from "@/types";
import TableBase from "@/components/shared/table-base";

interface OrderTableProps extends React.HTMLAttributes<HTMLElement> {
  data: Order[];
  pagination: PaginationType;
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => currencyFormatted(row.getValue("total")),
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => dateTimeFormatted(row.getValue("createdAt")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === "INACTIVE" ? "secondary" : "default"}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => (
      <Link href={`/user/orders/${row.original.orderId}`}>Detail</Link>
    ),
  },
];

const OrderTable: React.FC<OrderTableProps> = ({ data, className, pagination }) => {
  return (
    <TableBase
      data={data}
      className={className}
      columns={columns}
      pagination={pagination}
    />
  )
}

export default OrderTable;
