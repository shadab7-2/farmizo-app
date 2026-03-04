import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/product.service";

export default function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const data = await fetchProducts(params);

        setProducts(Array.isArray(data)? data : []);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [JSON.stringify(params)]);

  return {
    products,
    loading,
    error,
  };
}
