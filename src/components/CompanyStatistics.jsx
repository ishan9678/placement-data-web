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
import "../styles/pages.css";

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
    Object.entries(company.specializations).forEach(
      ([specialization, count]) => {
        if (!totalRow[specialization]) {
          totalRow[specialization] = 0;
        }
        totalRow[specialization] += parseInt(count);
      }
    );
  });

  const specializations = Object.keys(totalRow);

  return (
    <div className="company-statistics-table">
      <h3>Company Statistics</h3>
      <TableContainer component={Paper}>
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
            {Object.entries(statistics).map(([companyName, companyData]) => (
              <TableRow key={companyName}>
                <TableCell>{companyName}</TableCell>
                <TableCell>{companyData.category}</TableCell>
                {specializations.map((spec) => (
                  <TableCell key={spec}>
                    {companyData.specializations[spec] || 0}
                  </TableCell>
                ))}
                <TableCell>
                  {Object.values(companyData.specializations).reduce(
                    (sum, count) => sum + parseInt(count),
                    0
                  )}
                </TableCell>
              </TableRow>
            ))}
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
