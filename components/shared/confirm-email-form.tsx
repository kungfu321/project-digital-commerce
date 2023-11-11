'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';

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
import { setErrorFromZodServer } from '@/lib/utils';

export const confirmEmailFormSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const ConfirmEmailForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof confirmEmailFormSchema>>({
    resolver: zodResolver(confirmEmailFormSchema),
    defaultValues: {
      email: searchParams.get('email') as string,
      code: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await postRequest({
        url: '/api/auth/activate',
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof confirmEmailFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Email address confirmed successfully" });

      router.refresh();
      return router.push('/login');
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" disabled {...field} />
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
        <Button
          type="submit"
          className='w-full'
          disabled={isLoading}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default ConfirmEmailForm;
