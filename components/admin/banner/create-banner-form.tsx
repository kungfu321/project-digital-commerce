'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { postRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer } from '@/lib/utils';
import { bannerFormSchema } from './schema';
import BannerForm from './banner-form';

const CreateBannerForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      status: "DRAFT",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const body = {
        ...values,
        position: Number(values.position),
      };
      const resp = await postRequest({
        url: '/admin/api/banners/create',
        body
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof bannerFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Create banner successfully" });

      router.refresh();
      return router.push('/admin/banners/list');
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  return (
    <BannerForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitTitle='Create Banner'
    />
  )
}

export default CreateBannerForm;
