import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/pages.css";

function ViewBranchPlacedStudents() {
  const [placedStudents, setPlacedStudents] = useState([]);
  const [facultyAdvisors, setFacultyAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setBranch(data.specialization);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // Fetch faculty advisors
    fetch(`${api_url}server/get_branch_faculty_advisors.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setFacultyAdvisors(data.facultyAdvisors);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const handleAdvisorChange = (event) => {
    setSelectedAdvisor(event.target.value);
    // Fetch placed students of selected advisor
    fetch(
      `${api_url}server/get_placed_student_details.php?advisor=${event.target.value}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setPlacedStudents(data.students);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  return (
    <div>
      <Navbar />
      <div className="view-all-placed-container" style={{ maxHeight: "720px" }}>
        <h2>Placed Students In {branch}</h2>
        <FormControl style={{ minWidth: 220 }}>
          <InputLabel>Select Faculty Advisor</InputLabel>
          <Select value={selectedAdvisor} onChange={handleAdvisorChange}>
            {facultyAdvisors.map((advisor) => (
              <MenuItem
                key={advisor.id}
                value={advisor.name}
                style={{ color: "black" }}
              >
                {advisor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Register No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Faculty Advisor</TableCell>
                <TableCell>Batch</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {placedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.registerNumber}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.companyName}</TableCell>
                  <TableCell>{student.category}</TableCell>
                  <TableCell>{student.package} LPA</TableCell>
                  <TableCell>{student.facultyAdvisor}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ViewBranchPlacedStudents;
