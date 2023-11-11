"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileEdit, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Coupon } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { dateTimeFormatted } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationType } from "@/types";
import TableBase from "@/components/shared/table-base";

interface CouponTableProps extends React.HTMLAttributes<HTMLElement> {
  data: Coupon[];
  pagination: PaginationType;
}

export const columns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => dateTimeFormatted(row.getValue("createdAt")),
  },
  {
    accessorKey: "validFrom",
    header: "Valid from",
    cell: ({ row }) => dateTimeFormatted(row.getValue("validFrom")),
  },
  {
    accessorKey: "validTo",
    header: "Valid to",
    cell: ({ row }) => dateTimeFormatted(row.getValue("validTo")),
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "discount",
    header: "Value",
    cell: ({ row }) => (
      <div>{row.getValue("discount")}{row.original.type === 'percent' && '%'}</div>
    ),
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
                href={`/admin/coupons/${row.original.id}/update`}>
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

const CouponTable: React.FC<CouponTableProps> = ({ data, className, pagination }) => {
  return (
    <TableBase
      data={data}
      className={className}
      columns={columns}
      pagination={pagination}
    />
  )
}

export default CouponTable;
