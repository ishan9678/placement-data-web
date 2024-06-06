import React, { useEffect, useState } from "react";
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
import * as XLSX from "xlsx";

function MarqueeStudents({ apiUrl }) {
  const [marqueeStudents, setMarqueeStudents] = useState([]);

  useEffect(() => {
    fetch(apiUrl, {
      method: "GET",
      credentials: "include",
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
  }, [apiUrl]);

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  const extractTableData = () => {
    const data = marqueeStudents.map((student, index) => ({
      "S.No": index + 1,
      "Register No": student.registerNumber,
      "Student Name": student.fullName,
      Company: student.companyName,
      Package: `${student.package} LPA`,
    }));

    return data;
  };

  return (
    <div>
      <h3>Marquee Students</h3>
      <TableContainer component={Paper}>
        <Button
          variant="contained"
          size="small"
          onClick={() => downloadExcel(extractTableData())}
          style={{ backgroundColor: "#10793F" }}
        >
          Download As Excel
        </Button>
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
