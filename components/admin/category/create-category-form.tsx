'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { postRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer, stringToSlug } from '@/lib/utils';
import { categoryFormSchema } from './schema';
import CategoryForm from './category-form';

const CreateCategoryForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      status: "DRAFT",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await postRequest({
        url: '/admin/api/categories/create',
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof categoryFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Create category successfully" });

      router.refresh();
      return router.push('/admin/categories/list');
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  const handleUpdateSlug = () => {
    if (!form.getValues("slug")) {
      const name = form.getValues("name");
      form.setValue("slug", stringToSlug(name));
    }
  }

  return (
    <CategoryForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitTitle='Create Category'
      handleUpdateSlug={handleUpdateSlug}
    />
  )
}

export default CreateCategoryForm;
