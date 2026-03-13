import api from "@/services/api";

const extractData = (res) => res?.data?.data ?? null;
const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export const getDashboardStats = async () => {
  try {
    const res = await api.get("/admin/dashboard/stats");
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load dashboard stats"));
  }
};

export const getAdminAnalyticsOverview = async () => {
  try {
    const res = await api.get("/admin/analytics/overview");
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load analytics overview"));
  }
};

export const getAdminAnalyticsSales = async () => {
  try {
    const res = await api.get("/admin/analytics/sales");
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load sales analytics"));
  }
};

export const getAdminAnalyticsProducts = async () => {
  try {
    const res = await api.get("/admin/analytics/products");
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load product analytics"));
  }
};

export const getAdminAnalyticsCustomers = async () => {
  try {
    const res = await api.get("/admin/analytics/customers");
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load customer analytics"));
  }
};

export const getAdminPaymentStats = async () => {
  try {
    const res = await api.get("/admin/payments/stats");
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load payment stats"));
  }
};

export const getAdminAnalyticsBundle = async () => {
  const [overview, sales, products, customers, payments] = await Promise.all([
    getAdminAnalyticsOverview(),
    getAdminAnalyticsSales(),
    getAdminAnalyticsProducts(),
    getAdminAnalyticsCustomers(),
    getAdminPaymentStats(),
  ]);

  return {
    overview,
    sales,
    products,
    customers,
    payments,
  };
};

export const getAdminCustomers = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    query.set("page", String(params.page || 1));
    query.set("limit", String(params.limit || 10));
    if (params.search) query.set("search", String(params.search));

    const res = await api.get(`/admin/customers?${query.toString()}`);

    return {
      customers: Array.isArray(res.data?.data) ? res.data.data : [],
      stats: {
        totalCustomers: Number(res.data?.stats?.totalCustomers || 0),
        totalOrders: Number(res.data?.stats?.totalOrders || 0),
        totalRevenue: Number(res.data?.stats?.totalRevenue || 0),
      },
      pagination: {
        page: Number(res.data?.pagination?.page || params.page || 1),
        limit: Number(res.data?.pagination?.limit || params.limit || 10),
        totalPages: Number(res.data?.pagination?.totalPages || 1),
        totalItems: Number(res.data?.pagination?.totalItems || 0),
        hasNextPage: Boolean(res.data?.pagination?.hasNextPage),
        hasPrevPage: Boolean(res.data?.pagination?.hasPrevPage),
      },
    };
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load customers"));
  }
};

export const toggleAdminCustomerStatus = async (customerId) => {
  try {
    const res = await api.patch(`/admin/customers/${customerId}/toggle`);
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to update customer status"));
  }
};

export const getAdminReviews = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    query.set("page", String(params.page || 1));
    query.set("limit", String(params.limit || 10));
    if (params.q) query.set("q", String(params.q));
    if (params.rating) query.set("rating", String(params.rating));

    const res = await api.get(`/admin/reviews?${query.toString()}`);
    return {
      reviews: Array.isArray(res.data?.data) ? res.data.data : [],
      pagination: res.data?.pagination || {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        limit: Number(params.limit || 10),
      },
    };
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load admin reviews"));
  }
};

export const deleteAdminReview = async (reviewId) => {
  try {
    const res = await api.delete(`/admin/reviews/${reviewId}`);
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to delete review"));
  }
};

export const deleteAdminReviewsBulk = async (reviewIds = []) => {
  try {
    const res = await api.delete("/admin/reviews", { data: { reviewIds } });
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to delete selected reviews"));
  }
};
