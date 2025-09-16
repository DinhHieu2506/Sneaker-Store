import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./pages/homes/HomePage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CartPage from "./pages/cart/CartPage";
import Products from "./pages/products/ProductPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import ProductDetail from "./pages/products/ProductDetail";

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
        <Route path="/cart" element={<CartPage/>}/>
      </Routes>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </Router>
  );
}

export default App;
