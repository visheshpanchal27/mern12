export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const USERS_URL = `${BASE_URL}/api/users`;
export const CATEGORY_URL = `${BASE_URL}/api/category`;
export const PRODUCTS_URL = `${BASE_URL}/api/products`;
export const UPLOAD_URL = `${BASE_URL}/api/uploads`;
export const ORDERS_URL = `${BASE_URL}/api/orders`;
export const PAYPAL_URL = `${BASE_URL}/api/config/paypal`;
