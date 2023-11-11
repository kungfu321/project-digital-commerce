"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileEdit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { Banner } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEvent, useMemo } from "react";

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
import { useToast } from "@/components/ui/use-toast";
import { deleteRequest } from "@/lib/request";

interface BannerTableProps extends React.HTMLAttributes<HTMLElement> {
  data: Banner[];
  pagination: PaginationType;
}

const BannerTable: React.FC<BannerTableProps> = ({ data, className, pagination }) => {
  const { toast } = useToast();
  const router = useRouter();

  const columns: ColumnDef<Banner>[] = useMemo(() => {
    const handleDelete = async (e: MouseEvent<HTMLDivElement>, bannerId: number) => {
      try {
        e.preventDefault();
        e.stopPropagation();
        const resp = await deleteRequest({
          url: `/admin/api/banners/${bannerId}/delete`
        });

        if (!resp?.success) {
          return toast({ variant: "destructive", description: resp?.error?.message });
        }

        router.refresh();
        toast({ description: "Delete product successfully" });
      } catch (error) {
        console.log(error);
        toast({ variant: "destructive", description: "There was a problem with your request." });
      }
    };

    return [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Image
              src={row.original.backgroundUrl}
              width={64}
              height={64}
              className="rounded-lg"
              alt={row.getValue("title")} />
            <div className="font-medium truncate">{row.getValue("title")}</div>
          </div>
        )
      },
      {
        accessorKey: "position",
        header: "Position",
      },
      {
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => (
          <div className="truncate max-w-md">{row.getValue("url")}</div>
        ),
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
                    href={`/admin/banners/${row.original.id}/update`}>
                    <FileEdit size={18} />
                    <span className="ml-2">Edit</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => handleDelete(e, row.original.id)}
                  className="cursor-pointer">
                  <Trash2 size={18} />
                  <span className="ml-2">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]
  }, [router, toast]);

  return (
    <TableBase
      data={data}
      className={className}
      columns={columns}
      pagination={pagination}
    />
  )
}

export default BannerTable;
