import { fetchFromAPI } from "@/utils/apiResponce";

/* Get products */
export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `products?${query}` : "products";

  return await fetchFromAPI(endpoint);
};

/* Get single product */
export const fetchProductBySlug = async (slug) => {
  return await fetchFromAPI(`products/${slug}`);
};
