"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileEdit, MoreHorizontal } from "lucide-react";
import Link from "next/link";

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
import { PaginationType, UserExtra } from "@/types";
import TableBase from "@/components/shared/table-base";

interface UserTableProps extends React.HTMLAttributes<HTMLElement> {
  data: UserExtra[];
  pagination: PaginationType;
}

export const columns: ColumnDef<UserExtra>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.getValue("role") === "CUSTOMER" ? "secondary" : "default"}>
        {row.getValue("role")}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => dateTimeFormatted(row.getValue("createdAt")),
  },
  {
    accessorKey: "verifiedAt",
    header: "Verified at",
    cell: ({ row }) => dateTimeFormatted(row.getValue("verifiedAt")),
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
    accessorKey: "referredBy.user.email",
    header: "Referred by",
    cell: ({ row }) => row.original?.referredBy?.user?.email,
  },
  {
    accessorKey: "referredBy.earnings",
    header: "Earnings (%)",
    cell: ({ row }) => row.original?.referredBy?.earnings,
  },
  {
    accessorKey: "referredBy.friendEarnings",
    header: "Friend earnings (%)",
    cell: ({ row }) => row.original?.referredBy?.friendEarnings,
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
                href={`/admin/users/${row.original.id}/update`}>
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

const UserTable: React.FC<UserTableProps> = ({ data, className, pagination }) => {
  return (
    <TableBase
      data={data}
      className={className}
      columns={columns}
      pagination={pagination}
    />
  )
}

export default UserTable;
