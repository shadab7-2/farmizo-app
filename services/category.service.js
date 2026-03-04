import { fetchFromAPI } from "@/utils/apiResponce";

export const fetchCategories = async () => {
  return await fetchFromAPI("categories");
};

export const fetchCategoryBySlug = async (slug) => {
  return await fetchFromAPI(`categories/${slug}`);
};
