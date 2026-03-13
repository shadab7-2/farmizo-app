
import api from "./api";

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
    const normalizedError = new Error(message);
    normalizedError.response = err.response;
    normalizedError.status = err.response?.status;
    throw normalizedError;
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

const fetchInvoiceBlob = async (orderId) => {
  try {
    const res = await api.get(`/orders/${orderId}/invoice`, {
      responseType: "blob",
    });
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Failed to download invoice";
    const normalizedError = new Error(message);
    normalizedError.response = err.response;
    throw normalizedError;
  }
};

const buildInvoiceFilename = (orderId) =>
  `invoice-${String(orderId || "").slice(-6) || "order"}.pdf`;

export const downloadInvoice = async (orderId) => {
  const blob = await fetchInvoiceBlob(orderId);
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = buildInvoiceFilename(orderId);
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

export const previewInvoice = async (orderId) => {
  const blob = await fetchInvoiceBlob(orderId);
  const url = window.URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
};


/* =========================================================
   ADMIN: GET ORDERS (WITH FILTERS)
========================================================= */
export const getAdminOrders = async (params = {}) => {
  try {
    const res = await api.get("/admin/orders", { params });
    return {
      orders: Array.isArray(res?.data?.data) ? res.data.data : [],
      pagination: res?.data?.pagination ?? {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
      },
      summary: res?.data?.summary ?? {
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
      },
    };
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to load admin orders";

    throw new Error(message);
  }
};

/* =========================================================
   ADMIN: GET SINGLE ORDER
========================================================= */
export const getAdminOrderById = async (id) => {
  try {
    const res = await api.get(`/admin/orders/${id}`);
    return extractData(res);
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
      "Failed to load order details"
    );
  }
};

/* =========================================================
   ADMIN: UPDATE ORDER STATUS
========================================================= */
export const updateAdminOrderStatus = async (id, status) => {
  try {
    const res = await api.put(`/admin/orders/${id}/status`, { status });
    return extractData(res);
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
      "Failed to update order status"
    );
  }
};

/* =========================================================
   ADMIN: RESEND INVOICE EMAIL
========================================================= */
export const resendInvoiceEmail = async (orderId) => {
  try {
    const res = await api.post(`/orders/${orderId}/resend-invoice`);
    return extractData(res);
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
      "Failed to resend invoice email"
    );
  }
};
