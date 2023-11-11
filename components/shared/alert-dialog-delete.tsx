"use client";

import { MouseEvent, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

interface AlertDialogDeleteProps {
  children: React.ReactNode;
  title?: string;
  description?: string | React.ReactNode;
  onDelete(e: MouseEvent<HTMLButtonElement>): void;
}

const AlertDialogDelete: React.FC<AlertDialogDeleteProps> = ({
  children,
  title = 'Are you absolutely sure?',
  description,
  onDelete
}) => {
  const [open, setOpen] = useState(false);

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    onDelete(e);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
          {description}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: 'destructive' }))}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogDelete;
