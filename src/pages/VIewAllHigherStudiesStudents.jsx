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

function ViewAllHigherStudiesStudents() {
  const [higherStudiesStudents, setHigherStudiesStudents] = useState([]);
  const [facultyAdvisors, setFacultyAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [role, setRole] = useState();
  const [isTempAcc, setIsTempAcc] = useState(0);
  const [department, setDepartment] = useState("");

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
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // Fetch faculty advisors
    fetch(
      `${api_url}server/get_faculty_advisors.php?department=${department}`,
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
  }, [department]);

  const fetchHigherStudiesStudents = (advisor, department) => {
    let url = `${api_url}server/get_higher_studies_student_details.php?`;
    url += "department=" + department + "&";
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
          setHigherStudiesStudents(data.students);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  const handleAdvisorChange = (event) => {
    const advisor = event.target.value;
    setSelectedAdvisor(advisor);
    fetchHigherStudiesStudents(advisor, department);
  };

  return (
    <div>
      <Navbar />
      <div className="view-all-placed-container" style={{ maxHeight: "500px" }}>
        <h2 className="view-all-placed-title">
          Higher Studies Students In {department}
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
                {(role === "Placement Coordinator" || isTempAcc === 1) && (
                  <TableCell>File</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {higherStudiesStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.registerNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.facultyAdvisorName}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  {(role === "Placement Coordinator" || isTempAcc === 1) &&
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
                          href={`${api_url}server/download.php?registerNumber=${student.registerNumber}`}
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
                  <strong>{higherStudiesStudents.length} students</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ViewAllHigherStudiesStudents;
