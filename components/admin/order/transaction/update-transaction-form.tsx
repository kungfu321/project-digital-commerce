'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PaymentMethod, PaymentTransaction } from '@prisma/client';

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
import { cn, dateTimeFormatted, setErrorFromZodServer } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { transactionFormSchema } from './schema';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface UpdateTransactionFormProps {
  paymentMethods: PaymentMethod[];
  data: PaymentTransaction;
}

const UpdateTransactionForm: React.FC<UpdateTransactionFormProps> = ({
  paymentMethods,
  data
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      status: data.status,
      methodId: String(data.methodId),
      amount: data.amount,
      note: data.note || "",
      transactionDate: data.transactionDate,
      transactionId: data.transactionId || "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await putRequest({
        url: `/admin/api/orders/${data.orderId}/transactions/${data.id}/update`,
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof transactionFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Update transaction successfully" });

      router.refresh();
      return router.push(`/admin/orders/${data.orderId}/update`);
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
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Transaction ID"
                      disabled
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          disabled
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>{dateTimeFormatted(field.value)}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onDayClick={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      disabled
                      placeholder="Amount"
                      {...field} />
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
                      disabled={field.value !== 'PENDING'}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">
                          PENDING
                        </SelectItem>
                        <SelectItem value="FAILED">
                          FAILED
                        </SelectItem>
                        <SelectItem value="RECEIVED">
                          RECEIVED
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="methodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method ID</FormLabel>
                    <Select
                      defaultValue={field.value}
                      value={field.value}
                      disabled
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select method"
                            defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          paymentMethods?.map(item =>
                            <SelectItem
                              key={item.id}
                              value={String(item.id)}>
                              {item.name}
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
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Note" {...field} />
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
              Update Transaction
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default UpdateTransactionForm;
