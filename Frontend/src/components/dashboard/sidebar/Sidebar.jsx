import React, { useState } from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { removeToken } from "../../../services/LocalStorageService";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  let handleSubmitButton = async () => {
    removeToken();
    alert("Logout");
    navigate("/login");
  };

  return (
    <div>
      <div>
        <Link to="/VendorDashboard" className="nav-logo">
          <i className={`fas fa-home-alt nav-logo-icon`}></i>
          <span className="nav-logo-name">Dashboard</span>
        </Link>

        <div className="nav-list">
          <Link to="/VendorDashboard/ProductView" className="nav-link active">
            <i className="fas fa-tachometer-alt nav-link-icon"></i>
            <span className="nav-link-name">Products</span>
          </Link>
          <Link to="/VendorDashboard/AddProduct" className="nav-link">
            <i className="fas fa-hotel nav-link-icon"></i>
            <span className="nav-link-name">Add</span>
          </Link>
        </div>
      </div>

      <Link to="/" onClick={handleSubmitButton} className="nav-link">
        <i className="fas fa-sign-out nav-link-icon"></i>
        <span className="nav-link-name">Logout</span>
      </Link>
    </div>
  );
};

export default Sidebar;
