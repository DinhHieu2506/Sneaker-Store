import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import Footer from "./components/layouts/Footer";
import Header from "./components/layouts/Header";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CartPage from "./pages/cart/CartPage";
import Home from "./pages/homes/HomePage";
import ProductDetail from "./pages/products/ProductDetail";
import Products from "./pages/products/ProductPage";
import WishlistPage from "./pages/wishlist/WishlistPage";

import { Toaster } from "sonner";
import ScrollToTop from "./components/layouts/ScrollToTop";

function App() {
  return (
    <Router>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage/>}/>
      </Routes>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </Router>
  );
}

export default App;
