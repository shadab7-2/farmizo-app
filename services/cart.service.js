import { fetchFromAPI } from "@/utils/apiResponce";

/* GET CART */
export const getMyCart = async () => {
  const res = await fetchFromAPI("cart");
  return res;
};

/* ADD */
// export const addItemToCartDB = async (productId, quantity = 1) => {
//   const res = await fetchFromAPI("cart/add", {
//     method: "POST",
//     body: JSON.stringify({ productId, quantity }),
//   });
//   return res;
// };
export const addItemToCartDB = async (productId, quantity = 1) => {
  return fetchFromAPI("cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
};

/* UPDATE */
// export const updateCartItemDB = async (productId, quantity) => {
//   const res = await fetchFromAPI("cart/update", {
//     method: "PUT",
//     body: JSON.stringify({ productId, quantity }),
//   });
//   return res;
// };

export const updateCartItemDB = async (productId, quantity) => {
  return fetchFromAPI(`cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ productId, quantity }),
  });
};

/* REMOVE */
// export const removeCartItemDB = async (productId) => {
//   const res = await fetchFromAPI(`cart/remove/${productId}`, {
//     method: "DELETE",
//   });
//   return res;
// };

export const removeCartItemDB = async (productId) => {
  return fetchFromAPI(`cart/${productId}`, {
    method: "DELETE",
  });
};

/* CLEAR */
// export const clearCartDB = async () => {
//   await fetchFromAPI("cart/clear", { method: "DELETE" });
// };
export const clearCartDB = async () => {
  return fetchFromAPI("cart", { method: "DELETE" });
};
