"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
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
import { PaginationType, ProductExtra } from "@/types";
import TableBase from "@/components/shared/table-base";

interface ProductTableProps extends React.HTMLAttributes<HTMLElement> {
  data: ProductExtra[];
  pagination?: PaginationType;
}

const columns: ColumnDef<ProductExtra>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Image
          src={row.original.imageUrl}
          width={64}
          height={64}
          className="rounded-lg"
          alt={row.getValue("name")} />
        <div className="truncate">
          <div className="font-medium truncate">{row.getValue("name")}</div>
          <div className="text-sm truncate mt-1 text-muted-foreground">{row.original.shortName}</div>
        </div>
      </div>
    )
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
      <Badge variant={row.getValue("status") === "DRAFT" ? "secondary" : "default"}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => currencyFormatted(row.getValue("price")),
  },
  {
    accessorKey: "discountPrice",
    header: "Discount price",
    cell: ({ row }) => currencyFormatted(row.getValue("discountPrice")),
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category.name,
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
                href={`/admin/products/${row.original.id}/update`}>
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

const ProductTable: React.FC<ProductTableProps> = ({ data, className, pagination }) => {
  return (
    <TableBase
      data={data}
      columns={columns}
      className={className}
      pagination={pagination}
    />
  )
}

export default ProductTable;
