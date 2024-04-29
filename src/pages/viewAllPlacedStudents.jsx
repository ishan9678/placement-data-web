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

function ViewAllPlacedStudents() {
  const [placedStudents, setPlacedStudents] = useState([]);
  const [facultyAdvisors, setFacultyAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [role, setRole] = useState();

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setRole(data.role);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // Fetch faculty advisors
    fetch(`${api_url}server/get_faculty_advisors.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setFacultyAdvisors(data.facultyAdvisors);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));

    // Fetch companies
    fetch(`${api_url}server/get_companies.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setCompanies(data.companies);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const fetchPlacedStudents = (advisor, company) => {
    let url = `${api_url}server/get_placed_student_details.php?`;
    if (advisor) {
      url += `advisor=${advisor}`;
      if (company) {
        url += `&company=${company}`;
      }
    } else if (company) {
      url += `company=${company}`;
    }

    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setPlacedStudents(data.students);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  const handleAdvisorChange = (event) => {
    const advisor = event.target.value;
    setSelectedAdvisor(advisor);
    fetchPlacedStudents(advisor, selectedCompany);
  };

  const handleCompanyChange = (event) => {
    const company = event.target.value;
    setSelectedCompany(company);
    fetchPlacedStudents(selectedAdvisor, company); // Pass selectedAdvisor here
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxHeight: "720px", marginTop: "100px" }}>
        <h2>Placed Students In All Branches</h2>
        <div style={{ display: "flex" }}>
          <FormControl style={{ minWidth: 220, marginRight: "10px" }}>
            <InputLabel>Select Faculty Advisor</InputLabel>
            <Select
              value={selectedAdvisor}
              onChange={handleAdvisorChange}
              style={{ color: "black" }}
            >
              <MenuItem value="">
                {" "}
                <em>None</em>
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

          <FormControl style={{ minWidth: 220 }}>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={selectedCompany}
              onChange={handleCompanyChange}
              style={{ color: "black" }}
            >
              <MenuItem value="">
                {" "}
                <em>None</em>
              </MenuItem>
              {companies.map((company) => (
                <MenuItem
                  key={company}
                  value={company}
                  style={{ color: "black" }}
                >
                  {company}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Register No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Faculty Advisor</TableCell>
                <TableCell>Batch</TableCell>
                {role === "Placement Coordinator" && (
                  <TableCell>File</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {placedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.registerNumber}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.companyName}</TableCell>
                  <TableCell>{student.category}</TableCell>
                  <TableCell>{student.package} LPA</TableCell>
                  <TableCell>{student.facultyAdvisor}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  {role === "Placement Coordinator" && student.file ? (
                    <TableCell>
                      {student.file}
                      <div
                        style={{ display: "inline-block", marginLeft: "10px" }}
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
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ViewAllPlacedStudents;
