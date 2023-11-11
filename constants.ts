import { NavigationType } from "./types";

export const NAVIGATION: NavigationType[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: "dashboard",
  },
  {
    title: "Shop",
    icon: "shop",
    slug: "shop",
    children: [
      {
        title: "Banners",
        url: "/admin/banners/list",
        breadcrumbs: ["Banner List"]
      },
      {
        title: "Create Banner",
        url: "/admin/banners/create",
        breadcrumbs: ["New Banner"]
      },
      {
        title: "Update Banner",
        url: "/admin/banners/[id]/update",
        breadcrumbs: ["Update Banner"],
        hidden: true
      },
    ]
  },
  {
    title: "Products",
    icon: "product",
    slug: "products",
    children: [
      {
        title: "List",
        url: "/admin/products/list",
        breadcrumbs: ["Product List"]
      },
      {
        title: "Create",
        url: "/admin/products/create",
        breadcrumbs: ["New Product"]
      },
      {
        title: "Update",
        url: "/admin/products/[id]/update",
        breadcrumbs: ["Update Product"],
        hidden: true
      },
    ]
  },
  {
    title: "Orders",
    icon: "order",
    slug: "order",
    children: [
      {
        title: "List",
        url: "/admin/orders/list",
        breadcrumbs: ["Order List"]
      },
      {
        title: "Update",
        url: "/admin/orders/[id]/update",
        breadcrumbs: ["Update Order"],
        hidden: true
      },
      {
        title: "Create",
        url: "/admin/orders/[id]/transactions/create",
        breadcrumbs: ["Transactions", "Create Transaction"],
        hidden: true
      },
      {
        title: "Update",
        url: "/admin/orders/[id]/transactions/[id]/update",
        breadcrumbs: ["Transactions", "Update Transaction"],
        hidden: true
      },
    ]
  },
  {
    title: "Categories",
    icon: "category",
    slug: "category",
    children: [
      {
        title: "List",
        url: "/admin/categories/list",
        breadcrumbs: ["Category List"]
      },
      {
        title: "Create",
        url: "/admin/categories/create",
        breadcrumbs: ["New Category"]
      },
      {
        title: "Update",
        url: "/admin/categories/[id]/update",
        breadcrumbs: ["Update Category"],
        hidden: true
      },
    ]
  },
  {
    title: "Coupons",
    icon: "coupon",
    slug: "coupon",
    children: [
      {
        title: "List",
        url: "/admin/coupons/list",
        breadcrumbs: ["Coupon List"]
      },
      {
        title: "Create",
        url: "/admin/coupons/create",
        breadcrumbs: ["New Coupon"]
      },
      {
        title: "Update",
        url: "/admin/coupons/[id]/update",
        breadcrumbs: ["Update Coupon"],
        hidden: true
      },
    ]
  },
  {
    title: "Users",
    icon: "user",
    slug: "user",
    children: [
      {
        title: "List",
        url: "/admin/users/list",
        breadcrumbs: ["User List"]
      },
      {
        title: "Update",
        url: "/admin/users/[id]/update",
        breadcrumbs: ["Update User"],
        hidden: true
      },
    ]
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: "setting"
  },
];

export const ADMIN_SETTING_NAV = [
  {
    href: '/admin/settings',
    title: 'Settings'
  },
  {
    href: '/admin/settings/payment-method',
    title: 'Payment Method'
  },
];

export const THEME_MODES = [
  {
    label: "Light",
    value: "light"
  },
  {
    label: "Dark",
    value: "dark"
  },
];

export const ORDER_STATUS = [
  {
    label: 'Pending',
    value: 'PENDING',
    allowedTransitions: ['PROCESSING', 'COMPLETED', 'CANCELLED'],
    allowedUpdateTransaction: true,
    allowedUpdateOrderItems: true,
  },
  {
    label: 'Processing',
    value: 'PROCESSING',
    allowedTransitions: ['COMPLETED', 'CANCELLED'],
    allowedUpdateTransaction: true,
    allowedUpdateOrderItems: true,
  },
  {
    label: 'Completed',
    value: 'COMPLETED',
    allowedTransitions: ['REFUNDED'],
    allowedUpdateTransaction: false,
    allowedUpdateOrderItems: false,
  },
  {
    label: 'Refunded',
    value: 'REFUNDED',
    allowedTransitions: [],
    allowedUpdateTransaction: false,
    allowedUpdateOrderItems: false,
  },
  {
    label: 'Cancelled',
    value: 'CANCELLED',
    allowedTransitions: [],
    allowedUpdateTransaction: false,
    allowedUpdateOrderItems: false,
  },
];

export const SHOP_USER_NAV = [
  {
    href: '/user/profile',
    title: 'Profile'
  },
  {
    href: '/user/wallet',
    title: 'Wallet'
  },
  {
    href: '/user/orders',
    title: 'Orders'
  },
  {
    href: '/user/affiliate',
    title: 'Affiliate'
  },
];
