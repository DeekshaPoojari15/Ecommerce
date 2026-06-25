import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Users from "../pages/Users";
 import  "../AdminPage.css";

const AdminPage = () => {
  return (
    <div className="admin-container">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <div className="admin-content">

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
          </Routes>

        </div>

      </div>

    </div>
  );
};

export default AdminPage;