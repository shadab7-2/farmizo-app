const adminService = require("../services/admin.service");
const productService = require("../services/product.service");

/* ================= DASHBOARD STATS ================= */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query || {};
    const result = await adminService.getCustomers({ page, limit, search });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleCustomerStatus = async (req, res, next) => {
  try {
    const data = await adminService.toggleCustomerStatus(req.params.id);

    res.status(200).json({
      success: true,
      data,
      message: data.isActive ? "Customer enabled" : "Customer disabled",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL PRODUCTS ================= */
exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await productService.getAllAdmin();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= CREATE PRODUCT ================= */
exports.createProductAdmin = async (req, res, next) => {
  try {
    const product = await productService.create(req.body, req.files || []);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE PRODUCT ================= */
exports.updateProductAdmin = async (req, res, next) => {
  try {
    const product = await productService.update(
      req.params.id,
      req.body,
      req.files || [],
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE PRODUCT ================= */
exports.deleteProductAdmin = async (req, res, next) => {
  try {
    await productService.remove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    next(error);
  }
};
