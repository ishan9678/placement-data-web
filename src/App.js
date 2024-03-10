import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import FaHome from "./pages/FaHome";
import PlacedStudents from "./pages/PlacedStudents";
import ViewPlacedStudents from "./pages/ViewPlacedStudents";
import ViewAllPlacedStudents from "./pages/viewAllPlacedStudents";
import StudentDetails from "./pages/StudentDetails";
import ConsolidatedReport from "./pages/ConsolidatedReport";
import PlacementCoordinatorHome from "./pages/PlacementCoordinatorHome";
import HodHome from "./pages/HodHome";
import AcademicAdvisorHome from "./pages/AcademicAdvisorHome";
import ViewBranchPlacedStudents from "./pages/ViewBranchPlacedStudents";
import BranchConsolidatedReport from "./pages/BranchConsolidatedReport";
import api_url from "./apiconfig";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const [userRole, setUserRole] = useState(null);

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

  const renderHomeRoute = () => {
    if (userRole === "Admin") {
      return <AdminDashboard />;
    } else if (userRole === "Faculty Advisor") {
      return <FaHome />;
    } else if (userRole === "Placement Coordinator") {
      return <PlacementCoordinatorHome />;
    } else if (userRole === "HOD") {
      return <HodHome />;
    } else if (userRole === "Academic Advisor") {
      return <AcademicAdvisorHome />;
    }

    return null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {userRole && <Route path="/home" element={renderHomeRoute()} />}
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/view-placed-student-details"
          element={<ViewPlacedStudents />}
        />
        <Route
          path="/view-branch-placed-students"
          element={<ViewBranchPlacedStudents />}
        />
        <Route
          path="/view-all-placed-student-details"
          element={<ViewAllPlacedStudents />}
        />
        <Route
          path="/add-placed-student-details"
          element={<PlacedStudents />}
        />
        <Route path="/student-details" element={<StudentDetails />} />
        <Route
          path="/branch-consolidated-report"
          element={<BranchConsolidatedReport />}
        />
        <Route path="/consolidated-report" element={<ConsolidatedReport />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
