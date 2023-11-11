"use client";

import { ShoppingCart } from "lucide-react";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductActionProps {
  data: Product;
}

const ProductAction: React.FC<ProductActionProps> = ({ data }) => {
  const { handleAddProductToCart, handleGetItemQuantityById } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const [note, setNote] = useState('');

  const handleAddToCart = (buyNow = false) => {
    const itemQuantity = handleGetItemQuantityById(data.id);
    if (data.maxPurchaseQuantity && data.maxPurchaseQuantity <= itemQuantity) {
      if (buyNow) {
        return router.push('/cart');
      }
      return toast({
        variant: "destructive",
        description: `The maximum quantity that can be purchased is ${data.maxPurchaseQuantity} product(s)`
      });
    }

    handleAddProductToCart({
      id: data.id,
      quantity: 1,
      maxPurchaseQuantity: data.maxPurchaseQuantity,
      imageUrl: data.imageUrl,
      name: data.name,
      slug: data.slug,
      price: data.discountPrice,
      note
    });

    toast({
      description: "Product added to cart successfully"
    });
    if (buyNow) {
      return router.push('/cart');
    }
  }

  return (
    <div>
      {
        data.showNoteForm &&
        <div className="border-b border-dashed pb-4 mb-4">
          <Label className="text-red-500">{data.noteFormLabel}</Label>
          <Textarea
            placeholder={data.noteFormPlaceholder || ''}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1" />
          <span className="text-sm text-muted-foreground">{data.noteFormDescription}</span>
        </div>
      }
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => handleAddToCart()}
          disabled={data.stock <= 0 || (data.showNoteForm && !note)}
          className="w-full font-semibold bg-amber-400 text-amber-400-foreground hover:bg-amber-400/90">
          <ShoppingCart size={18} />
          <span className="ml-2">Add to Cart</span>
        </Button>
        <Button
          className="w-full font-semibold"
          disabled={data.stock <= 0 || (data.showNoteForm && !note)}
          onClick={() => handleAddToCart(true)}>Buy Now</Button>
      </div>
    </div>
  )
}

export default ProductAction;
