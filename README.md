# Challenge: Sneaker-Store
Practice frontend development with Reactjs
Manage complex state for products, users, orders, and wishlist Implement key features: Featured Products, New Arrivals, Shop by Category, User Account, Wishlist
Focus on a modern, responsive UI that delivers a real sneaker shopping experience

## Description:
Build a modern e-commerce web application for showcasing sneakers.
The UI provides functionalities to browse products, view product details, search and filter items, manage wishlist, and handle. shopping cart operations. The design is responsive, user-friendly, and optimized for both desktop and mobile devices.

### 1. Home Page
- GET /products?featured=true → Get featured products  
- GET /products/new/arrivals → Get new arrival products  
---
### 2. Product Page
- GET /products → Get all products  
- GET /products?brand=Nike → Filter by brand  
- GET /products?category=Running → Filter by category  
- GET /products?gender=Men | Women → Filter by gender  
- GET /products?minPrice=180&maxPrice=500 → Filter by price range  
- GET /products?size=6 → Filter by size  
- GET /products?featured=true → Get featured products  
- GET /products?search=Yeezy → Search products  
---
### 3. Product Detail Page
- GET /product/{productId} → Get product details  
- POST /cart → Add product to cart  
- POST /wishlist/item/{productId} → Add product to wishlist 
---
### 4. Wishlist Page
- GET /wishlist → Get wishlist items  
- POST /wishlist/item/{productId} → Add product to wishlist  
- DELETE /wishlist/item/{productId} → Remove one item from wishlist  
- DELETE /wishlist → Clear all wishlist items 
---
### 5. Cart Page
- GET /cart → Get cart items  
- POST /cart/items → Add product to cart  
- PUT /cart/item/{itemId} → Update product quantity  
- DELETE /cart/item/{itemId} → Remove one item from cart  
- DELETE /cart → Clear all cart items  
---
### 6. Signup Page
- POST /auth/signup → Register new account  
---
### 7. Login Page
- POST /auth/login → User login  

#### Technical Requirements:
- React.js + TypeScript (UI development)
- Zustand for state management
- React Router v6 for client-side routing
- TailwindCSS for styling (kết hợp tailwind-merge, class-variance-authority để tối ưu class)
- Radix UI components (Alert Dialog, Select, Slider, Slot…)
- Lucide React for icons
- Sonner for toast notifications
- Axios for API requests
- json-server hoặc mock API service để mô phỏng backend
