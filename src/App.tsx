import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./pages/homes/page";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import CartPage from "./pages/cart/cartpage";
import Products from "./pages/products/index";
import WishlistPage from "./pages/wishlist/wishlistpage";
import ProductDetail from "./pages/products/product-detail";

import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage></CartPage>}></Route>
      </Routes>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </Router>
  );
}

export default App;
