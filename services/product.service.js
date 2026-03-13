import { fetchFromAPI } from "@/utils/apiResponce";
import api from "@/services/api";

/* Get products */
export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `products?${query}` : "products";

  return await fetchFromAPI(endpoint);
};

export const fetchProductsWithPagination = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/products?${query}` : "/products";

  const res = await api.get(endpoint);
  return {
    products: Array.isArray(res.data?.data) ? res.data.data : [],
    pagination: res.data?.pagination || {
      totalProducts: 0,
      totalPages: 0,
      currentPage: Number(params.page) || 1,
    },
  };
};

/* Get single product */
export const fetchProductBySlug = async (slug) => {
  return await fetchFromAPI(`products/${slug}`);
};

export const searchProducts = async ({ q, page = 1, limit = 12 } = {}) => {
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  query.set("page", String(page));
  query.set("limit", String(limit));

  return await fetchFromAPI(`products/search?${query.toString()}`);
};

/* ================= ADMIN PRODUCT CRUD ================= */

export const fetchAdminProducts = async () => {
  const res = await api.get("/admin/products");
  return res.data?.data || [];
};

export const createAdminProduct = async (payload) => {
  const res = await api.post("/admin/products", payload);
  return res.data?.data;
};

export const updateAdminProduct = async (id, payload) => {
  const res = await api.put(`/admin/products/${id}`, payload);
  return res.data?.data;
};

export const deleteAdminProduct = async (id) => {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
};

/* ================= PRODUCT REVIEWS ================= */

export const getProductReviews = async (productId, params = {}) => {
  const query = new URLSearchParams();
  query.set("page", String(params.page || 1));
  query.set("limit", String(params.limit || 10));

  const res = await api.get(`/products/${productId}/reviews?${query.toString()}`);
  return res.data?.data || {
    reviews: [],
    rating: 0,
    numReviews: 0,
    pagination: { total: 0, page: 1, limit: 10, pages: 0 },
  };
};

export const createReview = async (productId, payload) => {
  const res = await api.post(`/products/${productId}/reviews`, payload);
  return res.data?.data || null;
};

export const updateReview = async (productId, payload) => {
  const res = await api.put(`/products/${productId}/reviews`, payload);
  return res.data?.data || null;
};

export const deleteReview = async (productId) => {
  const res = await api.delete(`/products/${productId}/reviews`);
  return res.data?.data || null;
};
