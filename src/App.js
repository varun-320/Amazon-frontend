import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/pages/Navbar";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Services from "./components/pages/Services";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Products from "./components/pages/Products";
import ProductDetail from "./components/pages/ProductDetail";
import ProductForm from "./components/pages/ProductForm";
import Categories from "./components/pages/Categories";
import CategoryForm from "./components/pages/CategoryForm";
import Contact from "./components/pages/Contact";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/Checkout";
import OrderConfirmation from "./components/pages/OrderConfirmation";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import EditProduct from "./components/pages/EditProduct";
import Orders from "./components/pages/Orders";
import Wishlist from "./components/pages/Wishlist";
import OrderSuccess from './components/pages/OrderSuccess';
import AdminOrders from './components/pages/AdminOrders';
import OrderDetails from './components/pages/OrderDetails';
import "./App.css";


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-confirmation"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
              <Route
                path="/products/new"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/edit/:id"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories/new"
                element={
                  <ProtectedRoute>
                    <CategoryForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories/edit/:id"
                element={
                  <ProtectedRoute>
                    <CategoryForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />
              <Route path="/edit-product/:id" element={<EditProduct />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              <Route
                path="/order/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
