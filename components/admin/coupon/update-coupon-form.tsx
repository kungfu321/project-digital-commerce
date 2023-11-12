'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Coupon } from '@prisma/client';

import { putRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer } from '@/lib/utils';
import { couponFormSchema } from './schema';
import CouponForm from './coupon-form';

interface UpdateCouponFormProps {
  data: Coupon;
}

const UpdateCouponForm: React.FC<UpdateCouponFormProps> = ({
  data
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      name: data.name,
      code: data.code,
      discount: data.discount,
      maxDiscountValue: data.maxDiscountValue,
      minOrderValue: data.minOrderValue,
      validFrom: new Date(data.validFrom),
      validTo: new Date(data.validTo),
      quantity: data.quantity,
      type: data.type,
      status: data.status,
      description: data.description || "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await putRequest({
        url: `/admin/api/coupons/${data.id}/update`,
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof couponFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Update coupon successfully" });

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
      submitTitle='Update Coupon'
      isUpdate={true}
    />
  )
}

export default UpdateCouponForm;
