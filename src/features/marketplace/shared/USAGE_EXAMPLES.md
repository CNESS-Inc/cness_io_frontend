# Marketplace Route Management - Usage Examples

Complete guide on how to use the route management system.

## Table of Contents
- [Quick Start](#quick-start)
- [Route Constants](#route-constants)
- [Navigation Hook](#navigation-hook)
- [Link Component](#link-component)
- [Helper Functions](#helper-functions)
- [Real-World Examples](#real-world-examples)

---

## Quick Start

### Installation (already done!)
All files are created in: `src/features/marketplace/shared/`

### Import Everything You Need
```typescript
import {
  BUYER_ROUTES,
  SELLER_ROUTES,
  useMarketplaceNavigation,
  MarketplaceLink,
  isBuyerRoute,
} from '@/features/marketplace/shared';
```

---

## Route Constants

### Static Routes
```typescript
import { BUYER_ROUTES, SELLER_ROUTES } from '@/features/marketplace/shared';

// Buyer routes
BUYER_ROUTES.HOME           // "/dashboard/new-marketplace"
BUYER_ROUTES.PRODUCTS       // "/dashboard/new-marketplace/products"
BUYER_ROUTES.CART           // "/dashboard/new-marketplace/cart"
BUYER_ROUTES.CHECKOUT       // "/dashboard/new-marketplace/checkout"
BUYER_ROUTES.ORDERS         // "/dashboard/new-marketplace/orders"

// Seller routes
SELLER_ROUTES.DASHBOARD     // "/dashboard/new-marketplace/seller"
SELLER_ROUTES.PRODUCTS      // "/dashboard/new-marketplace/seller/products"
SELLER_ROUTES.ADD_PRODUCT   // "/dashboard/new-marketplace/seller/add-product"
```

### Dynamic Routes (with parameters)
```typescript
// Generate dynamic URLs
BUYER_ROUTES.PRODUCT_DETAIL('123')    // "/dashboard/new-marketplace/product/123"
BUYER_ROUTES.ORDER_DETAIL('order-456') // "/dashboard/new-marketplace/orders/order-456"
BUYER_ROUTES.CATEGORY('electronics')   // "/dashboard/new-marketplace/category/electronics"

SELLER_ROUTES.EDIT_PRODUCT('prod-789') // "/dashboard/new-marketplace/seller/edit-product/prod-789"
SELLER_ROUTES.ORDER_DETAIL('ord-001')  // "/dashboard/new-marketplace/seller/orders/ord-001"
```

---

## Navigation Hook

### Basic Usage
```typescript
import { useMarketplaceNavigation } from '@/features/marketplace/shared';

function MyComponent() {
  const { goToProducts, goToCart, goToProductDetail } = useMarketplaceNavigation();

  return (
    <div>
      <button onClick={goToProducts}>View Products</button>
      <button onClick={goToCart}>Go to Cart</button>
      <button onClick={() => goToProductDetail('123')}>View Product 123</button>
    </div>
  );
}
```

### After API Calls
```typescript
function AddToCartButton({ productId }) {
  const { goToCart } = useMarketplaceNavigation();

  const handleAddToCart = async () => {
    try {
      await addToCartAPI(productId);
      goToCart(); // Navigate after success
    } catch (error) {
      console.error('Failed to add to cart');
    }
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

### With Navigation Options
```typescript
function CheckoutSuccess() {
  const { goToOrders } = useMarketplaceNavigation();

  useEffect(() => {
    // Replace current history entry (can't go back to checkout)
    goToOrders({ replace: true });
  }, []);

  return <div>Processing...</div>;
}
```

### Using Utility Functions
```typescript
function ProductPage() {
  const { goBack, currentPath } = useMarketplaceNavigation();

  return (
    <div>
      <button onClick={goBack}>← Back</button>
      <p>Current path: {currentPath}</p>
    </div>
  );
}
```

---

## Link Component

### Basic Link (Static Route)
```typescript
import { MarketplaceLink } from '@/features/marketplace/shared';
import { BUYER_ROUTES } from '@/features/marketplace/shared';

<MarketplaceLink to={BUYER_ROUTES.HOME}>
  Go to Home
</MarketplaceLink>

<MarketplaceLink to={BUYER_ROUTES.PRODUCTS} className="nav-link">
  Browse Products
</MarketplaceLink>
```

### Dynamic Route Link
```typescript
// Product Card Component
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <MarketplaceLink
        to={BUYER_ROUTES.PRODUCT_DETAIL}
        params={product.id}
        className="view-details"
      >
        View Details
      </MarketplaceLink>
    </div>
  );
}
```

### Link with State
```typescript
<MarketplaceLink
  to={BUYER_ROUTES.CHECKOUT}
  state={{ fromCart: true }}
>
  Proceed to Checkout
</MarketplaceLink>
```

### Button-Styled Link
```typescript
import { MarketplaceButtonLink } from '@/features/marketplace/shared';

<MarketplaceButtonLink
  to={BUYER_ROUTES.CART}
  variant="primary"
  size="lg"
>
  Go to Cart
</MarketplaceButtonLink>
```

### Open in New Tab
```typescript
<MarketplaceLink
  to={BUYER_ROUTES.PRODUCT_DETAIL}
  params={productId}
  newTab={true}
>
  Open in New Tab
</MarketplaceLink>
```

---

## Helper Functions

### Route Checking
```typescript
import { isBuyerRoute, isSellerRoute, isCheckoutFlow } from '@/features/marketplace/shared';

function Header() {
  const location = useLocation();
  const pathname = location.pathname;

  if (isBuyerRoute(pathname)) {
    return <BuyerHeader />;
  }

  if (isSellerRoute(pathname)) {
    return <SellerHeader />;
  }

  return <DefaultHeader />;
}
```

### Extract Route Parameters
```typescript
import { getProductIdFromPath, getOrderIdFromPath } from '@/features/marketplace/shared';

function useCurrentProductId() {
  const location = useLocation();
  return getProductIdFromPath(location.pathname);
}

// Usage
const productId = useCurrentProductId(); // Returns '123' from '/product/123'
```

### Query Parameters
```typescript
import { buildUrlWithParams, parseQueryParams } from '@/features/marketplace/shared';

// Build URL with filters
const url = buildUrlWithParams(BUYER_ROUTES.PRODUCTS, {
  category: 'electronics',
  minPrice: 100,
  maxPrice: 500,
  sort: 'price-asc'
});
// Result: "/dashboard/new-marketplace/products?category=electronics&minPrice=100&maxPrice=500&sort=price-asc"

// Parse query params
const params = parseQueryParams(location.search);
console.log(params); // { category: 'electronics', minPrice: '100', ... }
```

### Update Query Parameters
```typescript
import { updateQueryParams } from '@/features/marketplace/shared';

function ProductFilters() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryChange = (category) => {
    const newSearch = updateQueryParams(location.search, { category });
    navigate({ search: newSearch });
  };

  return <CategorySelect onChange={handleCategoryChange} />;
}
```

### Breadcrumbs
```typescript
import { generateBreadcrumbs } from '@/features/marketplace/shared';

function Breadcrumbs() {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <nav>
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path}>
          {index > 0 && ' > '}
          <Link to={crumb.path}>{crumb.label}</Link>
        </span>
      ))}
    </nav>
  );
}
```

### Active Route Highlighting
```typescript
import { getActiveRouteKey } from '@/features/marketplace/shared';

