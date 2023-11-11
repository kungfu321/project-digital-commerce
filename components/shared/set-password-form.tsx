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
import { useToast } from '../ui/use-toast';
import { postRequest } from '@/lib/request';
import { setErrorFromZodServer } from '@/lib/utils';

export const setPasswordFormSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

const SetPasswordForm = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof setPasswordFormSchema>>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      email: searchParams.get('email') as string,
      code: "",
      password: "",
      confirmPassword: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await postRequest({
        url: '/api/auth/set-password',
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof setPasswordFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Changed password successfully" });

      router.refresh();
      return router.push(`/login`);
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className='w-full'>Change Password</Button>
      </form>
    </Form>
  )
}

export default SetPasswordForm;
