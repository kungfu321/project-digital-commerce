'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PaymentMethod } from '@prisma/client';

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
import { putRequest } from '@/lib/request';
import { useToast } from '@/components/ui/use-toast';
import { cn, setErrorFromZodServer } from '@/lib/utils';
import { paymentMethodFormSchema } from './schema';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface UpdatePaymentMethodFormProps {
  data: PaymentMethod;
}

const UpdatePaymentMethodForm: React.FC<UpdatePaymentMethodFormProps> = ({
  data
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof paymentMethodFormSchema>>({
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: {
      name: data.name,
      code: data.code,
      description: data.description || "",
      isActive: data.isActive
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await putRequest({
        url: `/admin/api/payment-methods/${data.id}/update`,
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof paymentMethodFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Update payment method successfully" });

      router.refresh();
      return router.push('/admin/settings/payment-method');
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-4 gap-4">
          <Card className={cn(
            "p-4 col-span-4 h-fit space-y-4",
            "lg:col-span-3"
          )}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Code" {...field} />
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
                    <Input placeholder="Description" {...field} />
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
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center space-x-2'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Active</FormLabel>
                    </div>
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
              Update Payment Method
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default UpdatePaymentMethodForm;
