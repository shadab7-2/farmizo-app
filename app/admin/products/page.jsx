"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  addAdminProduct,
  editAdminProduct,
  loadAdminProducts,
  removeAdminProduct,
  clearProductError,
} from "@/store/slices/productSlice";
import { fetchCategories } from "@/services/category.service";
import styles from "./ProductPage.module.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  stock: "0",
  isActive: true,
};

const toCreateFormData = (form, files = []) => {
  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("price", String(form.price));
  formData.append("categoryId", form.categoryId);
  formData.append("stock", String(form.stock || 0));
  formData.append("isActive", String(Boolean(form.isActive)));

  files.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
};

const toEditFormData = (form, product, files = []) => {
  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("price", String(form.price));
  formData.append("categoryId", form.categoryId);
  formData.append("stock", String(form.stock || 0));
  formData.append("isActive", String(Boolean(form.isActive)));

  const existingImages = Array.isArray(product?.images) ? product.images : [];
  const existingImagePublicIds = Array.isArray(product?.imagePublicIds)
    ? product.imagePublicIds
    : [];

  formData.append("existingImages", JSON.stringify(existingImages));
  formData.append("existingImagePublicIds", JSON.stringify(existingImagePublicIds));

  files.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
};

const revokePreviewUrls = (urls = []) => {
  urls.forEach((url) => {
    if (typeof url === "string" && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
};

const resolveCategoryId = (product, categories = []) => {
  const fromProduct = product?.categoryId?._id || product?.categoryId || "";
  if (fromProduct && typeof fromProduct === "string") return fromProduct;

  const slugOrName =
    product?.categorySlug || product?.categoryName || product?.category || "";

  if (!slugOrName) return "";

  const matched = categories.find(
    (item) => item.slug === slugOrName || item.name === slugOrName,
  );

  return matched?._id || "";
};

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const { items: products, loading, actionLoading, error } = useSelector(
    (state) => state.products,
  );

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [createForm, setCreateForm] = useState(emptyForm);
  const [createFiles, setCreateFiles] = useState([]);
  const [createPreviews, setCreatePreviews] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editFiles, setEditFiles] = useState([]);
  const [editPreviews, setEditPreviews] = useState([]);

  useEffect(() => {
    dispatch(loadAdminProducts());

    const loadCategoryOptions = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategoryOptions();

    return () => {
      dispatch(clearProductError());
    };
  }, [dispatch]);

  useEffect(() => {
    return () => {
      revokePreviewUrls(createPreviews);
    };
  }, [createPreviews]);

  useEffect(() => {
    return () => {
      revokePreviewUrls(editPreviews);
    };
  }, [editPreviews]);

  const isEditOpen = useMemo(() => Boolean(editingProduct), [editingProduct]);

  const onCreateImagesChange = (event) => {
    const files = Array.from(event.target.files || []);

    revokePreviewUrls(createPreviews);

    setCreateFiles(files);
    setCreatePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const onEditImagesChange = (event) => {
    const files = Array.from(event.target.files || []);

    revokePreviewUrls(editPreviews);

    setEditFiles(files);
    setEditPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const onCreateSubmit = async (e) => {
    e.preventDefault();

    const payload = toCreateFormData(createForm, createFiles);
    const result = await dispatch(addAdminProduct(payload));

    if (addAdminProduct.fulfilled.match(result)) {
      setCreateForm(emptyForm);
      setCreateFiles([]);
      revokePreviewUrls(createPreviews);
      setCreatePreviews([]);
    }
  };

  const openEditModal = (product) => {
    revokePreviewUrls(editPreviews);
    setEditFiles([]);
    setEditPreviews([]);

    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      categoryId: resolveCategoryId(product, categories),
      stock: String(product.stock ?? 0),
      isActive: Boolean(product.isActive),
    });
  };

  const closeEditModal = () => {
    revokePreviewUrls(editPreviews);
    setEditingProduct(null);
    setEditForm(emptyForm);
    setEditFiles([]);
    setEditPreviews([]);
  };

  const onEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct?._id) return;

    const payload = toEditFormData(editForm, editingProduct, editFiles);

    const result = await dispatch(
      editAdminProduct({
        id: editingProduct._id,
        data: payload,
      }),
    );

    if (editAdminProduct.fulfilled.match(result)) {
      closeEditModal();
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this product? This will also delete images.")) return;
    await dispatch(removeAdminProduct(id));
  };

  const onToggleActive = async (product) => {
    const payload = new FormData();
    payload.append("isActive", String(!product.isActive));

    await dispatch(
      editAdminProduct({
        id: product._id,
        data: payload,
      }),
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Products</p>
          <h1 className={styles.title}>All Products</h1>
          <p className={styles.subtitle}>
            Manage catalog, pricing, inventory, and status in one streamlined view.
          </p>
        </div>
        <div className={styles.statusPill}>
          {products.length} items • {categories.length} categories
        </div>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.kicker}>Create Product</p>
            <h2 className={styles.sectionTitle}>Add a new item</h2>
          </div>
          <div className={styles.badgeAccent}>Instant publish</div>
        </div>

        <form onSubmit={onCreateSubmit} className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              placeholder="Organic fertilizer pack"
              value={createForm.name}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.input}
              value={createForm.categoryId}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              required
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? "Loading categories..." : "Select category"}
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Price</label>
            <input
              className={styles.input}
              placeholder="499"
              type="number"
              min="0"
              step="0.01"
              value={createForm.price}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Stock</label>
            <input
              className={styles.input}
              placeholder="150"
              type="number"
              min="0"
              value={createForm.stock}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, stock: e.target.value }))}
            />
          </div>

          <div className={styles.inputGroupFull}>
            <label className={styles.label}>Product Images</label>
            <label className={styles.fileUpload}>
              <span className={styles.fileIcon}>📁</span>
              <span>
                <strong>Upload</strong> or drag & drop
                <span className={styles.fileHint}> PNG, JPG up to 5MB each </span>
              </span>
              <input
                className={styles.fileInput}
                type="file"
                accept="image/*"
                multiple
                onChange={onCreateImagesChange}
              />
            </label>

            {createPreviews.length > 0 && (
              <div className={styles.previewGrid}>
                {createPreviews.map((src) => (
                  <div key={src} className={styles.previewItem}>
                    <Image
                      src={src}
                      alt="Preview"
                      width={96}
                      height={80}
                      unoptimized
                      className={styles.previewImage}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.inputGroupFull}>
            <label className={styles.label}>Description</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Add details that help merchants and customers understand the product."
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              required
            />
          </div>

          <div className={styles.switchRow}>
            <div className={styles.switchLabel}>
              <p className={styles.label}>Active Product</p>
              <p className={styles.helper}>Visible to shoppers immediately.</p>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={createForm.isActive}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" disabled={actionLoading} className={styles.primaryButton}>
              {actionLoading ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.kicker}>Product List</p>
            <h2 className={styles.sectionTitle}>Catalog overview</h2>
          </div>
          <div className={styles.badgeMuted}>{loading ? "Syncing..." : "Up to date"}</div>
        </div>

        {loading ? (
          <div className={styles.skeletonGrid}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.skeletonCard}>
                <div className={styles.skeletonThumb} />
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonLineWide} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonBadgeRow}>
                    <div className={styles.skeletonBadge} />
                    <div className={styles.skeletonBadge} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => {
              const displayImage =
                Array.isArray(product.images) && product.images.length > 0
                  ? product.images[0]
                  : null;

              return (
                <article key={product._id} className={styles.productCard}>
                  <div className={styles.productMedia}>
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt={product.name}
                        width={72}
                        height={72}
                        unoptimized
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>🌱</div>
                    )}
                  </div>

                  <div className={styles.productInfo}>
                    <div className={styles.productTitleRow}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <span className={styles.priceTag}>₹{product.price}</span>
                    </div>
                    <p className={styles.productMeta}>
                      {product.categoryName || product.categoryId?.name || product.category || "Uncategorized"}
                    </p>
                    <div className={styles.badgeRow}>
                      <span className={styles.stockBadge}>
                        Stock: {product.stock ?? 0}
                      </span>
                      <span
                        className={
                          product.isActive ? styles.activeBadge : styles.inactiveBadge
                        }
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {Array.isArray(product.images) && product.images.length > 1 && (
                      <div className={styles.thumbRow}>
                        {product.images.slice(1, 5).map((src) => (
                          <Image
                            key={src}
                            src={src}
                            alt={product.name}
                            width={40}
                            height={40}
                            unoptimized
                            className={styles.thumbImage}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.productActions}>
                    <button
                      onClick={() => onToggleActive(product)}
                      className={styles.iconButton}
                      disabled={actionLoading}
                      aria-label={product.isActive ? "Disable product" : "Enable product"}
                      title={product.isActive ? "Disable" : "Enable"}
                    >
                      ⚡
                    </button>

                    <button
                      onClick={() => openEditModal(product)}
                      className={styles.iconButton}
                      disabled={actionLoading}
                      aria-label="Edit product"
                      title="Edit"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => onDelete(product._id)}
                      className={`${styles.iconButton} ${styles.danger}`}
                      disabled={actionLoading}
                      aria-label="Delete product"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </article>
              );
            })}

            {!products.length && (
              <div className={styles.emptyState}>No products yet 🌱</div>
            )}
          </div>
        )}
      </section>

      {isEditOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.kicker}>Edit Product</p>
                <h2 className={styles.sectionTitle}>Update details</h2>
              </div>
              <button onClick={closeEditModal} className={styles.closeButton}>
                ✕
              </button>
            </div>

            <form onSubmit={onEditSubmit} className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Name</label>
                <input
                  className={styles.input}
                  placeholder="Product name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.input}
                  value={editForm.categoryId}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? "Loading categories..." : "Select category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Price</label>
                <input
                  className={styles.input}
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Stock</label>
                <input
                  className={styles.input}
                  placeholder="0"
                  type="number"
                  min="0"
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, stock: e.target.value }))
                  }
                />
              </div>

              <div className={styles.inputGroupFull}>
                <label className={styles.label}>Replace Images</label>
                <label className={styles.fileUpload}>
                  <span className={styles.fileIcon}>📁</span>
                  <span>
                    <strong>Upload</strong> new gallery
                    <span className={styles.fileHint}> Replaces existing images </span>
                  </span>
                  <input
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onEditImagesChange}
                  />
                </label>

                {Array.isArray(editingProduct?.images) &&
                  editingProduct.images.length > 0 &&
                  editPreviews.length === 0 && (
                    <div className={styles.previewGrid}>
                      {editingProduct.images.map((src) => (
                        <div key={src} className={styles.previewItem}>
                          <Image
                            src={src}
                            alt="Current"
                            width={96}
                            height={80}
                            unoptimized
                            className={styles.previewImage}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                {editPreviews.length > 0 && (
                  <div className={styles.previewGrid}>
                    {editPreviews.map((src) => (
                      <div key={src} className={styles.previewItem}>
                        <Image
                          src={src}
                          alt="Preview"
                          width={96}
                          height={80}
                          unoptimized
                          className={styles.previewImage}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.inputGroupFull}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Describe the product, materials, and key selling points."
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  required
                />
              </div>

              <div className={styles.switchRow}>
                <div className={styles.switchLabel}>
                  <p className={styles.label}>Active Product</p>
                  <p className={styles.helper}>Toggle availability instantly.</p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={closeEditModal}
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
