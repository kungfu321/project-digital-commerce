'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Banner } from '@prisma/client';

import { putRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer } from '@/lib/utils';
import { bannerFormSchema } from './schema';
import BannerForm from './banner-form';

interface UpdateBannerFormProps {
  data: Banner;
}

const UpdateBannerForm: React.FC<UpdateBannerFormProps> = ({
  data
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: data.title,
      url: data.url,
      position: data.position,
      status: data.status,
      backgroundUrl: data.backgroundUrl,
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await putRequest({
        url: `/admin/api/banners/${data.id}/update`,
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof bannerFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Update banner successfully" });

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
      submitTitle='Update Banner'
    />
  )
}

export default UpdateBannerForm;
