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
import "../styles/pages.css";
import * as XLSX from "xlsx";

function StudentStatistics({ apiUrl }) {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetch(apiUrl, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setStatistics(data);
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
    const data = Object.entries(statistics).map(
      ([category, count], index, arr) => {
        return {
          Category: category,
          Count: count,
        };
      }
    );

    return data;
  };

  return (
    <div className="student-statistics-container">
      <h3>Student Statistics</h3>
      <TableContainer component={Paper}>
        <Button
          variant="contained"
          size="small"
          onClick={() => downloadExcel(extractTableData())}
          style={{ backgroundColor: "#10793F" }}
        >
          Download As Excel{" "}
        </Button>
        <Table size="small" aria-label="student statistics table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#00afef",
                color: "white",
              }}
            >
              <TableCell>Category</TableCell>
              <TableCell align="center">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(statistics).map(([category, count], index, arr) => (
              <TableRow
                key={category}
                sx={
                  index === arr.length - 1
                    ? { backgroundColor: "#f0f0f0", fontWeight: 800 }
                    : null
                }
              >
                <TableCell component="th" scope="row">
                  {category}
                </TableCell>
                <TableCell align="center">{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default StudentStatistics;
