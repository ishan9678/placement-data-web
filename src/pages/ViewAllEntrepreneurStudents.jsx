import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/pages.css";

function ViewAllEntrepreneurStudents() {
  const [entrepreneurStudents, setEntrepreneurStudents] = useState([]);
  const [facultyAdvisors, setFacultyAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [role, setRole] = useState();
  const [isTempAcc, setIsTempAcc] = useState(0);
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setRole(data.role);
          setIsTempAcc(data.isTempAcc);
          setDepartment(data.department);
          setBatch(data.batch);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // Fetch faculty advisors
    fetch(
      `${api_url}server/get_faculty_advisors.php?department=${department}&batch=${batch}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setFacultyAdvisors(data.facultyAdvisors);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [department, batch]);

  const fetchHigherStudiesStudents = (advisor, department, batch) => {
    let url = `${api_url}server/get_entrepreneur_student_details.php?`;
    url += "department=" + department + "&";
    url += "batch=" + batch + "&";
    if (advisor) {
      url += `advisor=${advisor}`;
    }
    console.log(url);

    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setEntrepreneurStudents(data.students);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  const handleAdvisorChange = (event) => {
    const advisor = event.target.value;
    setSelectedAdvisor(advisor);
    fetchHigherStudiesStudents(advisor, department, batch);
  };

  const handleBatchChange = (event) => {
    setBatch(event.target.value);
    const batch = event.target.value;
    fetchHigherStudiesStudents(selectedAdvisor, department, batch);
  };

  return (
    <div>
      <Navbar />
      <div className="view-all-placed-container" style={{ maxHeight: "500px" }}>
        <h2 className="view-all-placed-title">
          Entrepreneur Students In {department}
        </h2>
        <div style={{ display: "flex" }}>
          <FormControl
            className="view-all-placed-select"
            // style={{ minWidth: 220 }}
          >
            <InputLabel>Select Faculty Advisor</InputLabel>
            <Select
              value={selectedAdvisor}
              onChange={handleAdvisorChange}
              style={{ color: "black" }}
            >
              <MenuItem value="">
                {" "}
                <em style={{ color: "black" }}>None</em>
              </MenuItem>
              {facultyAdvisors.map((advisor) => (
                <MenuItem
                  key={advisor.id}
                  value={advisor.name}
                  style={{ color: "black" }}
                >
                  {advisor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

        <TableContainer
          className="view-all-placed-table"
          component={Paper}
          style={{ overflowX: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Register No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Faculty Advisor</TableCell>
                <TableCell>Batch</TableCell>
                {(role === "Placement Coordinator" ||
                  role === "Academic Advisor" ||
                  isTempAcc === 1) && <TableCell>File</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {entrepreneurStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.registerNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.facultyAdvisorName}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  {(role === "Placement Coordinator" ||
                    role === "Academic Advisor" ||
                    isTempAcc === 1) &&
                  student.file ? (
                    <TableCell>
                      {student.file}
                      <div
                        style={{
                          marginLeft: "10px",
                        }}
                      >
                        <Button
                          variant="contained"
                          component="a"
                          href={`${api_url}server/download_alternative.php?registerNumber=${student.registerNumber}`}
                          download
                          size="small"
                        >
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5}>
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  <strong>{entrepreneurStudents.length} students</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ViewAllEntrepreneurStudents;
