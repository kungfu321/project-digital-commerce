"use client";

import { ColumnDef } from "@tanstack/react-table";

import { cn, currencyFormatted, dateTimeFormatted } from "@/lib/utils";
import { PaginationType, ShopUserOrder } from "@/types";
import TableBase from "@/components/shared/table-base";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AffiliateTableProps extends React.HTMLAttributes<HTMLElement> {
  data: ShopUserOrder[];
  point: {
    totalReferrer: number;
    totalPointReceived: number;
  },
  pagination: PaginationType;
}

export const columns: ColumnDef<ShopUserOrder>[] = [
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => dateTimeFormatted(row.getValue("createdAt")),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="truncate max-w-sm">
        {row.original.orderItems.map(item => item.productName).join(', ')}
      </div>
    )
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => currencyFormatted(row.getValue("total")),
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => (
      <span className="text-primary font-medium">+ {currencyFormatted((Number(row.original.affiliateEarnings) * row.original.total) / 100)}</span>
    ),
  },
];

const AffiliateTable: React.FC<AffiliateTableProps> = ({
  data,
  className,
  pagination,
  point
}) => {
  return (
    <Card className={cn(
      "p-4",
      className
    )}>
      <div className="border-b border-dashed pb-4">
        <Card className={cn(
          "p-4",
          "lg:flex lg:items-center lg:justify-between"
        )}>
          <div className="flex items-center text-center justify-around w-full">
            <div>
              <div className="text-sm text-muted-foreground mb-4">Total point received</div>
              <div className="font-semibold">{point.totalPointReceived}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-4">Total number of referrers</div>
              <div className="font-semibold">{point.totalReferrer}</div>
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="text-center w-full">
              <div className="text-sm text-muted-foreground">The remaining amount</div>
              <div className="space-x-1 mt-4">
                0
              </div>
            </div>
            <Button>Exchange</Button>
          </div>
        </Card>
      </div>
      <TableBase
        data={data}
        columns={columns}
        pagination={pagination}
        className="border-none shadow-none"
      />
    </Card>
  )
}

export default AffiliateTable;
