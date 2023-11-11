import { cookies } from "next/headers";

export const getRequestSVOnly = async (url: string, options?: {}) => {
  try {
    const resp = await fetch(process.env.NEXT_PUBLIC_APP_URL + url, {
      ...options,
    });
    return await resp.json();
  } catch (error) {
    return error;
  }
}

export const generateUrlQuery = (url: string, queries?: Record<string, any>): string => {
  if (!queries) return url;
  const filteredObject = Object.fromEntries(
    Object.entries(queries).filter(([_key, value]) => value !== null && value !== undefined)
  );

  const current = new URLSearchParams(filteredObject);

  return `${url}?${current.toString()}`;
}

type QueryType = {
  options?: {},
  take?: string;
  skip?: string;
  q?: string;
};

export const getProducts = async (props?: QueryType & { isBestseller?: boolean }) => {
  return await getRequestSVOnly(generateUrlQuery('/admin/api/products', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['products'] },
    ...props?.options
  });
};

export const getProduct = async (props: { options?: {}, id: string }) => {
  return await getRequestSVOnly(`/admin/api/products/${props.id}`, {
    headers: {
      Cookie: cookies(),
      next: { tags: ['products', `product-${props.id}`] },
    },
    ...props?.options
  });
};

export const getCategories = async (props?: QueryType) => {
  return await getRequestSVOnly(generateUrlQuery('/admin/api/categories', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['categories'] },
    ...props?.options
  });
};

export const getCategory = async (props: { options?: {}, id: string }) => {
  return await getRequestSVOnly(`/admin/api/categories/${props.id}`, {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['categories', `category-${props.id}`] },
    ...props?.options
  });
};

export const getCoupons = async (props?: QueryType) => {
  return await getRequestSVOnly(generateUrlQuery('/admin/api/coupons', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['coupons'] },
    ...props?.options
  });
};

export const getCoupon = async (props: { options?: {}, id: string }) => {
  return await getRequestSVOnly(`/admin/api/coupons/${props.id}`, {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['coupons', `coupon-${props.id}`] },
    ...props?.options
  });
};

export const getBanner = async (props: { options?: {}, id: string }) => {
  return await getRequestSVOnly(`/admin/api/banners/${props.id}`, {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['banners', `banner-${props.id}`] },
    ...props?.options
  });
};

export const getBanners = async (props?: QueryType) => {
  return await getRequestSVOnly(generateUrlQuery('/admin/api/banners', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['banners'] },
    ...props?.options
  });
};

export const getUsers = async (props?: QueryType & { role?: string }) => {
  return await getRequestSVOnly(generateUrlQuery('/admin/api/users', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['users'] },
    ...props?.options
  });
};

export const getUser = async (props: { options?: {}, id: string }) => {
  return await getRequestSVOnly(`/admin/api/users/${props.id}`, {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['users', `user-${props.id}`] },
    ...props?.options
  });
};

export const getOrders = async (props?: QueryType & { status?: string }) => {
  return await getRequestSVOnly(generateUrlQuery('/admin/api/orders', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['orders'] },
    ...props?.options
  });
};

export const getOrder = async (props: { options?: {}, id: string }) => {
  return await getRequestSVOnly(`/admin/api/orders/${props.id}`, {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['orders', `order-${props.id}`] },
    ...props?.options
  });
};

export const getOrderTransaction = async (props: { options?: {}, id: string, transactionId: string }) => {
  return await getRequestSVOnly(`/admin/api/orders/${props.id}/transactions/${props.transactionId}`, {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['orders', `order-${props.id}`] },
    ...props?.options
  });
};

export const getUserInfo = async (props?: { options?: {} }) => {
  return await getRequestSVOnly("/api/auth/me", {
    headers: {
      Cookie: cookies()
    },
    ...props?.options
  });
};

export const getPaymentMethods = async (props?: QueryType) => {
  return await getRequestSVOnly(generateUrlQuery('/admin/api/payment-methods', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['paymentMethods'] },
    ...props?.options
  });
};

export const getPaymentMethod = async (props: { options?: {}, id: string }) => {
  return await getRequestSVOnly(`/admin/api/payment-methods/${props.id}`, {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['paymentMethods', `paymentMethod-${props.id}`] },
    ...props?.options
  });
};

export const getLogs = async (props?: QueryType & { action?: string, entity?: string, entityId?: string, userId?: string }) => {
  return await getRequestSVOnly(generateUrlQuery('/admin/api/logs', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['logs'] },
    ...props?.options
  });
};

export const getAnalytics = async <T>(props?: QueryType): Promise<{ data: T }> => {
  return await getRequestSVOnly(generateUrlQuery('/admin/api/analytics', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['analytics'] },
    ...props?.options
  });
};

// SHOP API
export const getShopProducts = async (props: QueryType & { categoryId?: string, isTrending?: boolean, isBestseller?: boolean, newest?: boolean }) => {
  return await getRequestSVOnly(generateUrlQuery('/api/products', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['products'] },
    ...props?.options
  });
};

export const getShopProduct = async (props: { options?: {}, slug: string }) => {
  return await getRequestSVOnly(`/api/products/${props.slug}`, {
    headers: {
      Cookie: cookies(),
      next: { tags: ['products', `product-${props.slug}`] },
    },
    ...props?.options
  });
};

export const getShopBanners = async (props?: QueryType) => {
  return await getRequestSVOnly(generateUrlQuery('/api/banners', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['banners'] },
    ...props?.options
  });
};

export const getShopProductComments = async (props: QueryType & { productId: string }) => {
  return await getRequestSVOnly(generateUrlQuery(`/api/comments/product/${props.productId}`, props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['comments', `comment-product-${props.productId}`] },
    ...props?.options
  });
};

export const getShopPaymentMethods = async (props?: { options?: {} }) => {
  return await getRequestSVOnly(`/api/payment-methods`, {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['paymentMethods'] },
    ...props?.options
  });
};

export const getShopUserOrders = async (props?: QueryType) => {
  return await getRequestSVOnly(generateUrlQuery('/api/user/orders', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['orders'] },
    ...props?.options
  });
};

export const getShopUserOrder = async (props: { options?: {}, orderId: string }) => {
  return await getRequestSVOnly(`/api/user/orders/${props.orderId}`, {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['orders', `order-${props.orderId}`] },
    ...props?.options
  });
};

export const getShopCategories = async (props?: QueryType) => {
  return await getRequestSVOnly(generateUrlQuery('/api/categories', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['categories'] },
    ...props?.options
  });
};

export const getShopUserAffiliates = async (props?: QueryType) => {
  return await getRequestSVOnly(generateUrlQuery('/api/user/affiliates', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['affiliates'] },
    ...props?.options
  });
};

export const getShopUserWallet = async (props?: QueryType) => {
  return await getRequestSVOnly(generateUrlQuery('/api/user/wallet', props), {
    headers: {
      Cookie: cookies()
    },
    next: { tags: ['wallet'] },
    ...props?.options
  });
};
