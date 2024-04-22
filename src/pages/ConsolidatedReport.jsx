import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
import api_url from "../apiconfig";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

function ConsolidatedReport() {
  const [consolidatedReport, setConsolidatedReport] = useState([]);
  const [batch, setBatch] = useState(2025);
  const [shouldRender, setShouldRender] = useState(true);
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
  });

  useEffect(() => {
    // Fetch consolidated report data
    fetch(`${api_url}server/get_consolidated_report.php?batch=${batch}`, {
      method: "GET",
    })
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
    };

    data.forEach((advisor) => {
      Object.keys(advisor).forEach((key) => {
        if (key !== "facultyAdvisorName") {
          newTotal[key] += parseInt(advisor[key], 10);
        }
      });

      newTotal.notPlaced += advisor.supersetEnrolledCount - advisor.totalOffers;
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

  return (
    <div>
      <Navbar />
      <div
        ref={componentRef}
        style={{ maxHeight: "720px", marginTop: "200px" }}
      >
        {/* select batch */}
        <div>
          <h2 style={{ textAlign: "center" }}>
            Consolidated Report For All Students
          </h2>
          <div>
            <FormControl className="form-control">
              <InputLabel htmlFor="batch">Batch</InputLabel>{" "}
              <Select
                name="batch"
                label="batch"
                id="batch"
                value={batch}
                defaultValue={2025}
                onChange={handleBatchChange}
                style={{ color: "black", minWidth: 120, marginBottom: "20px" }} // Adjust minWidth as needed
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
                    <TableCell>{advisor.totalOffers}</TableCell>
                    <TableCell>
                      {(
                        (advisor.totalOffers / advisor.supersetEnrolledCount) *
                        100
                      ).toFixed(2)}
                      %
                    </TableCell>
                    <TableCell>
                      {advisor.supersetEnrolledCount - advisor.totalOffers}
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
                    {total.totalOffers}
                  </TableCell>
                  <TableCell></TableCell>
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
              apiUrl={`${api_url}server/get_salary_categorisation.php?batch=${batch}`}
            />
          )}

          {/*Marquee*/}
          {shouldRender && (
            <MarqueeStudents
              apiUrl={`${api_url}/server/get_marquee_students.php?batch=${batch}`}
            />
          )}

          {/*Offer Summary*/}
          <div style={{ maxWidth: "50%", margin: "0 auto" }}>
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
          <div style={{ maxWidth: "80%", margin: "0 auto" }}>
            <h3>Offers under various Categories</h3>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={offersCategoriesChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  angle={0}
                  textAnchor="middle"
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
              apiUrl={`${api_url}server/get_student_statistics.php?batch=${batch}`}
            />
          )}

          {/*Salary Statistics */}
          {shouldRender && (
            <SalaryStatistics
              apiUrl={`${api_url}server/get_salary_statistics.php?batch=${batch}`}
            />
          )}
        </div>
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

export default ConsolidatedReport;
