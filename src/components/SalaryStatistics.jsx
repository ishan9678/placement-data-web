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
import api_url from "../apiconfig";
import "../styles/pages.css";
import * as XLSX from "xlsx";

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
  }, [apiUrl]);

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "SalaryStatistics.xlsx");
  };

  const extractTableData = () => {
    const data = [
      {
        Category: "Highest Salary",
        Name: statistics.max_name,
        "In Lakhs Per Annum": statistics.max_package,
        Company: statistics.max_company,
      },
      {
        Category: "Median Salary",
        Name: statistics.median_name,
        "In Lakhs Per Annum": statistics.median_package,
        Company: statistics.median_company,
      },
      {
        Category: "Lowest Salary",
        Name: statistics.min_name,
        "In Lakhs Per Annum": statistics.min_package,
        Company: statistics.min_company,
      },
      {
        Category: "Average Salary",
        Name: "",
        "In Lakhs Per Annum": statistics.avg_package,
        Company: "-",
      },
    ];
    return data;
  };

  return (
    <div className="salary-statistics-table">
      <h3>Salary Statistics</h3>
      <TableContainer component={Paper}>
        <Button
          variant="contained"
          size="small"
          onClick={() => downloadExcel(extractTableData())}
          style={{ backgroundColor: "#10793F" }}
        >
          Download As Excel
        </Button>
        <Table size="small" aria-label="salary statistics table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#00afef", color: "white" }}>
              <TableCell>Category</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">In Lakhs Per Annum</TableCell>
              <TableCell align="center">Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Highest Salary
              </TableCell>
              <TableCell align="center">{statistics.max_name}</TableCell>
              <TableCell align="center">{statistics.max_package} LPA</TableCell>
              <TableCell align="center">{statistics.max_company}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Median Salary
              </TableCell>
              <TableCell align="center">{statistics.median_name}</TableCell>
              <TableCell align="center">
                {statistics.median_package} LPA
              </TableCell>
              <TableCell align="center">{statistics.median_company}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Lowest Salary
              </TableCell>
              <TableCell align="center">{statistics.min_name}</TableCell>
              <TableCell align="center">{statistics.min_package} LPA</TableCell>
              <TableCell align="center">{statistics.min_company}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell component="th" scope="row" sx={{ fontWeight: "800" }}>
                Average Salary
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="center" sx={{ fontWeight: "800" }}>
                {statistics.avg_package !== undefined
                  ? statistics.avg_package.toFixed(2)
                  : "0.00"}{" "}
                LPA
              </TableCell>
              <TableCell align="center">-</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell component="th" scope="row" sx={{ fontWeight: "800" }}>
                Average Salary (Unique Offers)
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="center" sx={{ fontWeight: "800" }}>
                {statistics.unique_avg_package !== undefined
                  ? statistics.unique_avg_package.toFixed(2)
                  : "0.00"}{" "}
                LPA
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
