import { Affiliate, Category, Comment, Coupon, Log, Order, OrderItem, PaymentMethod, PaymentTransaction, Product, User } from "@prisma/client";

export interface ProductExtra extends Product {
  category: Category;
}

export interface AffiliateExtra extends Affiliate {
  user: User;
}

export interface CommentProduct extends Comment {
  user: User & {
    orders: {
      userId: number
    }[];
  };
}

export interface UserExtra extends User {
  referredBy?: AffiliateExtra;
  affiliate?: Affiliate;
}

export interface PaymentTransactionExtra extends PaymentTransaction {
  method: PaymentMethod;
}

export interface CartItem {
  id: number;
  quantity: number;
  maxPurchaseQuantity: number;
  imageUrl: string;
  name: string;
  slug: string;
  note?: string;
  price: number;
}

export interface Cart {
  items: CartItem[]
}

export interface OrderExtra extends Order {
  user?: User;
  orderItems: OrderItem[];
  coupon: Coupon | null;
  affiliate: Affiliate | null;
  paymentMethod: PaymentMethod;
  paymentTransaction?: PaymentTransactionExtra[];
}

export interface LogExtra extends Log {
  user: User;
}

export interface PaginationType {
  total: number;
  take: number;
  skip: number;
  pageCount: number;
}

interface NavigationItemType {
  title: string;
  url?: string;
  icon?: string;
  slug?: string;
  breadcrumbs?: string[];
  hidden?: boolean;
}

export interface NavigationType extends NavigationItemType {
  children?: NavigationItemType[];
}

export interface OrderPayment {
  orderId: string;
  total: number;
  qrCodeValue?: string;
}

export interface ShopUserOrder extends Order {
  orderItems: OrderItem[];
  coupon: Coupon | null;
}

export interface AffiliateCheck {
  code: string;
  discountPercent: number;
}

export interface PaymentTransactionOrder extends PaymentTransaction {
  order: {
    orderId: String;
  }
}

export interface WalletTransactions {
  transactions: PaymentTransactionOrder[],
  walletBalance: Number;
}
