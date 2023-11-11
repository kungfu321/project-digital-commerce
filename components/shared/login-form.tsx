'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
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

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await postRequest({
        url: '/api/auth/login',
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof loginFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      router.refresh();
      const cb = searchParams.get('cb');
      if (cb) {
        return router.push(cb);
      }
      if (resp?.data?.role === 'ADMIN') {
        return router.push('/admin/dashboard');
      }
      return router.push('/');
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
                <Input placeholder="Email" {...field} />
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
        <div className='text-right'>
          <Link href="/reset-password" className='text-sm'>Forgot password?</Link>
        </div>
        <Button type="submit" className='w-full' disabled={isLoading}>Login</Button>
      </form>
    </Form>
  )
}

export default LoginForm;
