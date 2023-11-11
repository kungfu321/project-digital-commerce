'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
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
import { cn, dateTimeFormatted, getOrderStatusObject, setErrorFromZodServer } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderFormSchema } from './schema';
import { OrderExtra } from '@/types';
import { ORDER_STATUS } from '@/constants';
import { Textarea } from '@/components/ui/textarea';
import OrderItemsTable from './order-items-table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import TransactionTable from './transaction/transaction-table';

interface UpdateOrderFormProps {
  data: OrderExtra;
}

const UpdateOrderForm: React.FC<UpdateOrderFormProps> = ({
  data,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      status: data.status,
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const resp = await putRequest({
        url: `/admin/api/orders/${data.id}/update`,
        body: values
      });
      if (!resp?.success) {
        if (resp.error.name === 'ZodError') {
          return setErrorFromZodServer<z.infer<typeof orderFormSchema>>(resp.error, form);
        }

        return toast({ variant: "destructive", description: resp?.error?.message });
      }

      toast({ description: "Update order successfully" });

      router.refresh();
      return router.push('/admin/orders/list');
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    }
  });

  const getPaymentStatus = useMemo(() => {
    const totalReceived = data.paymentTransaction
      ?.filter(item => item.status === 'RECEIVED')
      ?.reduce((p, c) => p + c.amount, 0);

    if (!totalReceived) {
      return 'Unpaid';
    }

    if (totalReceived === data.total) {
      return 'Full Paid';
    }

    if (totalReceived > data.total) {
      return 'Excess Paid';
    }

    return 'Insufficient Paid';
  }, [data.paymentTransaction, data.total]);

  const orderStatusObject = getOrderStatusObject(data.status);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className={cn(
            "col-span-4 h-fit space-y-4",
            "lg:col-span-3"
          )}>
            <Card className='p-4'>
              <div>
                <h4 className=''>Order detail #{data.id}</h4>
                <div className='text-muted-foreground'>Date created: {dateTimeFormatted(data.createdAt, 'mm:HH dd MMM yyyy')}</div>
              </div>
              <div className={cn(
                'mt-4 text-muted-foreground',
                'lg:flex lg:items-start lg:gap-8'
              )}>
                <div className='flex items-center'>
                  <div className='space-y-2'>
                    <div>Customer Name:</div>
                    <div>Customer Email:</div>
                    {
                      data.user?.phoneNumber &&
                      <div>Customer Phone:</div>
                    }
                    <div>Status:</div>
                  </div>
                  <div className='ml-4 space-y-2 font-semibold'>
                    <div>{data.user?.name}</div>
                    <div>
                      <Link href={`/admin/users/${data.user?.id}/update`}>{data.user?.email}</Link>
                    </div>
                    {
                      data.user?.phoneNumber &&
                      <div>{data.user?.phoneNumber}</div>
                    }
                    <Badge>{data.status}</Badge>
                  </div>
                </div>
                {
                  data?.paymentTransaction &&
                  <div className={cn(
                    'flex items-center mt-2',
                    'lg:mt-0'
                  )}>
                    <div className='space-y-2'>
                      <div>Order ID:</div>
                      <div>Payment Method:</div>
                      <div>Payment Status:</div>
                    </div>
                    <div className='ml-4 space-y-2 font-semibold'>
                      <div>#{data.orderId}</div>
                      <div>{data.paymentMethod.name}</div>
                      <div>{getPaymentStatus}</div>
                    </div>
                  </div>
                }
              </div>
            </Card>
            {
              data.paymentTransaction &&
              <Card>
                <TransactionTable
                  orderId={data.id}
                  canAdd={orderStatusObject?.allowedUpdateTransaction}
                  data={data.paymentTransaction} />
              </Card>
            }
            <Card>
              <OrderItemsTable
                canAdd={orderStatusObject?.allowedUpdateOrderItems}
                order={data} />
            </Card>
          </div>
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
                        {
                          ORDER_STATUS.map(({ label, value }) =>
                            <SelectItem key={value} value={value}>
                              {label}
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
              disabled={isLoading || !orderStatusObject?.allowedTransitions?.length}
            >
              Update Order
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default UpdateOrderForm;
