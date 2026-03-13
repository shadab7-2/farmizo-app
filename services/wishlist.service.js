import { fetchFromAPI } from "@/utils/apiResponce";

export const getWishlist = async () => {
  return fetchFromAPI("wishlist");
};

export const addToWishlist = async (productId) => {
  return fetchFromAPI("wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
};

export const removeFromWishlist = async (productId) => {
  return fetchFromAPI(`wishlist/${productId}`, {
    method: "DELETE",
  });
};

export const clearWishlist = async () => {
  return fetchFromAPI("wishlist", {
    method: "DELETE",
  });
};
