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

function CompanyStatistics({ apiUrl }) {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetch(apiUrl, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setStatistics(data["company-statistics"]);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [apiUrl]);

  // Calculate total row
  const totalRow = {};
  Object.values(statistics).forEach((company) => {
    Object.values(company).forEach((categoryData) => {
      Object.entries(categoryData.specializations).forEach(
        ([specialization, count]) => {
          if (!totalRow[specialization]) {
            totalRow[specialization] = 0;
          }
          totalRow[specialization] += parseInt(count);
        }
      );
    });
  });

  const specializations = Object.keys(totalRow);

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  const extractTableData = () => {
    const data = [];

    // Extract individual company data
    Object.entries(statistics).forEach(([companyName, categories]) => {
      Object.entries(categories).forEach(([category, details]) => {
        const rowData = {
          "Company Name": companyName,
          Category: category,
          ...details.specializations,
          Total: Object.values(details.specializations).reduce(
            (sum, count) => sum + parseInt(count, 10),
            0
          ),
        };

        // Ensure all specializations are included
        specializations.forEach((spec) => {
          if (!rowData[spec]) {
            rowData[spec] = 0;
          }
        });

        data.push(rowData);
      });
    });

    // Extract total row data
    const totalRowData = {
      "Company Name": "Total",
      Category: "",
      ...totalRow,
      Total: Object.values(totalRow).reduce((sum, count) => sum + count, 0),
    };

    data.push(totalRowData);

    return data;
  };

  return (
    <div className="company-statistics-table">
      <h3>Company Statistics</h3>
      <TableContainer component={Paper}>
        <Button
          variant="contained"
          size="small"
          onClick={() => downloadExcel(extractTableData())}
          style={{ backgroundColor: "#10793F" }}
        >
          Download As Excel{" "}
        </Button>
        <Table size="small" aria-label="company statistics table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#00afef",
                color: "white",
              }}
            >
              <TableCell>Company Name</TableCell>
              <TableCell>Category</TableCell>
              {specializations.map((spec) => (
                <TableCell key={spec}>{spec}</TableCell>
              ))}
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(statistics).map(([companyName, categories]) =>
              Object.entries(categories).map(([category, details]) => (
                <TableRow key={`${companyName}-${category}`}>
                  <TableCell>{companyName}</TableCell>
                  <TableCell>{category}</TableCell>
                  {specializations.map((spec) => (
                    <TableCell key={spec}>
                      {details.specializations[spec] || 0}
                    </TableCell>
                  ))}
                  <TableCell>
                    {Object.values(details.specializations).reduce(
                      (sum, count) => sum + parseInt(count),
                      0
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
            <TableRow
              sx={{
                backgroundColor: "#f0f0f0",
              }}
            >
              <TableCell colSpan={2}>
                <strong>Total</strong>
              </TableCell>
              {specializations.map((spec) => (
                <TableCell key={spec}>
                  <strong>{totalRow[spec]}</strong>
                </TableCell>
              ))}
              <TableCell>
                <strong>
                  {Object.values(totalRow).reduce(
                    (sum, count) => sum + count,
                    0
                  )}
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CompanyStatistics;
