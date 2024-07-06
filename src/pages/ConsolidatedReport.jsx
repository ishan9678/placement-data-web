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
import { useReactToPrint } from "react-to-print";
import "../styles/pages.css";
import CompanyStatistics from "../components/CompanyStatistics";
import * as XLSX from "xlsx";

function ConsolidatedReport() {
  const [consolidatedReport, setConsolidatedReport] = useState([]);
  const [prevConsolidatedReport, setPrevConsolidatedReport] = useState([]);
  const [departmentStatistics, setDepartmentStatistics] = useState([]);
  const [batch, setBatch] = useState(0);
  const [prevBatch, setPrevBatch] = useState(0);
  const [department, setDepartment] = useState("");
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

  const [prevTotal, setPrevTotal] = useState({
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

  const [departmentStatisticsTotal, setDepartmentStatisticsTotal] = useState({
    totalCount: 0,
    supersetEnrolledCount: 0,
    marquee: 0,
    superDream: 0,
    dream: 0,
    daySharing: 0,
    internship: 0,
    totalOffers: 0,
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
          setBatch(data.batch);
          setPrevBatch(data.batch - 1);
          setDepartment(data.department);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // Fetch consolidated report data
    fetch(
      `${api_url}server/get_consolidated_report.php?batch=${batch}&department=${department}`,
      {
        method: "GET",
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
  }, [batch, department]);

  useEffect(() => {
    // Fetch consolidated report data
    fetch(
      `${api_url}server/get_consolidated_report.php?batch=${prevBatch}&department=${department}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setPrevConsolidatedReport(data.consolidatedReport);
          calculatePrevTotal(data.consolidatedReport);
          setShouldRender(false);
          setTimeout(() => {
            setShouldRender(true);
          }, 0);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [prevBatch, department]);

  useEffect(() => {
    //fetch dept statistics
    fetch(
      `${api_url}server/get_all_department_statistics.php?batch=${batch}&department=${department}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setDepartmentStatistics(data.departmentStatistics);
          calculateDepartmentTotal(data.departmentStatistics);
          setShouldRender(false);
          setTimeout(() => {
            setShouldRender(true);
          }, 0);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [batch, department]);

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

  const calculatePrevTotal = (data) => {
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

    setPrevTotal(newTotal);
  };

  const calculateDepartmentTotal = (data) => {
    let newDepartmentTotal = {
      totalCount: 0,
      supersetEnrolledCount: 0,
      marquee: 0,
      superDream: 0,
      dream: 0,
      daySharing: 0,
      internship: 0,
      totalOffers: 0,
      uniqueCount: 0,
    };

    Object.values(data).forEach((department) => {
      Object.keys(department).forEach((key) => {
        if (key !== "supersetEnrolledCount" && key !== "totalCount") {
          newDepartmentTotal[key] += parseInt(department[key], 10);
        }
      });
      newDepartmentTotal.supersetEnrolledCount +=
        department.supersetEnrolledCount;
      newDepartmentTotal.totalCount += department.totalCount;
      // newDepartmentTotal.totalOffers += department.totalOffers;
      // newDepartmentTotal.uniqueCount += department.uniqueCount;
      // newDepartmentTotal.marquee += department.marquee;
      // newDepartmentTotal.superDream += department.superDream;
      // newDepartmentTotal.dream += newDepartmentTotal.dream;
      // newDepartmentTotal.daySharing += newDepartmentTotal.daySharing;
      // newDepartmentTotal.internship += newDepartmentTotal.internship;
    });

    setDepartmentStatisticsTotal(newDepartmentTotal);
  };

  const offersCategoriesChartData = [
    { category: "Marquee", offers: total.marquee },
    { category: "Super Dream", offers: total.superDream },
    { category: "Dream", offers: total.dream },
    { category: "Day Sharing", offers: total.daySharing },
    { category: "Internship", offers: total.internship },
    { category: "Total", offers: total.totalOffers },
  ];

  const offersCategoriesChartComparisionData = [
    {
      category: "Marquee",
      currentOffers: total.marquee,
      prevOffers: prevTotal.marquee,
    },
    {
      category: "Super Dream",
      currentOffers: total.superDream,
      prevOffers: prevTotal.superDream,
    },
    {
      category: "Dream",
      currentOffers: total.dream,
      prevOffers: prevTotal.dream,
    },
    {
      category: "Day Sharing",
      currentOffers: total.daySharing,
      prevOffers: prevTotal.daySharing,
    },
    {
      category: "Internship",
      currentOffers: total.internship,
      prevOffers: prevTotal.internship,
    },
    {
      category: "Total",
      currentOffers: total.totalOffers,
      prevOffers: prevTotal.totalOffers,
    },
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
    setPrevBatch(event.target.value - 1);
  };

  const handlePrevBatchChange = (event) => {
    setPrevBatch(event.target.value);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  const extractDepartmentTableData = () => {
    // Extracting each department's data
    const data = Object.entries(departmentStatistics).map(
      ([department, stats]) => ({
        Department: department,
        "Total Count": stats.totalCount,
        "Superset Enrolled": stats.supersetEnrolledCount,
        Marquee: stats.marquee,
        "Super Dream": stats.superDream,
        Dream: stats.dream,
        "Day Sharing": stats.daySharing,
        Internship: stats.internship,
        "Total Offers": stats.totalOffers,
        "Percentage %":
          ((stats.uniqueCount / stats.supersetEnrolledCount) * 100).toFixed(2) +
          "%",
        "Unique Offers": stats.uniqueCount,
      })
    );

    // Adding the totals row
    data.push({
      Department: "Total",
      "Total Count": departmentStatisticsTotal.totalCount,
      "Superset Enrolled": departmentStatisticsTotal.supersetEnrolledCount,
      Marquee: departmentStatisticsTotal.marquee,
      "Super Dream": departmentStatisticsTotal.superDream,
      Dream: departmentStatisticsTotal.dream,
      "Day Sharing": departmentStatisticsTotal.daySharing,
      Internship: departmentStatisticsTotal.internship,
      "Total Offers": departmentStatisticsTotal.totalOffers,
      "Percentage %":
        (
          (departmentStatisticsTotal.totalOffers /
            departmentStatisticsTotal.supersetEnrolledCount) *
          100
        ).toFixed(2) + "%",
      "Unique Offers": departmentStatisticsTotal.uniqueCount,
    });

    return data;
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
        {/* select batch */}
        <div>
          <h2
            className="consolidated-report-title"
            style={{ textAlign: "center" }}
          >
            Consolidated Report For {department} {batch}
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
          <Button
            variant="contained"
            size="small"
            onClick={() => downloadExcel(extractConsolidatedTable1Data())}
            style={{ backgroundColor: "#10793F" }}
          >
            Download As Excel
          </Button>
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

          {/*Department Statistics*/}

          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => downloadExcel(extractDepartmentTableData())}
              style={{ backgroundColor: "#10793F" }}
            >
              Download As Excel
            </Button>
            <Table size="small" aria-label="branch-statistics">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#00afef",
                    color: "white",
                  }}
                >
                  <TableCell>Department</TableCell>
                  <TableCell>Total Count</TableCell>
                  <TableCell>Superset Enrolled</TableCell>
                  <TableCell>Marquee</TableCell>
                  <TableCell>Super Dream</TableCell>
                  <TableCell>Dream</TableCell>
                  <TableCell>Day Sharing</TableCell>
                  <TableCell>Internship</TableCell>
                  <TableCell>Total Offers</TableCell>
                  <TableCell>Percentage %</TableCell>
                  <TableCell>Unique Offers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(departmentStatistics).map(
                  ([department, stats]) => (
                    <TableRow key={department}>
                      <TableCell>{department}</TableCell>
                      <TableCell>{stats.totalCount}</TableCell>
                      <TableCell>{stats.supersetEnrolledCount}</TableCell>
                      <TableCell>{stats.marquee}</TableCell>
                      <TableCell>{stats.superDream}</TableCell>
                      <TableCell>{stats.dream}</TableCell>
                      <TableCell>{stats.daySharing}</TableCell>
                      <TableCell>{stats.internship}</TableCell>
                      <TableCell>{stats.totalOffers}</TableCell>
                      <TableCell>
                        {(
                          (stats.uniqueCount / stats.supersetEnrolledCount) *
                          100
                        ).toFixed(2)}
                        %
                      </TableCell>
                      <TableCell>{stats.uniqueCount}</TableCell>
                    </TableRow>
                  )
                )}
                <TableRow
                  sx={{
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {departmentStatisticsTotal.totalCount}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {departmentStatisticsTotal.supersetEnrolledCount}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {departmentStatisticsTotal.marquee}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {departmentStatisticsTotal.superDream}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {departmentStatisticsTotal.dream}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {departmentStatisticsTotal.daySharing}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {departmentStatisticsTotal.internship}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {departmentStatisticsTotal.totalOffers}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {(
                      (departmentStatisticsTotal.uniqueCount /
                        departmentStatisticsTotal.supersetEnrolledCount) *
                      100
                    ).toFixed(2)}
                    %
                  </TableCell>
                  <TableCell sx={{ fontWeight: "800" }}>
                    {departmentStatisticsTotal.uniqueCount}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/*Salary*/}
          {shouldRender && (
            <SalaryCategorisation
              apiUrl={`${api_url}server/get_salary_categorisation.php?batch=${batch}&department=${department}`}
            />
          )}
          {/*Marquee*/}
          {shouldRender && (
            <MarqueeStudents
              apiUrl={`${api_url}/server/get_marquee_students.php?batch=${batch}&department=${department}`}
            />
          )}

          {/*Offer Summary*/}
          <div className="offer-summary-table">
            <h3>Offer Summary</h3>
            <TableContainer component={Paper}>
              <Button
                variant="contained"
                size="small"
                onClick={() => downloadExcel(extractOfferSummaryTableData())}
                style={{ backgroundColor: "#10793F" }}
              >
                Download As Excel
              </Button>
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
          <div className="offer-summary-graph" style={{ margin: "0 auto" }}>
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

          {/* offer under various categories comparision graph */}
          <div className="offer-summary-graph" style={{ margin: "0 auto" }}>
            <h3>Offers under various Categories comparision</h3>
            <FormControl className="form-control">
              <InputLabel htmlFor="batch">Compare To</InputLabel>{" "}
              <Select
                value={prevBatch}
                onChange={handlePrevBatchChange}
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
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={offersCategoriesChartComparisionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  angle={xAxisAngle}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="currentOffers" fill={colors[0]} name={`${batch}`}>
                  {offersCategoriesChartComparisionData.map((entry, index) => (
                    <Cell key={`cell-current-${index}`} />
                  ))}
                </Bar>
                <Bar
                  dataKey="prevOffers"
                  fill={colors[1]}
                  name={`${prevBatch}`}
                >
                  {offersCategoriesChartComparisionData.map((entry, index) => (
                    <Cell key={`cell-prev-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Student Statistics */}
          {shouldRender && (
            <StudentStatistics
              apiUrl={`${api_url}server/get_student_statistics.php?batch=${batch}&department=${department}`}
            />
          )}
          {/*Salary Statistics */}
          {shouldRender && (
            <SalaryStatistics
              apiUrl={`${api_url}server/get_salary_statistics.php?batch=${batch}&department=${department}`}
            />
          )}
          {/*Company Statistics */}
          <CompanyStatistics
            apiUrl={`${api_url}server/get_company_statistics.php?batch=${batch}&department=${department}`}
          />
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
