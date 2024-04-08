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

function SalaryStatistics({ apiUrl }) {
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
  }, []);

  return (
    <div style={{ maxWidth: "80%", margin: "0 auto" }}>
      <h3>Salary Statistics</h3>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="salary statistics table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#00afef",
                color: "white",
              }}
            >
              <TableCell>Category</TableCell>
              <TableCell align="center">In Lakhs Per Annum</TableCell>
              <TableCell align="center">Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Highest Salary
              </TableCell>
              <TableCell align="center">{statistics.max_package} LPA</TableCell>
              <TableCell align="center">{statistics.max_company}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Lowest Salary
              </TableCell>
              <TableCell align="center">{statistics.min_package} LPA</TableCell>
              <TableCell align="center">{statistics.min_company}</TableCell>
            </TableRow>
            <TableRow
              sx={{
                backgroundColor: "#f0f0f0",
              }}
            >
              <TableCell component="th" scope="row" sx={{ fontWeight: "800" }}>
                Average Salary
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "800" }}>
                {statistics.avg_package * 100000} INR
              </TableCell>
              <TableCell align="center">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SalaryStatistics;
