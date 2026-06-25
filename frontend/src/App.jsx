import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartPage from './pages/CartPage/CartPage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import AdminPage from './admin/AdminPage/AdminPage';


const App = () => (
  <Routes>

    {/* Admin Route Outside Layout */}
    <Route
      path="/admin/*"
      element={
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      }
    />

    {/* User Layout Routes */}
    <Route
      path="/*"
      element={
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </Layout>
      }
    />
  </Routes>
);

export default App;
