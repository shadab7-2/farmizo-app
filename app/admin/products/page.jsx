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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">All Products</h1>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={onCreateSubmit}
        className="grid gap-3 rounded bg-white p-4 shadow md:grid-cols-2"
      >
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={createForm.name}
          onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />

        <select
          className="border p-2 rounded"
          value={createForm.categoryId}
          onChange={(e) =>
            setCreateForm((prev) => ({ ...prev, categoryId: e.target.value }))
          }
          required
          disabled={categoriesLoading}
        >
          <option value="">{categoriesLoading ? "Loading categories..." : "Select category"}</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          placeholder="Price"
          type="number"
          min="0"
          step="0.01"
          value={createForm.price}
          onChange={(e) => setCreateForm((prev) => ({ ...prev, price: e.target.value }))}
          required
        />

        <input
          className="border p-2 rounded"
          placeholder="Stock"
          type="number"
          min="0"
          value={createForm.stock}
          onChange={(e) => setCreateForm((prev) => ({ ...prev, stock: e.target.value }))}
        />

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Product Images</label>
          <input
            className="border p-2 rounded w-full"
            type="file"
            accept="image/*"
            multiple
            onChange={onCreateImagesChange}
          />

          {createPreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
              {createPreviews.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt="Preview"
                  width={96}
                  height={80}
                  unoptimized
                  className="h-20 w-full rounded border object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <textarea
          className="border p-2 rounded md:col-span-2"
          placeholder="Description"
          value={createForm.description}
          onChange={(e) =>
            setCreateForm((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          required
        />

        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={createForm.isActive}
            onChange={(e) =>
              setCreateForm((prev) => ({ ...prev, isActive: e.target.checked }))
            }
          />
          Active Product
        </label>

        <button
          type="submit"
          disabled={actionLoading}
          className="w-fit rounded bg-green-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {actionLoading ? "Saving..." : "Create Product"}
        </button>
      </form>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-6 rounded shadow flex flex-col gap-4 md:flex-row md:justify-between md:items-center"
            >
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">₹{product.price}</p>
                <p className="text-xs text-gray-500">
                  {product.categoryName || product.categoryId?.name || product.category} | Stock: {product.stock} | {product.isActive ? "Active" : "Inactive"}
                </p>

                {Array.isArray(product.images) && product.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.images.slice(0, 4).map((src) => (
                      <Image
                        key={src}
                        src={src}
                        alt={product.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="h-12 w-12 rounded border object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => onToggleActive(product)}
                  className={product.isActive ? "text-orange-600" : "text-green-600"}
                  disabled={actionLoading}
                >
                  {product.isActive ? "Disable" : "Enable"}
                </button>

                <button
                  onClick={() => openEditModal(product)}
                  className="text-blue-600"
                  disabled={actionLoading}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(product._id)}
                  className="text-red-600"
                  disabled={actionLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!products.length && <p className="text-gray-500">No products found.</p>}
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Product</h2>
              <button onClick={closeEditModal} className="text-gray-500">
                Close
              </button>
            </div>

            <form onSubmit={onEditSubmit} className="grid gap-3 md:grid-cols-2">
              <input
                className="border p-2 rounded"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />

              <select
                className="border p-2 rounded"
                value={editForm.categoryId}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, categoryId: e.target.value }))
                }
                required
                disabled={categoriesLoading}
              >
                <option value="">{categoriesLoading ? "Loading categories..." : "Select category"}</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                className="border p-2 rounded"
                placeholder="Price"
                type="number"
                min="0"
                step="0.01"
                value={editForm.price}
                onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                required
              />

              <input
                className="border p-2 rounded"
                placeholder="Stock"
                type="number"
                min="0"
                value={editForm.stock}
                onChange={(e) => setEditForm((prev) => ({ ...prev, stock: e.target.value }))}
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Replace Images</label>
                <input
                  className="border p-2 rounded w-full"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onEditImagesChange}
                />

                {Array.isArray(editingProduct?.images) && editingProduct.images.length > 0 && editPreviews.length === 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
                    {editingProduct.images.map((src) => (
                      <Image
                        key={src}
                        src={src}
                        alt="Current"
                        width={96}
                        height={80}
                        unoptimized
                        className="h-20 w-full rounded border object-cover"
                      />
                    ))}
                  </div>
                )}

                {editPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
                    {editPreviews.map((src) => (
                      <Image
                        key={src}
                        src={src}
                        alt="Preview"
                        width={96}
                        height={80}
                        unoptimized
                        className="h-20 w-full rounded border object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>

              <textarea
                className="border p-2 rounded md:col-span-2"
                placeholder="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                required
              />

              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
                Active Product
              </label>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded border px-4 py-2"
                  onClick={closeEditModal}
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
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
