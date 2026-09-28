import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, ImageIcon, Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../services/productApi";
import { useFilterStore } from "../store/useFilterStore";
import { useToastStore } from "../store/useToastStore";
import type { AddProductInput, Product } from "../types/product";

const SAMPLE_IMAGE =
  "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z
    .number({ message: "Price is required" })
    .positive("Price must be greater than 0"),
  stock: z
    .number({ message: "Stock is required" })
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative"),
  brand: z.string().min(1, "Brand is required"),
  thumbnail: z
    .string()
    .url("Must be a valid URL (starting with http:// or https://)"),
});

type FormValues = z.infer<typeof schema>;

export function AddProductPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addProductLocally = useFilterStore((s) => s.addProductLocally);
  const pushToast = useToastStore((s) => s.push);
  const [previewError, setPreviewError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      brand: "",
      thumbnail: "",
    },
  });

  const thumbnailValue = watch("thumbnail");

  const mutation = useMutation<Product, Error, AddProductInput>({
    mutationFn: addProduct,
    onSuccess: (created) => {
      addProductLocally(created);
      pushToast("success", "Product added", `"${created.title}" was added.`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
      navigate("/products");
    },
    onError: (err) => pushToast("error", "Failed to add product", err.message),
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);
  const isBusy = isSubmitting || mutation.isPending;
  const hasValidPreview = !!(thumbnailValue && !previewError);

  return (
    <div className="mx-auto max-w-2xl py-10 px-4 sm:px-6">
      {/* Back button - Restored to a proper button style */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to products
      </button>

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
          <Plus className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Add new product
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to add a product to your catalogue.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      >
        <div className="divide-y divide-slate-100">
          {/* ── Section 1 — Basic info ── */}
          <div className="p-6 sm:p-8 space-y-5">
            <SectionLabel number={1} title="Basic information" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Product name" error={errors.title?.message} id="title" required>
                  <input
                    id="title"
                    type="text"
                    {...register("title")}
                    className="input-field"
                    placeholder="e.g. Essence Mascara Lash Princess"
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Description" error={errors.description?.message} id="description" required>
                  <textarea
                    id="description"
                    rows={3}
                    {...register("description")}
                    className="input-field resize-none"
                    placeholder="Short description of the product"
                  />
                </Field>
              </div>

              <Field label="Category" error={errors.category?.message} id="category" required>
                <input
                  id="category"
                  type="text"
                  {...register("category")}
                  className="input-field"
                  placeholder="beauty"
                />
              </Field>

              <Field label="Brand" error={errors.brand?.message} id="brand" required>
                <input
                  id="brand"
                  type="text"
                  {...register("brand")}
                  className="input-field"
                  placeholder="Essence"
                />
              </Field>
            </div>
          </div>

          {/* ── Section 2 — Pricing ── */}
          <div className="p-6 sm:p-8 space-y-5">
            <SectionLabel number={2} title="Pricing & inventory" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Price (USD)" error={errors.price?.message} id="price" required>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                    $
                  </span>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("price", { valueAsNumber: true })}
                    className="input-field pl-8"
                    placeholder="0.00"
                  />
                </div>
              </Field>

              <Field label="Stock quantity" error={errors.stock?.message} id="stock" required>
                <input
                  id="stock"
                  type="number"
                  step="1"
                  min="0"
                  {...register("stock", { valueAsNumber: true })}
                  className="input-field"
                  placeholder="0"
                />
              </Field>
            </div>
          </div>

          {/* ── Section 3 — Image ── */}
          <div className="p-6 sm:p-8 space-y-5">
            <SectionLabel number={3} title="Product image" />

            <div className="space-y-4">
              <Field label="Image URL" error={errors.thumbnail?.message} id="thumbnail" required>
                <div className="relative">
                  <input
                    id="thumbnail"
                    type="url"
                    {...register("thumbnail", { onChange: () => setPreviewError(false) })}
                    className="input-field pr-10"
                    placeholder="https://example.com/image.jpg"
                  />
                  {thumbnailValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setValue("thumbnail", "", { shouldValidate: true });
                        setPreviewError(false);
                      }}
                      aria-label="Clear image URL"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </Field>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-xs text-slate-500">
                  Right-click any image online → <span className="font-medium text-slate-600">Copy image address</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setValue("thumbnail", SAMPLE_IMAGE, { shouldValidate: true });
                    setPreviewError(false);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Use sample image
                </button>
              </div>

              {/* Preview Box */}
              <div className="mt-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                {hasValidPreview ? (
                  <img
                    src={thumbnailValue}
                    alt="Product preview"
                    onError={() => setPreviewError(true)}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-slate-300" aria-hidden="true" />
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Image Preview
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse items-stretch gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={() => {
              reset();
              setPreviewError(false);
            }}
            disabled={isBusy}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {isBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {isBusy ? "Adding…" : "Add product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionLabel({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-600">
        {number}
      </span>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  id: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, id, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}