function Navigation() {
  const location = useLocation();
  const activeKey = getActiveRouteKey(location.pathname);

  return (
    <nav>
      <a className={activeKey === 'home' ? 'active' : ''} href={BUYER_ROUTES.HOME}>
        Home
      </a>
      <a className={activeKey === 'products' ? 'active' : ''} href={BUYER_ROUTES.PRODUCTS}>
        Products
      </a>
      <a className={activeKey === 'cart' ? 'active' : ''} href={BUYER_ROUTES.CART}>
        Cart
      </a>
    </nav>
  );
}
```

---

## Real-World Examples

### Example 1: Product List Page
```typescript
import { MarketplaceLink } from '@/features/marketplace/shared';
import { BUYER_ROUTES } from '@/features/marketplace/shared';

function ProductList() {
  const products = useProducts();

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>

          <MarketplaceLink
            to={BUYER_ROUTES.PRODUCT_DETAIL}
            params={product.id}
            className="btn-primary"
          >
            View Details
          </MarketplaceLink>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Add to Cart Flow
```typescript
import { useMarketplaceNavigation } from '@/features/marketplace/shared';

function ProductDetail({ productId }) {
  const { goToCart, goBack } = useMarketplaceNavigation();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCartAPI(productId);
      toast.success('Added to cart!');
      goToCart(); // Navigate to cart
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={goBack}>← Back</button>
      <ProductInfo productId={productId} />
      <button onClick={handleAddToCart} disabled={loading}>
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### Example 3: Seller Product Management
```typescript
import { useMarketplaceNavigation } from '@/features/marketplace/shared';
import { SELLER_ROUTES } from '@/features/marketplace/shared';

function SellerProductList() {
  const { goToAddProduct, goToEditProduct } = useMarketplaceNavigation();
  const products = useSellerProducts();

  return (
    <div>
      <button onClick={goToAddProduct}>+ Add New Product</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => goToEditProduct(product.id)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Example 4: Conditional Navigation Bar
```typescript
import { isBuyerRoute, isSellerRoute } from '@/features/marketplace/shared';
import { BUYER_ROUTES, SELLER_ROUTES } from '@/features/marketplace/shared';

function MarketplaceNav() {
  const location = useLocation();
  const pathname = location.pathname;

  if (isBuyerRoute(pathname)) {
    return (
      <nav className="buyer-nav">
        <Link to={BUYER_ROUTES.HOME}>Home</Link>
        <Link to={BUYER_ROUTES.PRODUCTS}>Products</Link>
        <Link to={BUYER_ROUTES.CART}>Cart</Link>
        <Link to={BUYER_ROUTES.ORDERS}>My Orders</Link>
      </nav>
    );
  }

  if (isSellerRoute(pathname)) {
    return (
      <nav className="seller-nav">
        <Link to={SELLER_ROUTES.DASHBOARD}>Dashboard</Link>
        <Link to={SELLER_ROUTES.PRODUCTS}>My Products</Link>
        <Link to={SELLER_ROUTES.ORDERS}>Orders</Link>
        <Link to={SELLER_ROUTES.ANALYTICS}>Analytics</Link>
      </nav>
    );
  }

  return null;
}
```

### Example 5: Search with Query Params
```typescript
import { buildUrlWithParams, parseQueryParams } from '@/features/marketplace/shared';
import { BUYER_ROUTES } from '@/features/marketplace/shared';

function ProductSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = parseQueryParams(location.search);

  const handleSearch = (filters) => {
    const url = buildUrlWithParams(BUYER_ROUTES.PRODUCTS, {
      search: filters.query,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
    });

    navigate(url);
  };

  return (
    <SearchForm
      onSearch={handleSearch}
      initialValues={queryParams}
    />
  );
}
```

---

## Best Practices

### ✅ DO:
- Use route constants everywhere
- Use navigation hook for programmatic navigation
- Use MarketplaceLink for JSX links
- Extract route logic into helper functions

### ❌ DON'T:
- Hardcode routes: `<Link to="/dashboard/new-marketplace/product/123">`
- Use string concatenation: `navigate(\`/product/${id}\`)`
- Mix route definitions across files
- Forget to update ROUTE_PATTERNS when changing routes

---

## Need to Change a Route?

### Scenario: Rename `/new-marketplace` to `/marketplace`

**Step 1:** Update ONE line in `routes.ts`
```typescript
// Before
const MARKETPLACE_BASE = `${DASHBOARD_BASE}/new-marketplace`;

// After
const MARKETPLACE_BASE = `${DASHBOARD_BASE}/marketplace`;
```

**Step 2:** Done! All routes automatically update everywhere.

---

## Questions?

If you need help or have questions about the route system, check:
- This file for examples
- `routes.ts` for available routes
- `routeHelpers.ts` for utility functions
