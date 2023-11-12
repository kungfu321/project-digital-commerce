'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PaymentMethod } from '@prisma/client';

import { postRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer } from '@/lib/utils';
import { transactionFormSchema } from './schema';
import TransactionForm from './transaction-form';

interface CreateTransactionFormProps {
  paymentMethods: PaymentMethod[];
  orderId: string;
}

const CreateTransactionForm: React.FC<CreateTransactionFormProps> = ({
  paymentMethods,
  orderId
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      status: 'PENDING',
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await postRequest({
        url: `/admin/api/orders/${orderId}/transactions/create`,
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof transactionFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Add transaction successfully" });

      router.refresh();
      return router.push(`/admin/orders/${orderId}/update`);
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
      submitTitle='Add Transaction'
    />
  )
}

export default CreateTransactionForm;
