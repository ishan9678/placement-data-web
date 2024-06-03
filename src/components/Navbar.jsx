import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api_url from "../apiconfig";
import BackButton from "./BackButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/navbar.css";

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUserRole(data.role);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${api_url}server/process_logout.php`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        console.log("Logout successful");
        navigate("/");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const renderMenuItems = () => {
    switch (userRole) {
      case "Admin":
        return null;
      case "Faculty Advisor":
        return (
          <>
            <li
              onClick={() => handleMenuClick("/view-placed-student-details")}
              style={{ cursor: "pointer" }}
            >
              Placed Student Details
            </li>
            <li
              onClick={() =>
                handleMenuClick("/view-higher-studies-student-details")
              }
              style={{ cursor: "pointer" }}
            >
              Higher Studies Student Details
            </li>
            <li
              onClick={() =>
                handleMenuClick("/view-entrepreneur-student-details")
              }
              style={{ cursor: "pointer" }}
            >
              Entrepreneur Student Details
            </li>
            <li
              onClick={() => handleMenuClick("/fa-consolidated-report")}
              style={{ cursor: "pointer" }}
            >
              View Consolidated Report
            </li>
          </>
        );
      case "Placement Coordinator":
        return (
          <>
            <li
              onClick={() => handleMenuClick("/add-placed-student-details")}
              style={{ cursor: "pointer" }}
            >
              Add Placed Student Details
            </li>
            <li
              onClick={() =>
                handleMenuClick("/view-all-placed-student-details")
              }
              style={{ cursor: "pointer" }}
            >
              View Placed Student Details
            </li>
            <li
              onClick={() => handleMenuClick("/edit-placed-students")}
              style={{ cursor: "pointer" }}
            >
              Edit Placed Students
            </li>
            <li
              onClick={() => handleMenuClick("/consolidated-report")}
              style={{ cursor: "pointer" }}
            >
              View Consolidated Report
            </li>
          </>
        );
      case "HOD":
        return (
          <>
            <li
              onClick={() =>
                handleMenuClick("/view-all-placed-student-details")
              }
              style={{ cursor: "pointer" }}
            >
              View Placed Student Details
            </li>
            <li
              onClick={() => handleMenuClick("/consolidated-report")}
              style={{ cursor: "pointer" }}
            >
              View Consolidated Report
            </li>
          </>
        );
      case "Academic Advisor":
        return (
          <>
            <li
              onClick={() =>
                handleMenuClick("/view-all-placed-student-details")
              }
              style={{ cursor: "pointer" }}
            >
              View Placed Student Details
            </li>
            <li
              onClick={() =>
                handleMenuClick("/academic-search-placed-students")
              }
              style={{ cursor: "pointer" }}
            >
              Search Placed Students
            </li>
            <li
              onClick={() => handleMenuClick("/academic-consolidated-report")}
              style={{ cursor: "pointer" }}
            >
              View Consolidated Report
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <BackButton />
        </div>
        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          <ul className={`menu-items ${menuOpen ? "open" : ""}`}>
            {renderMenuItems()}
            <li
              className="logout"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Logout
            </li>
          </ul>
        </div>
        <div className="navbar-right" style={{ marginRight: "2rem" }}>
          <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
