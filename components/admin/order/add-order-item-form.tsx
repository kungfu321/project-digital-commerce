'use client';

import { Product } from '@prisma/client';
import useSWR from 'swr';
import { MouseEvent, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MultiSelect } from '@/components/ui/multi-select';
import { postRequest } from '@/lib/request';

const AddOrderItemForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>('');
  const { data: products } = useSWR<{ data?: Product[] }, Error>(`/admin/api/products?q=${query}`);
  const [selected, setSelected] = useState<string[]>([]);
  const { id: orderId } = useParams();

  const handleAddOrderItems = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      e.stopPropagation();
      const body = {
        productIds: selected.map(item => Number(item))
      };

      const resp = await postRequest({
        url: `/admin/api/orders/${orderId}/add-order-item`,
        body
      });
      if (!resp?.success) {
        return toast({ variant: "destructive", description: resp?.error?.message });
      }
      setSelected([]);

      router.refresh();
      toast({ description: "Add order items successfully" });
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "There was a problem with your request." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex items-center w-full p-4 space-x-4'>
      <MultiSelect
        options={products?.data?.map(({ id, name }) => ({ value: String(id), label: name })) || []}
        selected={selected}
        onChange={(value) => setSelected(value)}
        onInputChange={(value) => setQuery(value)}
        placeholder="Select products"
        className='w-full'
      />
      <Button
        variant="outline"
        className='w-full'
        onClick={handleAddOrderItems}
        disabled={!selected.length || loading}
      >
        Add more products
      </Button>
    </div>
  )
}

export default AddOrderItemForm;
