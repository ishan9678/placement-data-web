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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import api_url from "../apiconfig";

function SalaryCategorisation({ apiUrl }) {
  const [salaryCategorisation, setSalaryCategorisation] = useState({});

  useEffect(() => {
    fetch(apiUrl, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setSalaryCategorisation(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const getTotalCount = () => {
    let totalCount = 0;
    Object.values(salaryCategorisation).forEach((count) => {
      totalCount += parseInt(count);
      console.log("total count", totalCount);
    });
    return totalCount;
  };

  const dataForBarChart = Object.entries(salaryCategorisation).map(
    ([key, value]) => ({
      category: key,
      count: parseInt(value),
      percentage: (parseInt(value) / getTotalCount()) * 100,
    })
  );

  const colors = [
    "#4f81bd",
    "#c0504d",
    "#9bbb59",
    "#8064a2",
    "#4bacc6",
    "#f79646",
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h3>Salary Categorisation</h3>
      <TableContainer
        component={Paper}
        style={{ width: "50%", marginBottom: "20px" }}
      >
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#00afef", color: "white" }}>
              <TableCell align="center">Salary</TableCell>
              <TableCell align="center">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(salaryCategorisation).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell align="center">{key}</TableCell>
                <TableCell align="center">{value}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#f0f0f0", fontWeight: 800 }}>
              <TableCell align="center" sx={{ fontWeight: "800" }}>
                Total
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "800" }}>
                {getTotalCount()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Graph*/}
      <div style={{ width: "80%" }}>
        <h3>Salary Categorisation Bar Chart (in percentages)</h3>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={dataForBarChart}
            margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              label={{
                value: "Percentage",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />
            <Bar dataKey="percentage">
              {dataForBarChart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalaryCategorisation;
