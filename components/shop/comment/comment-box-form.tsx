'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { postRequest } from '@/lib/request';
import { setErrorFromZodServer } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-react';

export const commentFormSchema = z.object({
  text: z.string(),
});

interface CommentBoxFormProps {
  productId: string;
  userId?: string;
}

const CommentBoxForm: React.FC<CommentBoxFormProps> = ({
  productId,
  userId
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      text: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const body = {
        ...values,
        productId,
        userId
      };

      const resp = await postRequest({
        url: '/api/comments/create',
        body
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof commentFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      form.reset();
      router.refresh();
      toast({ description: "Post comment successfully" });
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Enter comment..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='text-end'>
          <Button
            type="submit"
            className='mt-2'
            disabled={isLoading}
          >
            <SendIcon size={18} />
            <span className='ml-2'>Post comment</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CommentBoxForm;
