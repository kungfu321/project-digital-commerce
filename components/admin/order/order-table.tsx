"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileEdit, MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { currencyFormatted, dateTimeFormatted } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderExtra, PaginationType } from "@/types";
import TableBase from "@/components/shared/table-base";

interface OrderTableProps extends React.HTMLAttributes<HTMLElement> {
  data: OrderExtra[];
  pagination?: PaginationType;
}

export const columns: ColumnDef<OrderExtra>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => (
      <div className="font-medium">#{row.getValue("id")} {row.original.user?.name ?? row.original.user?.email}</div>
    ),
  },
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                className="cursor-pointer text-foreground"
                href={`/admin/orders/${row.original.id}/update`}>
                <FileEdit size={18} />
                <span className="ml-2">Edit</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

const OrderTable: React.FC<OrderTableProps> = ({ data, className, pagination }) => {
  return (
    <TableBase
      data={data}
      columns={columns}
      className={className}
      pagination={pagination}
    />
  )
}

export default OrderTable;
