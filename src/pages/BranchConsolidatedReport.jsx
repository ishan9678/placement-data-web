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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import SalaryCategorisation from "../components/SalaryCategorisation";
import MarqueeStudents from "../components/MarqueeStudents";
import StudentStatistics from "../components/StudentStatistics";
import SalaryStatistics from "../components/SalaryStatistics";
import CompanyStatistics from "../components/CompanyStatistics";
import Navbar from "../components/Navbar";
import { useReactToPrint } from "react-to-print";
import api_url from "../apiconfig";
import "../styles/pages.css";
import * as XLSX from "xlsx";

function BranchConsolidatedReport() {
  const [specialization, setSpecialization] = useState(null);
  const [role, setRole] = useState("");
  const [batch, setBatch] = useState(null);
  const [consolidatedReport, setConsolidatedReport] = useState([]);
  const [shouldRender, setShouldRender] = useState(true);
  const [xAxisAngle, setXAxisAngle] = useState(0); // Default angle
  const [total, setTotal] = useState({
    supersetEnrolledCount: 0,
    marquee: 0,
    superDream: 0,
    dream: 0,
    daySharing: 0,
    internship: 0,
    totalOffers: 0,
    totalCount: 0,
    notPlaced: 0,
    uniqueCount: 0,
  });

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setSpecialization(data.specialization);
          setRole(data.role);
          setBatch(data.batch);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // Fetch consolidated report data
    fetch(
      `${api_url}server/get_branch_consolidated_report.php?batch=${batch}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setConsolidatedReport(data.consolidatedReport);
          calculateTotal(data.consolidatedReport);
          setShouldRender(false);
          setTimeout(() => {
            setShouldRender(true);
          }, 0);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [batch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Change angle for small screens
        setXAxisAngle(-45);
      } else {
        setXAxisAngle(0); // Reset angle for larger screens
      }
    };

    // Call handleResize initially and add event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
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
      totalCount: 0,
      notPlaced: 0,
      uniqueCount: 0,
    };

    data.forEach((advisor) => {
      Object.keys(advisor).forEach((key) => {
        if (key !== "facultyAdvisorName") {
          newTotal[key] += parseInt(advisor[key], 10);
        }
      });
      newTotal.notPlaced += advisor.supersetEnrolledCount - advisor.uniqueCount;
    });

    setTotal(newTotal);
  };

  const offersCategoriesChartData = [
    { category: "Marquee", offers: total.marquee },
    { category: "Super Dream", offers: total.superDream },
    { category: "Dream", offers: total.dream },
    { category: "Day Sharing", offers: total.daySharing },
    { category: "Internship", offers: total.internship },
    { category: "Total", offers: total.totalOffers },
  ];

  const colors = [
    "#4f81bd",
    "#c0504d",
    "#9bbb59",
    "#8064a2",
    "#4bacc6",
    "#f79646",
  ];

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleBatchChange = (event) => {
    setBatch(event.target.value);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  const extractConsolidatedTable1Data = () => {
    const data = consolidatedReport.map((advisor) => ({
      "Name of Faculty Advisor": advisor.facultyAdvisorName,
      Section: advisor.facultyAdvisorSection,
      "Superset Enrolled": advisor.supersetEnrolledCount,
      Marquee: advisor.marquee,
      "Super Dream": advisor.superDream,
      Dream: advisor.dream,
      "Day Sharing": advisor.daySharing,
      "Internship Offers": advisor.internship,
      "Total Offers": advisor.totalOffers,
      "Unique Offers": advisor.uniqueCount,
    }));

    // Adding total row
    data.push({
      "Name of Faculty Advisor": "Total",
      Section: "",
      "Superset Enrolled": total.supersetEnrolledCount,
      Marquee: total.marquee,
      "Super Dream": total.superDream,
      Dream: total.dream,
      "Day Sharing": total.daySharing,
      "Internship Offers": total.internship,
      "Total Offers": total.totalOffers,
      "Unique Offers": total.uniqueCount,
    });

    return data;
  };

  const extractConsolidatedTable2Data = () => {
    const data = consolidatedReport.map((advisor) => ({
      "Name of Faculty Advisor": advisor.facultyAdvisorName,
      Section: advisor.facultyAdvisorSection,
      "Class Strength": advisor.totalCount,
      "Placement Enrolled": advisor.supersetEnrolledCount,
      "Placed Students": advisor.uniqueCount,
      "Placement %":
        ((advisor.uniqueCount / advisor.supersetEnrolledCount) * 100).toFixed(
          2
        ) + "%",
      "Not Placed Students":
        advisor.supersetEnrolledCount - advisor.uniqueCount,
    }));

    // Adding the totals row
    data.push({
      "Name of Faculty Advisor": "Total",
      Section: "",
      "Class Strength": total.totalCount,
      "Placement Enrolled": total.supersetEnrolledCount,
      "Placed Students": total.uniqueCount,
      "Placement %":
        ((total.uniqueCount / total.supersetEnrolledCount) * 100).toFixed(2) +
        "%",
      "Not Placed Students": total.notPlaced,
    });

    return data;
  };

  const extractOfferSummaryTableData = () => {
    const data = [
      { "S. NO": 1, CATEGORY: "Marquee", "NO OF OFFERS": total.marquee },
      { "S. NO": 2, CATEGORY: "Super Dream", "NO OF OFFERS": total.superDream },
      { "S. NO": 3, CATEGORY: "Dream", "NO OF OFFERS": total.dream },
      { "S. NO": 4, CATEGORY: "Day Sharing", "NO OF OFFERS": total.daySharing },
      { "S. NO": 5, CATEGORY: "Internship", "NO OF OFFERS": total.internship },
      {
        "S. NO": "Total",
        CATEGORY: "",
        "NO OF OFFERS": total.totalOffers,
      },
    ];

    return data;
  };

  return (
    <div>
      <Navbar />
      <div
        className="consolidated-report-container"
        ref={componentRef}
        style={{ maxHeight: "720px" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          Consolidated Report for {specialization}
        </h2>

        <div>
          {role === "Program Coordinator" ? (
            <div>
              <FormControl className="form-control">
                <InputLabel htmlFor="batch">Batch</InputLabel>{" "}
                <Select
                  name="batch"
                  label="batch"
                  id="batch"
                  value={batch}
                  onChange={handleBatchChange}
                  style={{
                    color: "black",
                    minWidth: 120,
                    marginBottom: "20px",
                  }} // Adjust minWidth as needed
                >
                  {[...Array(2051 - 2022).keys()].map((year) => (
                    <MenuItem
                      key={2022 + year}
                      value={2022 + year}
                      style={{ color: "black" }}
                    >
                      {2022 + year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : (
            <div></div>
          )}
        </div>

        {/* table 1 */}
        <TableContainer component={Paper}>
          <Button
            variant="contained"
            size="small"
            onClick={() => downloadExcel(extractConsolidatedTable1Data())}
            style={{ backgroundColor: "#10793F" }}
          >
            Download As Excel
          </Button>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#00afef",
                  color: "white",
                }}
              >
                <TableCell>Name of Faculty Advisor</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Superset Enrolled</TableCell>
                <TableCell>Marquee</TableCell>
                <TableCell>Super Dream</TableCell>
                <TableCell>Dream</TableCell>
                <TableCell>Day Sharing</TableCell>
                <TableCell>Internship Offers</TableCell>
                <TableCell>Total Offers</TableCell>
                <TableCell>Unique Offers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consolidatedReport.map((advisor) => (
                <TableRow key={advisor.facultyAdvisorName}>
                  <TableCell>{advisor.facultyAdvisorName}</TableCell>
                  <TableCell>{advisor.facultyAdvisorSection}</TableCell>
                  <TableCell>{advisor.supersetEnrolledCount}</TableCell>
                  <TableCell>{advisor.marquee}</TableCell>
                  <TableCell>{advisor.superDream}</TableCell>
                  <TableCell>{advisor.dream}</TableCell>
                  <TableCell>{advisor.daySharing}</TableCell>
                  <TableCell>{advisor.internship}</TableCell>
                  <TableCell>{advisor.totalOffers}</TableCell>
                  <TableCell>{advisor.uniqueCount}</TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{
                  backgroundColor: "#f0f0f0",
                }}
              >
                <TableCell sx={{ fontWeight: "800" }}>Total</TableCell>
                <TableCell></TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.supersetEnrolledCount}
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.marquee}
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.superDream}
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>{total.dream}</TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.daySharing}
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.internship}
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.totalOffers}
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.uniqueCount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        {/* Table 2 */}
        <TableContainer component={Paper}>
          <Button
            variant="contained"
            size="small"
            onClick={() => downloadExcel(extractConsolidatedTable2Data())}
            style={{ backgroundColor: "#10793F" }}
          >
            Download As Excel
          </Button>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#00afef",
                  color: "white",
                }}
              >
                <TableCell>Name of Faculty Advisor</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Class Strength</TableCell>
                <TableCell>Placement Enrolled</TableCell>
                <TableCell>Placed Students</TableCell>
                <TableCell>Placement %</TableCell>
                <TableCell>Not Placed Students</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consolidatedReport.map((advisor) => (
                <TableRow key={advisor.facultyAdvisorName}>
                  <TableCell>{advisor.facultyAdvisorName}</TableCell>
                  <TableCell>{advisor.facultyAdvisorSection}</TableCell>
                  <TableCell>{advisor.totalCount}</TableCell>
                  <TableCell>{advisor.supersetEnrolledCount}</TableCell>
                  <TableCell>{advisor.uniqueCount}</TableCell>
                  <TableCell>
                    {(
                      (advisor.uniqueCount / advisor.supersetEnrolledCount) *
                      100
                    ).toFixed(2)}
                    %
                  </TableCell>
                  <TableCell>
                    {advisor.supersetEnrolledCount - advisor.uniqueCount}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{
                  backgroundColor: "#f0f0f0",
                }}
              >
                <TableCell sx={{ fontWeight: "800" }}>Total</TableCell>
                <TableCell></TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.totalCount}
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.supersetEnrolledCount}
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.uniqueCount}
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {" "}
                  {(
                    (total.uniqueCount / total.supersetEnrolledCount) *
                    100
                  ).toFixed(2)}
                  %
                </TableCell>
                <TableCell sx={{ fontWeight: "800" }}>
                  {total.notPlaced}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/*Salary*/}
        {shouldRender && (
          <SalaryCategorisation
            apiUrl={`${api_url}server/get_branch_salary_categorisation.php?batch=${batch}`}
          />
        )}

        {/*Marquee*/}
        {shouldRender && (
          <MarqueeStudents
            apiUrl={`${api_url}/server/get_branch_marquee_students.php?batch=${batch}`}
          />
        )}

        {/*Offer Summary*/}
        <div className="offer-summary-table">
          <h3>Offer Summary</h3>
          <Button
            variant="contained"
            size="small"
            onClick={() => downloadExcel(extractOfferSummaryTableData())}
            style={{ backgroundColor: "#10793F" }}
          >
            Download As Excel
          </Button>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#00afef",
                    color: "white",
                  }}
                >
                  <TableCell align="center">S. NO</TableCell>
                  <TableCell align="center">CATEGORY</TableCell>
                  <TableCell align="center">NO OF OFFERS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="center">Marquee</TableCell>
                  <TableCell align="center">{total.marquee}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">2</TableCell>
                  <TableCell align="center">Super Dream</TableCell>
                  <TableCell align="center">{total.superDream}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">3</TableCell>
                  <TableCell align="center">Dream</TableCell>
                  <TableCell align="center">{total.dream}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">4</TableCell>
                  <TableCell align="center">Day Sharing</TableCell>
                  <TableCell align="center">{total.daySharing}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">5</TableCell>
                  <TableCell align="center">Internship</TableCell>
                  <TableCell align="center">{total.internship}</TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: "800" }}>
                    Total
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell align="center" sx={{ fontWeight: "800" }}>
                    {total.totalOffers}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Offers under various categories Graph*/}
        <div className="offer-summary-graph">
          <h3>Offers under various Categories</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={offersCategoriesChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={xAxisAngle}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                label={{
                  value: "Number of Offers",
                  angle: -90,
                  position: "middle",
                  offset: -10,
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="offers" fill="#f79646">
                {offersCategoriesChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Student Statistics */}
        {shouldRender && (
          <StudentStatistics
            apiUrl={`${api_url}server/get_branch_student_statistics.php?batch=${batch}`}
          />
        )}

        {/*Salary Statistics */}
        {shouldRender && (
          <SalaryStatistics
            apiUrl={`${api_url}server/get_branch_salary_statistics.php?batch=${batch}`}
          />
        )}

        <Button
          className="print-button"
          style={{
            margin: "2rem",
            backgroundColor: "#1565c0",
            color: "white",
            fontWeight: "700",
            borderRadius: "20px",
            padding: "10px 20px",
            zIndex: 100,
          }}
          onClick={handlePrint}
        >
          Print as PDF
        </Button>
      </div>
    </div>
  );
}

export default BranchConsolidatedReport;
