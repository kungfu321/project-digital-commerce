import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from 'zod';
import { format, parseISO } from "date-fns";
import { ORDER_STATUS } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setErrorFromZodServer<T>(error: z.ZodError, form: any) {
  return error.issues.forEach((issue: z.ZodIssue) => {
    const fieldName = issue.path[0];
    form.setError(fieldName as keyof T, {
      type: "server",
      message: issue.message,
    });
  });
}

export function stringToSlug(input: string): string {
  return input
    ?.toLowerCase()
    ?.replace(/[\s]+/g, '-')
    ?.replace(/[^a-z0-9-]/g, '')
    ?.replace(/[-]+/g, '-')
    ?.trim();
};

export function currencyFormatted(amount?: string | Number) {
  if (!amount) return 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
};

export function dateTimeFormatted(dateTime: string | Date, formatValue = 'dd MMM yyyy') {
  if (!dateTime) return "";
  try {
    if (typeof dateTime === 'object') {
      return format(dateTime, formatValue);
    }
    return format(parseISO(dateTime), formatValue);
  } catch (error) {
    return String(dateTime);
  }
};

export function isPastDate(date: Date, to = new Date()) {
  return date < to;
}

export function firstLetters(value?: string | null) {
  if (!value) return 'OK';
  const words = value.split(' ');

  return words?.map(word => word.charAt(0).toUpperCase()) ?? 'OK';
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function isObjectEmpty<T>(objectValue: T) {
  return Object.keys(objectValue || {}).length === 0;
}

export function getOrderLabel(key: string) {
  return ORDER_STATUS.filter(item => item.value === key)[0]?.label;
}

export function convertToTitleCase(inputString: string) {
  const words = inputString.split(/(?=[A-Z])/);

  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function getOrderStatusObject(currentStatus: string) {
  return ORDER_STATUS.find((s) => s.value === currentStatus);
}

export function validateOrderStatus(currentStatus: string, newStatus: string) {
  const currentStatusObject = getOrderStatusObject(currentStatus);
  return currentStatusObject?.allowedTransitions.includes(newStatus);
}

