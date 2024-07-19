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
  Button,
} from "@mui/material";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/pages.css";
import * as XLSX from "xlsx";

function ViewBranchUnpalcedStudents() {
  const [unPlacedStudents, setUnPlacedStudents] = useState([]);
  const [facultyAdvisors, setFacultyAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("2025");

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setDepartment(data.department);
          setBranch(data.specialization);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // Fetch faculty advisors
    fetch(`${api_url}server/get_branch_faculty_advisors.php?&batch=${batch}`, {
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
  }, [department, batch]);

  const fetchUnPlacedStudents = (advisor, batch) => {
    let url = `${api_url}server/get_unplaced_students.php?`;
    url += "department=" + department + "&";
    url += "batch=" + batch + "&";
    if (advisor) {
      url += `advisor=${advisor}`;
    }
    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUnPlacedStudents(data.students);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  const handleAdvisorChange = (event) => {
    const advisor = event.target.value;
    setSelectedAdvisor(advisor);
    fetchUnPlacedStudents(advisor, batch);
  };

  const handleBatchChange = (event) => {
    setBatch(event.target.value);
    const batch = event.target.value;
    fetchUnPlacedStudents(selectedAdvisor, batch);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "UnPlacedStudents.xlsx");
  };

  return (
    <div>
      <Navbar />
      <div
        className="view-all-placed-container"
        style={{ maxHeight: "500px", maxWidth: "1200px" }}
      >
        <h2 className="view-all-placed-title">
          Not placed Students In {branch}
        </h2>
        <div style={{ display: "flex" }}>
          <FormControl
            className="view-all-placed-select"
            // style={{ minWidth: 220 }}
          >
            <InputLabel>Select Faculty Advisor</InputLabel>
            <Select
              value={selectedAdvisor}
              onChange={handleAdvisorChange}
              style={{ color: "black" }}
            >
              <MenuItem value="">
                {" "}
                <em style={{ color: "black" }}>None</em>
              </MenuItem>
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

          <FormControl className="form-control">
            <InputLabel htmlFor="batch">Batch</InputLabel>{" "}
            <Select
              name="batch"
              label="batch"
              id="batch"
              value={batch}
              defaultValue={2025}
              onChange={handleBatchChange}
              style={{ color: "black", minWidth: 120, marginBottom: "20px" }} // Adjust minWidth as needed
            >
              {[...Array(2051 - 2022).keys()].map((year) => (
                <MenuItem
                  key={2022 + year}
                  value={2022 + year}
                  style={{ color: "black" }}
                >
                  {2022 + year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <TableContainer
          className="view-all-placed-table"
          component={Paper}
          style={{ overflowX: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Register No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Career Option</TableCell>
                <TableCell>Faculty Advisor</TableCell>
                <TableCell>Batch</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unPlacedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.registerNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.careerOption}</TableCell>
                  <TableCell>{student.facultyAdvisorName}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5}>
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  <strong>{unPlacedStudents.length} students</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {unPlacedStudents.length > 0 && (
            <Button
              variant="contained"
              size="small"
              onClick={() => downloadExcel(unPlacedStudents)}
              style={{ backgroundColor: "#10793F", margin: "2rem" }}
            >
              Download As Excel
            </Button>
          )}
        </TableContainer>
      </div>
    </div>
  );
}

export default ViewBranchUnpalcedStudents;
