import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="sidebar">

      <h2>Admin</h2>

      <Link to="/admin">Dashboard</Link>

      <Link to="/admin/products">
        Products
      </Link>

      <Link to="/admin/orders">
        Orders
      </Link>

      <Link to="/admin/users">
        Users
      </Link>

    </div>
  );
};

export default AdminSidebar;