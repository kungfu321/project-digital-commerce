"use client";

import { ColumnDef } from "@tanstack/react-table";

import { cn, currencyFormatted, dateTimeFormatted } from "@/lib/utils";
import { PaginationType, PaymentTransactionOrder, WalletTransactions } from "@/types";
import TableBase from "@/components/shared/table-base";
import { Card } from "@/components/ui/card";

interface WalletTableProps extends React.HTMLAttributes<HTMLElement> {
  data: WalletTransactions;
  pagination: PaginationType;
}

export const columns: ColumnDef<PaymentTransactionOrder>[] = [
  {
    accessorKey: "updatedAt",
    header: "Created at",
    cell: ({ row }) => dateTimeFormatted(row.getValue("updatedAt"), 'dd MMM yyyy HH:mm:ss'),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span>TopUp for order #{row.original.order.orderId}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => currencyFormatted(row.getValue("amount")),
  },
];

const WalletTable: React.FC<WalletTableProps> = ({ data, className, pagination }) => {
  return (
    <Card className={cn(
      "p-4",
      className
    )}>
      <div className="flex items-center text-muted-foreground mb-4">
        <div className="text-sm">Balance:</div>
        <div className="ml-2 text-lg font-medium">{currencyFormatted(data?.walletBalance)}</div>
      </div>
      <TableBase
        data={data?.transactions}
        columns={columns}
        pagination={pagination}
        className="p-0 border-none shadow-none"
      />
    </Card>
  )
}

export default WalletTable;
