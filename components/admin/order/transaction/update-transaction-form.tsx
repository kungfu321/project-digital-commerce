'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PaymentMethod, PaymentTransaction } from '@prisma/client';

import { putRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer } from '@/lib/utils';
import { transactionFormSchema } from './schema';
import TransactionForm from './transaction-form';

interface UpdateTransactionFormProps {
  paymentMethods: PaymentMethod[];
  data: PaymentTransaction;
}

const UpdateTransactionForm: React.FC<UpdateTransactionFormProps> = ({
  paymentMethods,
  data
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      status: data.status,
      methodId: String(data.methodId),
      amount: data.amount,
      note: data.note || "",
      transactionDate: data.transactionDate,
      transactionId: data.transactionId || "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await putRequest({
        url: `/admin/api/orders/${data.orderId}/transactions/${data.id}/update`,
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof transactionFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Update transaction successfully" });

      router.refresh();
      return router.push(`/admin/orders/${data.orderId}/update`);
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  return (
    <TransactionForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      paymentMethods={paymentMethods}
      isUpdate
      submitTitle='Update Transaction'
    />
  )
}

export default UpdateTransactionForm;
