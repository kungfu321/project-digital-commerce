'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Category, Product, Seo } from '@prisma/client';

import { putRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { setErrorFromZodServer, stringToSlug } from '@/lib/utils';
import { productFormSchema } from './schema';
import ProductForm from './product-form';

interface UpdateProductFormProps {
  categories: Category[];
  products: Product[];
  data: Product & {
    seo: Seo
  };
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
  categories,
  products,
  data
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      status: data.status,
      imageUrl: data.imageUrl || "",
      shortName: data.shortName || "",
      gallery: data.gallery || [],
      stock: data.stock,
      price: data.price,
      showNoteForm: data.showNoteForm,
      noteFormLabel: data.noteFormLabel || "",
      noteFormPlaceholder: data.noteFormPlaceholder || "",
      noteFormDescription: data.noteFormDescription || "",
      maxPurchaseQuantity: data.maxPurchaseQuantity,
      isTrending: data.isTrending,
      categoryId: String(data.categoryId),
      discountPrice: data.discountPrice,
      variants: data.variants.map(variant => String(variant)) || [],
      description: data.description || "",
      seo: {
        title: data.seo.title,
        metaDescription: data.seo.metaDescription || "",
        metaKeywords: data.seo.metaKeywords || "",
        ogTitle: data.seo.ogTitle || "",
        ogDescription: data.seo.ogDescription || "",
        ogImage: data.seo.ogImage || "",
        canonicalUrl: data.seo.canonicalUrl || "",
        noIndex: data.seo.noIndex,
        noFollow: data.seo.noFollow,
        entityData: data.seo.entityData || "",
      }
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
      const resp = await putRequest({
        url: `/admin/api/products/${data.id}/update`,
        body
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof productFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Update product successfully" });

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
  }

  return (
    <ProductForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitTitle='Update Product'
      categories={categories}
      products={products}
      handleUpdateSlug={handleUpdateSlug}
    />
  )
}

export default UpdateProductForm;
