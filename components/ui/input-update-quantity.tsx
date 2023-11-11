'use client';

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "./button"
import { Input } from "./input"
import { cn } from "@/lib/utils";

export interface InputUpdateQuantityProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    onIncrement(): void;
    onDecrement(): void;
  }

const InputUpdateQuantity = React.forwardRef<HTMLInputElement, InputUpdateQuantityProps>(
  ({ className, onIncrement, onDecrement, ...props }, ref) => {
    return (
      <div className="relative w-24 text-muted-foreground">
        <Button
          className={cn(
            "absolute p-0 h-10 top-0 left-0",
            "hover:bg-transparent"
          )}
          size="icon"
          onClick={onDecrement}
          variant="ghost">
          <MinusIcon size={18} />
        </Button>
        <Input
          className="w-24 h-10 text-center"
          readOnly
          type="number"
          ref={ref}
          {...props}
        />
        <Button
          className={cn(
            "absolute p-0 h-10 top-0 right-0",
            "hover:bg-transparent"
          )}
          size="icon"
          onClick={onIncrement}
          variant="ghost">
          <PlusIcon size={18} />
        </Button>
      </div>
    )
  }
)
InputUpdateQuantity.displayName = "InputUpdateQuantity"

export { InputUpdateQuantity }
