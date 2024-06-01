import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import FaHome from "./pages/FaHome";
import PlacedStudents from "./pages/PlacedStudents";
import ViewPlacedStudents from "./pages/ViewPlacedStudents";
import ViewAllPlacedStudents from "./pages/viewAllPlacedStudents";
import ConsolidatedReport from "./pages/ConsolidatedReport";
import PlacementCoordinatorHome from "./pages/PlacementCoordinatorHome";
import HodHome from "./pages/HodHome";
import AcademicAdvisorHome from "./pages/AcademicAdvisorHome";
import ViewBranchPlacedStudents from "./pages/ViewBranchPlacedStudents";
import BranchConsolidatedReport from "./pages/BranchConsolidatedReport";
import api_url from "./apiconfig";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./pages/ResetPassword";
import StudentDetailss from "./pages/StudentDetailss";
import { gapi } from "gapi-script";
import AdditionalDetails from "./pages/AdditionalDetails";
import AddPlacedStudents from "./pages/AddPlacedStudents";
import FaConsolidatedReport from "./pages/FaConsolidatedReport";
import AdminHome from "./pages/AdminHome";
import AddStudents from "./pages/AddStudents";
import ProgramCoordinatorHome from "./pages/ProgramCoordinatorHome";
import EditStudentDetails from "./pages/EditStudentDetails";
import AcademicAdvisorConsolidatedReport from "./pages/AcademicAdivisorConslidatedReport";
import EditFacultyDetails from "./pages/EditFacultyDetails";
import ViewHigherStudiesStudents from "./pages/ViewHigherStudiesStudents";
import ViewEntrepreneurStudents from "./pages/ViewEntrepreneurStudents";
import EditPlacedStudents from "./pages/EditPlacedStudents";
import AcademicSearchPlacedStudents from "./pages/AcademicSearchPlacedStudents";
import CreateViewerLogin from "./pages/CreateViewerLogin";

const clientId =
  "932313425561-p4j1t2603ledibugd4m20nl0a3c7hu43.apps.googleusercontent.com";

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUserRole(data.role);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client: auth2", start);
  });

  const renderHomeRoute = () => {
    if (userRole === "Admin") {
      return <AdminHome />;
    } else if (userRole === "Faculty Advisor") {
      return <FaHome />;
    } else if (userRole === "Placement Coordinator") {
      return <PlacementCoordinatorHome />;
    } else if (userRole === "HOD") {
      return <HodHome />;
    } else if (userRole === "Academic Advisor") {
      return <AcademicAdvisorHome />;
    } else if (userRole === "Program Coordinator") {
      return <ProgramCoordinatorHome />;
    }
    return null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {isLoggedIn && <Route path="/home" element={renderHomeRoute()} />}
        {<Route path="/signup" element={<Signup />} />}
        {isLoggedIn && userRole === "Faculty Advisor" && (
          <Route
            path="/view-placed-student-details"
            element={<ViewPlacedStudents />}
          />
        )}
        {isLoggedIn && userRole === "Faculty Advisor" && (
          <Route
            path="/view-higher-studies-student-details"
            element={<ViewHigherStudiesStudents />}
          />
        )}
        {isLoggedIn && userRole === "Faculty Advisor" && (
          <Route
            path="/view-entrepreneur-student-details"
            element={<ViewEntrepreneurStudents />}
          />
        )}
        {isLoggedIn && userRole === "Program Coordinator" && (
          <Route
            path="/view-branch-placed-students"
            element={<ViewBranchPlacedStudents />}
          />
        )}
        {isLoggedIn &&
          (userRole === "HOD" ||
            userRole === "Placement Coordinator" ||
            userRole === "Academic Advisor") && (
            <Route
              path="/view-all-placed-student-details"
              element={<ViewAllPlacedStudents />}
            />
          )}
        {isLoggedIn && userRole === "Placement Coordinator" && (
          <Route
            path="/add-placed-student-details"
            element={<AddPlacedStudents />}
          />
        )}
        {isLoggedIn && userRole === "Academic Advisor" && (
          <Route
            path="/academic-consolidated-report"
            element={<AcademicAdvisorConsolidatedReport />}
          />
        )}
        {isLoggedIn && userRole === "Academic Advisor" && (
          <Route
            path="/academic-search-placed-students"
            element={<AcademicSearchPlacedStudents />}
          />
        )}
        {isLoggedIn && (
          <Route
            path="/branch-consolidated-report"
            element={<BranchConsolidatedReport />}
          />
        )}
        {isLoggedIn && userRole === "Faculty Advisor" && (
          <Route
            path="/fa-consolidated-report"
            element={<FaConsolidatedReport />}
          />
        )}
        {isLoggedIn && userRole === "Placement Coordinator" && (
          <Route
            path="/edit-placed-students"
            element={<EditPlacedStudents />}
          />
        )}
        {isLoggedIn &&
          (userRole === "HOD" ||
            userRole === "Placement Coordinator" ||
            userRole === "Academic Advisor") && (
            <Route
              path="/consolidated-report"
              element={<ConsolidatedReport />}
            />
          )}
        {<Route path="/reset-password" element={<ResetPassword />} />}
        {<Route path="/additional-details" element={<AdditionalDetails />} />}
        {/* Admin */}
        {isLoggedIn && userRole === "Admin" && (
          <Route path="/approve-users" element={<AdminDashboard />} />
        )}
        {isLoggedIn && userRole === "Admin" && (
          <Route path="/add-students" element={<AddStudents />} />
        )}
        {isLoggedIn && userRole === "Admin" && (
          <Route path="/edit-students" element={<EditStudentDetails />} />
        )}
        {isLoggedIn && userRole === "Admin" && (
          <Route path="/edit-faculties" element={<EditFacultyDetails />} />
        )}
        {isLoggedIn && userRole === "Admin" && (
          <Route path="/create-viewer-login" element={<CreateViewerLogin />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
