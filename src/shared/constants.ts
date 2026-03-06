export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const PET_STATUS = {
  AVAILABLE: 'available',
  ADOPTED: 'adopted',
  PENDING: 'pending',
  UNAVAILABLE: 'unavailable',
} as const;

export const ADOPTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const JWT_COOKIE_NAME = 'mypetjoy_token';