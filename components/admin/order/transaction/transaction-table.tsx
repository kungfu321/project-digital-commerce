"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { cn, currencyFormatted, dateTimeFormatted } from "@/lib/utils";
import TableBase from "@/components/shared/table-base";
import { PaymentTransactionExtra } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TransactionTableProps extends React.HTMLAttributes<HTMLElement> {
  data: PaymentTransactionExtra[];
  orderId: number;
  canAdd?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  className,
  orderId,
  canAdd
}) => {
  const columns: ColumnDef<PaymentTransactionExtra>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Transaction",
        cell: ({ row }) => <span>#{row.getValue("id")}</span>,
      },
      {
        accessorKey: "transactionId",
        header: "Transaction ID",
      },
      {
        accessorKey: "transactionDate",
        header: "Date",
        cell: ({ row }) => dateTimeFormatted(row.getValue("transactionDate"), 'dd MMM yyyy mm:HH:ss'),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => currencyFormatted(row.getValue("amount")),
      },
      {
        accessorKey: "note",
        header: "Note",
      },
      {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => row.original.method.name,
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => (
          <Link href={`/admin/orders/${row.original.orderId}/transactions/${row.original.id}/update`}>Edit</Link>
        ),
      },
    ],
    []
  );

  return (
    <div className={cn(
      "p-4",
      className
    )}>
      {
        canAdd &&
        <div className="mb-4 text-end">
          <Link href={`/admin/orders/${orderId}/transactions/create`}>
            <Button variant="secondary">Add transaction</Button>
          </Link>
        </div>
      }
      <TableBase
        data={data}
        columns={columns}
        className="shadow-none border-none p-0"
      />
    </div>
  )
}

export default TransactionTable;
