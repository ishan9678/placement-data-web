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

  return (
    <div style={{ maxWidth: "80%", margin: "0 auto" }}>
      <h3>Student Statistics</h3>
      <TableContainer component={Paper}>
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
