"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileEdit, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { PaymentMethod } from "@prisma/client";

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

interface PaymentMethodTableProps extends React.HTMLAttributes<HTMLElement> {
  data: PaymentMethod[];
  pagination: PaginationType;
}

export const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => dateTimeFormatted(row.getValue("createdAt")),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
        {row.getValue("isActive") ? 'ACTIVE' : 'INACTIVE'}
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
                href={`/admin/settings/payment-method/${row.original.id}/update`}>
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

const PaymentMethodTable: React.FC<PaymentMethodTableProps> = ({ data, className, pagination }) => {
  return (
    <>
      <div className="text-end mb-4">
        <Link href="/admin/settings/payment-method/create">
          <Button><Plus /> <span className="ml-2">New Payment Method</span></Button>
        </Link>
      </div>
      <TableBase
        data={data}
        className={className}
        columns={columns}
        pagination={pagination}
      />
    </>
  )
}

export default PaymentMethodTable;
