'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PaymentMethod } from '@prisma/client';

import { putRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer } from '@/lib/utils';
import { paymentMethodFormSchema } from './schema';
import PaymentMethodForm from './payment-method-form';

interface UpdatePaymentMethodFormProps {
  data: PaymentMethod;
}

const UpdatePaymentMethodForm: React.FC<UpdatePaymentMethodFormProps> = ({
  data
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof paymentMethodFormSchema>>({
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: {
      name: data.name,
      code: data.code,
      description: data.description || "",
      isActive: data.isActive
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await putRequest({
        url: `/admin/api/payment-methods/${data.id}/update`,
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof paymentMethodFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Update payment method successfully" });

      router.refresh();
      return router.push('/admin/settings/payment-method');
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  return (
    <PaymentMethodForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitTitle='Update Payment Method'
    />
  )
}

export default UpdatePaymentMethodForm;
