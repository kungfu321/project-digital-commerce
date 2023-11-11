'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

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
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadImage from '@/components/shared/upload-image';

interface ProfileFormProps {
  data: User;
}

export const profileFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  gender: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

const ProfileForm: React.FC<ProfileFormProps> = ({
  data
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: data.name || '',
      email: data.email,
      phoneNumber: data.phoneNumber || '',
      gender: data.gender || '',
      imageUrl: data.imageUrl || '',
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await putRequest({
        url: '/api/user/update',
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof profileFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Update profile successfully" });

      router.refresh();
      return router.refresh();
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className={cn(
          "p-4 col-span-4 h-fit space-y-4",
          "lg:col-span-3"
        )}>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <UploadImage
                    title='Select avatar'
                    onChange={field.onChange}
                    initialFiles={[{ url: field.value }] as File[]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  defaultValue={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select gender"
                        defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">
                      Male
                    </SelectItem>
                    <SelectItem value="female">
                      Female
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className='w-full mt-4'
            disabled={isLoading}
          >
            Update Profile
          </Button>
        </Card>
      </form>
    </Form>
  )
}

export default ProfileForm;
