import type {
  AddProductInput,
  Product,
  ProductsResponse,
} from "../types/product";

const BASE_URL = "https://dummyjson.com";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getProducts(limit = 100): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products?limit=${limit}`);
  return handleResponse<ProductsResponse>(res);
}

export async function getProductById(id: string | number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse<Product>(res);
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/category-list`);
  return handleResponse<string[]>(res);
}

export async function addProduct(data: AddProductInput): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const created = await handleResponse<Product>(res);

  // DummyJSON's /add endpoint doesn't return a full product.
  // Sanitize so UI never receives undefined for required display fields.
  return {
    ...created,
    rating: typeof created.rating === "number" ? created.rating : 0,
    discountPercentage:
      typeof created.discountPercentage === "number"
        ? created.discountPercentage
        : 0,
    images: Array.isArray(created.images)
      ? created.images
      : [created.thumbnail ?? data.thumbnail],
    description: created.description ?? data.description,
    category: created.category ?? data.category,
    brand: created.brand ?? data.brand,
    thumbnail: created.thumbnail ?? data.thumbnail,
  };
}