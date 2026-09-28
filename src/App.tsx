import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Spinner } from "./components/common/Spinner";

const ProductListPage = lazy(() =>
  import("./pages/ProductListPage").then((m) => ({ default: m.ProductListPage }))
);

const ProductDetailsPage = lazy(() =>
  import("./pages/ProductDetailsPage").then((m) => ({
    default: m.ProductDetailsPage,
  }))
);

const AddProductPage = lazy(() =>
  import("./pages/AddProductPage").then((m) => ({ default: m.AddProductPage }))
);

function PageFallback() {
  return (
    <div className="flex justify-center py-24">
      <Spinner />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/add" element={<AddProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}