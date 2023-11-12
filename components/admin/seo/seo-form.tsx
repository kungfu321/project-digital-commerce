import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Card } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import UploadImage from '@/components/shared/upload-image';
import { productFormSchema } from "../product/schema";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface SeoFormProps {
  form: UseFormReturn<z.infer<typeof productFormSchema>>;
}

const SeoForm: React.FC<SeoFormProps> = ({
  form
}) => {
  return (
    <Card className="p-4">
      <div className="text-lg font-medium mb-4 border-b border-dashed pb-4">SEO</div>
      <div className="flex items-center space-x-8">
        <FormField
          control={form.control}
          name="seo.noIndex"
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center space-x-2'>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>No Index</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seo.noFollow"
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center space-x-2'>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>No Follow</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="seo.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tile</FormLabel>
            <FormControl>
              <Input placeholder="Tile" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="seo.metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Meta Description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="seo.metaKeywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Keywords</FormLabel>
            <FormControl>
              <Input placeholder="Meta Keywords" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="seo.ogTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>OG Title</FormLabel>
            <FormControl>
              <Input placeholder="OG Title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="seo.ogDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>OG Description</FormLabel>
            <FormControl>
              <Textarea placeholder="OG Description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="seo.canonicalUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Canonical Url</FormLabel>
            <FormControl>
              <Input placeholder="Canonical Url" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="seo.ogImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>OG Image</FormLabel>
            <FormControl>
              <UploadImage
                title='OG Image'
                size='lg'
                onChange={field.onChange}
                initialFiles={field.value ? [{ url: field.value }] as File[] : undefined}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="seo.entityData"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entity Data</FormLabel>
            <FormControl>
              <Textarea placeholder="Entity Data" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  )
}

export default SeoForm;
