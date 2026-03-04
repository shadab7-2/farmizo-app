"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    api
      .get("/admin/products")
      .then((res) => {
        setProducts(Array.isArray(res?.data?.data) ? res.data.data : []);
      })
      .catch(() => {
        setProducts([]);
      });
  }, [refreshTick]);

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await api.delete(`/admin/products/${id}`);
    setRefreshTick((value) => value + 1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-6 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-500">
                ₹{product.price}
              </p>
            </div>

            <div className="flex gap-4">
              <button className="text-blue-600">
                Edit
              </button>

              <button
                onClick={() =>
                  deleteProduct(product._id)
                }
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
