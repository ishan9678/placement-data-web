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
import Navbar from "../components/Navbar";
import { useReactToPrint } from "react-to-print";
import api_url from "../apiconfig";
import "../styles/pages.css";

function FaConsolidatedReport() {
  const [specialization, setSpecialization] = useState(null);
  const [section, setSection] = useState(null);
  const [consolidatedReport, setConsolidatedReport] = useState([]);
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
          setSection(data.section);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // Fetch consolidated report data
    fetch(`${api_url}server/get_fa_consolidated_report.php`, {
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

  return (
    <>
      {" "}
      <Navbar />
      <div
        className="consolidated-report-container"
        ref={componentRef}
        style={{ maxHeight: "720px" }}
      >
        <div>
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            Consolidated Report for {specialization} {section} section
          </h2>
          {/* table 1 */}
          <TableContainer component={Paper}>
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
                  <TableCell sx={{ fontWeight: "800" }}>
                    {total.dream}
                  </TableCell>
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
          <SalaryCategorisation
            apiUrl={`${api_url}server/get_fa_salary_categorisation.php`}
          />

          {/*Marquee*/}
          <MarqueeStudents
            apiUrl={`${api_url}/server/get_fa_marquee_students.php`}
          />

          {/*Offer Summary*/}
          <div className="offer-summary-table">
            <h3>Offer Summary</h3>
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
          <StudentStatistics
            apiUrl={`${api_url}server/get_fa_student_statistics.php`}
          />
          {/*Salary Statistics */}
          <SalaryStatistics
            apiUrl={`${api_url}server/get_fa_salary_statistics.php`}
          />
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
    </>
  );
}

export default FaConsolidatedReport;
