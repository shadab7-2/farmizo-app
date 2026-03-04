
import api from "./api";

// export const createOrder = async (payload) => {
//   const res = await api.post("/orders", payload);
//   return res.data.data;
// };

export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};

// import api from "./api";

// /* =========================================================
//    Helper: normalize API response
// ========================================================= */
const extractData = (res) => {
  if (!res || !res.data) return null;
  return res.data.data ?? res.data;
};

// /* =========================================================
//    CREATE ORDER
// ========================================================= */
export const createOrder = async (payload) => {
  try {
    const res = await api.post("/orders", payload);
    //  return res.data.data;
     return extractData(res);  // later i will implement this
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to place order";

    throw new Error(message);
  }
};

// /* =========================================================
//    GET MY ORDERS
// ========================================================= */
// export const getMyOrders = async () => {
//   try {
//     const res = await api.get("/orders/my");

//     const orders = extractData(res);

//     // Always return array (prevents .map crash)
//     return Array.isArray(orders) ? orders : [];
//   } catch (err) {
//     const message =
//       err.response?.data?.message ||
//       err.message ||
//       "Failed to load orders";

//     throw new Error(message);
//   }
// };

/* =========================================================
   GET SINGLE ORDER
========================================================= */
export const getOrderById = async (id) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return extractData(res); 
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
      "Failed to load order"
    );
  }
};

/* =========================================================
   CANCEL ORDER (future use)
========================================================= */
export const cancelOrder = async (id) => {
  try {
    const res = await api.patch(`/orders/${id}/cancel`);
    return extractData(res);
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
      "Cancel order failed"
    );
  }
};