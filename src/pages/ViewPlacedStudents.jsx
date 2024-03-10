import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";

function ViewPlacedStudents() {
  const [placedStudents, setPlacedStudents] = useState([]);

  useEffect(() => {
    // Fetch consolidated report data
    fetch(`${api_url}server/get_placed_student_details.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setPlacedStudents(data.students);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <h2>Placed Students</h2>
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
                  <TableCell>{student.package}</TableCell>
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

export default ViewPlacedStudents;
