Limefashion — Product Management Dashboard
A responsive product management dashboard built with React, TypeScript, Vite, and Tailwind CSS. It uses the DummyJSON Products API to browse, search, filter, sort, view, favourite, and add products.

Live Demo: https://limefashion.vercel.app/products

Features
Product listing with search, filter, and sorting

Product details page

Add new products with form validation

Favourite products with localStorage persistence

Pagination

Loading, error, and empty states

Responsive design (360px to desktop)

Accessible UI

URL-synchronised filters

Tech Stack
React + Vite + TypeScript

React Router

Tailwind CSS

Zustand

TanStack Query

React Hook Form + Zod

Lucide React

State Management
Zustand was chosen over Context API or Redux Toolkit because:

Filters, search, sorting, and pagination are shared across multiple components. Zustand provides selector-based subscriptions.

Redux Toolkit would add more boilerplate than needed for this project.

Zustand's persist middleware makes it simple to save favourites in localStorage.

Global state: filters, search, sorting, pagination, favourite IDs, toast queue, and locally added products.

Local state: form fields, image preview errors, and toast timers.

API
Uses the DummyJSON Products API.

GET /products?limit=100 — Get products

GET /products/:id — Get product details

POST /products/add — Add product

GET /products/category-list — Get categories

DummyJSON does not permanently save POST requests, so newly added products are stored locally in Zustand state.

Filtering, sorting, and pagination are handled client-side after fetching the products.

Performance Optimisations
Route-based code splitting — Main pages are lazy-loaded using React.lazy and Suspense.

Debounced search — Search is delayed by 300ms to avoid filtering on every keystroke.

Memoisation — useMemo prevents unnecessary recalculation of filtered, sorted, and paginated products.

Optimised images — Images use lazy loading, async decoding, and fixed dimensions.

Zustand selectors — Components subscribe only to the state they need.

Getting Started
bash
git clone https://github.com/YOUR_USERNAME/limefashion.git
cd limefashion
npm install
npm run dev
Open http://localhost:5173

Production Build
bash
npm run build
npm run preview
Project Structure
text
src/
├── components/    # UI components
├── hooks/         # Custom hooks
├── layouts/       # Application layout
├── pages/         # Application pages
├── services/      # API services
├── store/         # Zustand stores
├── types/         # TypeScript types
└── utils/         # Utility functions
Known Limitations
Newly added products are stored locally and reset after a hard refresh.

Client-side filtering is suitable for the current catalogue size.

Authentication is not included because it was not required.

