import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/pages.css";
import * as XLSX from "xlsx";

function ViewUnplacedStudents() {
  const [unPlacedStudents, setUnPlacedStudents] = useState([]);
  const [facultyAdvisorName, setFacultyAdvisorName] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [batch, setBatch] = useState("");

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setFacultyAdvisorName(data.name);
          setBatch(data.batch);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    fetch(`${api_url}server/get_facultyadvisor_assignments.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setAssignments(data.assignments);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    fetch(
      `${api_url}server/get_unplaced_students.php?advisor=${facultyAdvisorName}&batch=${batch}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setUnPlacedStudents(data.students);
          });
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [facultyAdvisorName, batch]);

  const handleBatchChange = useCallback((batch) => {
    setBatch(batch);
  }, []);

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "UnPlacedStudents.xlsx");
  };

  return (
    <div style={{ maxHeight: "500px", maxWidth: "1200px" }}>
      <Navbar />
      <div>
        <h2 style={{ textAlign: "center" }}>Placed Students Details</h2>
        <ButtonGroup
          variant="contained"
          disableElevation
          aria-label="Basic button group"
        >
          {assignments.map((assignment, index) => (
            <Button
              key={index}
              onClick={() => handleBatchChange(assignment.batch)}
            >
              {assignment.batch}
            </Button>
          ))}
        </ButtonGroup>
        <TableContainer className="fa-students-table" component={Paper}>
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

export default ViewUnplacedStudents;
