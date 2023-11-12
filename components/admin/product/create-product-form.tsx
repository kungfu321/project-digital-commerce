'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Category, Product } from '@prisma/client';

import { postRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer, stringToSlug } from '@/lib/utils';
import { productFormSchema } from './schema';
import ProductForm from './product-form';

interface CreateProductFormProps {
  categories: Category[];
  products: Product[];
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  categories,
  products
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      status: "DRAFT",
      stock: 0,
      variants: [],
      isTrending: false,
      showNoteForm: false,
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const body = {
        ...values,
        categoryId: Number(values.categoryId),
        variants: values.variants.map(variant => Number(variant))
      };
      const resp = await postRequest({
        url: '/admin/api/products/create',
        body
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof productFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Create product successfully" });

      router.refresh();
      return router.push('/admin/products/list');
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
    if (!form.getValues("seo.title")) {
      const name = form.getValues("name");
      form.setValue("seo.title", stringToSlug(name));
    }
  }

  return (
    <ProductForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitTitle='Create Product'
      categories={categories}
      products={products}
      handleUpdateSlug={handleUpdateSlug}
    />
  )
}

export default CreateProductForm;
