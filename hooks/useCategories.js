import { useEffect, useState } from "react";
import { fetchCategories } from "@/services/category.service";

export default function useCategories() {
  const [categories, setCategories] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data =
          await fetchCategories();

        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return {
    categories,
    loading,
    error,
  };
}
