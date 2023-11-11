"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";

interface TableBaseProps<TData, TValue> extends React.HTMLAttributes<HTMLElement> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: PaginationType;
  onPaginationChange?: () => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onChangePageSize?: (value: number) => void;
}

export default function TableBase<TData, TValue>({
  data,
  columns,
  pagination,
  className,
  onPaginationChange,
  onNextPage,
  onPreviousPage,
  onChangePageSize
}: TableBaseProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: pagination?.pageCount,
  });

  useEffect(() => {
    if (pagination) {
      table.setPageIndex(Math.round(pagination.skip / pagination.take));
    }
  }, [pagination, table]);

  const handleNextPage = () => {
    onPaginationChange && onPaginationChange();
    if (onNextPage) {
      onNextPage();
    } else {
      pagination && handleUpdateRouter({ ...pagination, skip: pagination.skip + pagination.take });
    }
    return table.nextPage();
  }

  const handlePreviousPage = () => {
    onPaginationChange && onPaginationChange();
    if (onPreviousPage) {
      onPreviousPage();
    } else {
      pagination && handleUpdateRouter({ ...pagination, skip: pagination.skip - pagination.take });
    }
    return table.previousPage();
  }

  const handleChangePageSize = (value: string) => {
    table.setPageSize(Number(value));
    if (onChangePageSize) {
      onChangePageSize(Number(value));
    } else {
      pagination && handleUpdateRouter({ ...pagination, take: Number(value) });
    }
  }

  const handleUpdateRouter = ({ take, skip }: { take: number, skip: number }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (current.get("skip")) {
      current.set("skip", String(skip));
    } else {
      current.append("skip", String(skip));
    }
    if (current.get("take")) {
      current.set("take", String(take));
    } else {
      current.append("take", String(take));
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  }

  return (
    <Card className={cn(
      "p-4",
      className
    )}>
      <div className={cn(
        pagination && "border-b"
      )}>
        <Table>
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={header.id} className={
                      index === 0 ? 'rounded-l-lg' : index === headerGroup.headers.length - 1 ? 'rounded-r-lg' : ''
                    }>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-none"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {
        pagination &&
        <div className="flex items-center justify-end pt-4 px-4">
          <div className="text-sm text-muted-foreground flex items-center">
            <div className={cn(
              "whitespace-nowrap mr-2 hidden",
              "lg:block"
            )}>Rows per page:</div>
            <Select
              defaultValue={String(pagination.take)}
              onValueChange={handleChangePageSize}>
              <SelectTrigger>
                <SelectValue defaultValue={String(pagination.take)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground mx-4">
            {pagination.skip} {" - "}
            {pagination.skip + data?.length} of{" "}
            {pagination.total}
          </div>
          <div className="space-x-2 flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handlePreviousPage}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
              <span className={cn(
                "hidden",
                "lg:block"
              )}>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handleNextPage}
              disabled={!table.getCanNextPage()}
            >
              <span className={cn(
                "hidden",
                "lg:block"
              )}>Next</span>
              <ChevronRight />
            </Button>
          </div>
        </div>
      }
    </Card>
  )
}
