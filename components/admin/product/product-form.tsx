'use client';

import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { Category, Product } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "../editor";
import UploadImage from '@/components/shared/upload-image';
import { MultiSelect } from '@/components/ui/multi-select';
import { productFormSchema } from './schema';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import SeoForm from '../seo/seo-form';

interface ProductFormProps {
  categories: Category[];
  products: Product[];
  form: UseFormReturn<z.infer<typeof productFormSchema>>;
  onSubmit: () => void;
  handleUpdateSlug: () => void;
  isLoading: boolean;
  submitTitle: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  categories,
  products,
  onSubmit,
  handleUpdateSlug,
  isLoading,
  submitTitle
}) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className={cn(
            "col-span-4 h-fit space-y-4",
            "lg:col-span-3"
          )}>
            <Card className="p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl onBlur={handleUpdateSlug}>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short name</FormLabel>
                    <FormControl onBlur={handleUpdateSlug}>
                      <Input placeholder="Short name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Editor
                        content={field.value}
                        onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gallery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gallery</FormLabel>
                    <FormControl>
                      <UploadImage
                        size="lg"
                        title='Select images'
                        onChange={field.onChange}
                        initialFiles={field.value?.length! > 0 ? field.value?.map(item => ({ url: item })) as File[] : undefined}
                        multiple />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
            <SeoForm form={form} />
          </div>
          <div className={cn(
            "col-span-4 h-fit space-y-4",
            "lg:col-span-1"
          )}>
            <Card className="p-4">
              <FormField
                control={form.control}
                name="isTrending"
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center space-x-2'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Trending</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">
                          DRAFT
                        </SelectItem>
                        <SelectItem value="PUBLISHED">
                          PUBLISHED
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input placeholder="Stock" type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxPurchaseQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max purchase quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="Max purchase quantity" type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      defaultValue={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          categories?.map(cat =>
                            <SelectItem key={cat.id} value={`${cat.id}`}>
                              {cat.name}
                            </SelectItem>
                          )
                        }
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="variants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variants</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={products?.map(({ id, name }) => ({ value: String(id), label: name }))}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select variants"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
            <Card className="p-4 space-y-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Price" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Discount Price" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
            <Card className="p-4 space-y-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <UploadImage
                        title='Select thumbnail'
                        onChange={field.onChange}
                        initialFiles={field.value ? [{ url: field.value }] as File[] : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
            <Card className='p-4'>
              <FormField
                control={form.control}
                name="showNoteForm"
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center space-x-2'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Show note form</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noteFormLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note form label</FormLabel>
                    <FormControl>
                      <Input placeholder="Note form label" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noteFormPlaceholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note form placeholder</FormLabel>
                    <FormControl>
                      <Input placeholder="Note form placeholder" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noteFormDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note form description</FormLabel>
                    <FormControl>
                      <Input placeholder="Note form description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
            <Button
              type="submit"
              className='w-full mt-4'
              disabled={isLoading}
            >
              {submitTitle}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm;
