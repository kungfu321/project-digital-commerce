'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

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
import { postRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { cn, setErrorFromZodServer } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadImage from '@/components/shared/upload-image';
import { bannerFormSchema } from './schema';
import { Card } from '@/components/ui/card';

interface CreateBannerFormProps {
}

const CreateBannerForm: React.FC<CreateBannerFormProps> = ({ }) => {
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
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-4 gap-4 mt-8">
          <Card className={cn(
            "p-4 col-span-4 h-fit space-y-4",
            "lg:col-span-3"
          )}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backgroundUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>
                  <FormControl>
                    <UploadImage
                      size="lg"
                      title='Select image'
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          <div className={cn(
            "col-span-4 h-fit space-y-4",
            "lg:col-span-1"
          )}>
            <Card className="p-4 space-y-4">
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
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder="Position" {...field} />
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
              Create Banner
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default CreateBannerForm;
