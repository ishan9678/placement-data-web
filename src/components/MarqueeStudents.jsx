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
import api_url from "../apiconfig";

function MarqueeStudents() {
  const [marqueeStudents, setMarqueeStudents] = useState([]);

  useEffect(() => {
    fetch(`${api_url}server/get_marquee_students.php`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setMarqueeStudents(data.marqueeStudents);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div>
      <h3>Marquee Students</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#00afef",
                color: "white",
              }}
            >
              <TableCell align="center">S.No</TableCell>
              <TableCell align="center">Register No</TableCell>
              <TableCell align="center">Student Name</TableCell>
              <TableCell align="center">Company</TableCell>
              <TableCell align="center">Package</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marqueeStudents.map((student, index) => (
              <TableRow key={student.registerNumber}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{student.registerNumber}</TableCell>
                <TableCell align="center">{student.fullName}</TableCell>
                <TableCell align="center">{student.companyName}</TableCell>
                <TableCell align="center">{student.package} LPA</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default MarqueeStudents;
