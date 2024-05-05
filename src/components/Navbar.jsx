import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api_url from "../apiconfig";
import BackButton from "./BackButton";
import "../styles/navbar.css";

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
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
              onClick={() => handleMenuClick("/student-details")}
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
              onClick={() => handleMenuClick("/view-all-placed-students")}
              style={{ cursor: "pointer" }}
            >
              View Placed Student Details
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
    <nav className="navbar" style={{ backgroundColor: "#1565c0" }}>
      <ul>
        <li className="left-end">
          <BackButton />
        </li>
        {renderMenuItems()}
        <li
          className="logout right-end"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
