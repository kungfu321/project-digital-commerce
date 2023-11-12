'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { add } from 'date-fns';

import { postRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer } from '@/lib/utils';
import { couponFormSchema } from './schema';
import CouponForm from './coupon-form';

const CreateCouponForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      status: 'INACTIVE',
      type: 'percent',
      quantity: 1,
      discount: 1,
      maxDiscountValue: 0,
      minOrderValue: 0,
      validFrom: add(new Date(), { days: 1 }),
      validTo: add(new Date(), { days: 2 }),
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await postRequest({
        url: '/admin/api/coupons/create',
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof couponFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Create coupon successfully" });

      router.refresh();
      return router.push('/admin/coupons/list');
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  return (
    <CouponForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitTitle='Create Coupon'
    />
  )
}

export default CreateCouponForm;
