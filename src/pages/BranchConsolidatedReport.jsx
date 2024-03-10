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

function BranchConsolidatedReport() {
  const [consolidatedReport, setConsolidatedReport] = useState([]);
  const [branch, setBranch] = useState("");

  const [total, setTotal] = useState({
    supersetEnrolledCount: 0,
    marquee: 0,
    superDream: 0,
    dream: 0,
    daySharing: 0,
    internship: 0,
    totalOffers: 0,
  });

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setBranch(data.specialization);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // Fetch consolidated report data
    fetch(`${api_url}server/get_branch_consolidated_report.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setConsolidatedReport(data.consolidatedReport);
          calculateTotal(data.consolidatedReport);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const calculateTotal = (data) => {
    let newTotal = {
      supersetEnrolledCount: 0,
      marquee: 0,
      superDream: 0,
      dream: 0,
      daySharing: 0,
      internship: 0,
      totalOffers: 0,
    };

    data.forEach((advisor) => {
      Object.keys(advisor).forEach((key) => {
        if (key !== "facultyAdvisorName") {
          newTotal[key] += parseInt(advisor[key], 10);
        }
      });
    });

    setTotal(newTotal);
  };

  return (
    <div>
      <Navbar />
      <div>
        <h2>Consolidated Report For Students in {branch}</h2>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Name of Faculty Advisor</TableCell>
                <TableCell>Superset Enrolled</TableCell>
                <TableCell>Marquee</TableCell>
                <TableCell>Super Dream</TableCell>
                <TableCell>Dream</TableCell>
                <TableCell>Day Sharing</TableCell>
                <TableCell>Internship Offers</TableCell>
                <TableCell>Total Offers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consolidatedReport.map((advisor) => (
                <TableRow key={advisor.facultyAdvisorName}>
                  <TableCell>{advisor.facultyAdvisorName}</TableCell>
                  <TableCell>{advisor.supersetEnrolledCount}</TableCell>
                  <TableCell>{advisor.marquee}</TableCell>
                  <TableCell>{advisor.superDream}</TableCell>
                  <TableCell>{advisor.dream}</TableCell>
                  <TableCell>{advisor.daySharing}</TableCell>
                  <TableCell>{advisor.internship}</TableCell>
                  <TableCell>{advisor.totalOffers}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{total.supersetEnrolledCount}</TableCell>
                <TableCell>{total.marquee}</TableCell>
                <TableCell>{total.superDream}</TableCell>
                <TableCell>{total.dream}</TableCell>
                <TableCell>{total.daySharing}</TableCell>
                <TableCell>{total.internship}</TableCell>
                <TableCell>{total.totalOffers}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default BranchConsolidatedReport;
