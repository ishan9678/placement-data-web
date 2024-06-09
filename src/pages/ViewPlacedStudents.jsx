import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Input,
} from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/pages.css";

function ViewPlacedStudents() {
  const [placedStudents, setPlacedStudents] = useState([]);
  const [facultyAdvisorName, setFacultyAdvisorName] = useState(null);
  const [fileStates, setFileStates] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [batch, setBatch] = useState("");

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setFacultyAdvisorName(data.name);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    fetch(`${api_url}server/get_facultyadvisor_assignments.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setAssignments(data.assignments);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    if (facultyAdvisorName && batch) {
      fetch(`${api_url}server/get_placed_student_details.php?batch=${batch}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            const filteredStudents = data.students.filter(
              (student) => student.facultyAdvisor === facultyAdvisorName
            );
            setPlacedStudents(filteredStudents);

            // Set initial state for fileStates after placedStudents is populated
            const initialFileStates = filteredStudents.map((student) => ({
              selected: !!student.file,
              fileName: student.file ? student.file.split("/")[1] : "",
              file: null,
            }));
            setFileStates(initialFileStates);
          } else {
            console.error("Error:", data.message);
          }
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  }, [facultyAdvisorName, batch]);

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const newFileStates = [...fileStates];
    newFileStates[index] = {
      selected: true,
      fileName: file.name,
      file: file,
    };
    setFileStates(newFileStates);

    // Create a new FormData instance
    const formData = new FormData();
    // Add the file to the form data
    formData.append("file", file);
    formData.append("registerNumber", placedStudents[index].registerNumber);

    // Send the file to the server
    fetch(`${api_url}server/upload.php`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteFile = (registerNumber) => {
    // Send a request to delete the file
    fetch(`${api_url}server/delete_file.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registerNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          // Update the fileStates state to reflect the deletion
          const newFileStates = [...fileStates];
          const index = placedStudents.findIndex(
            (student) => student.registerNumber === registerNumber
          );
          newFileStates[index] = {
            selected: false,
            fileName: "",
            file: null,
          };
          setFileStates(newFileStates);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  const handleBatchChange = useCallback((batch) => {
    setBatch(batch);
  }, []);

  return (
    <div style={{ maxHeight: "720px" }}>
      <Navbar />
      <div>
        <h2 style={{ textAlign: "center" }}>Placed Students Details</h2>
        <ButtonGroup
          variant="contained"
          disableElevation
          aria-label="Basic button group"
        >
          {assignments.map((assignment, index) => (
            <Button
              key={index}
              onClick={() => handleBatchChange(assignment.batch)}
            >
              {assignment.batch}
            </Button>
          ))}
        </ButtonGroup>
        <TableContainer className="fa-students-table" component={Paper}>
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
                <TableCell sx={{ textAlign: "center" }}>File</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {placedStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{student.registerNumber}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.companyName}</TableCell>
                  <TableCell>{student.category}</TableCell>
                  <TableCell>{student.package}</TableCell>
                  <TableCell>{student.facultyAdvisor}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {fileStates[index]?.selected ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>{fileStates[index].fileName}</span>
                          <div style={{ marginLeft: "10px" }}>
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
                          <div style={{ marginLeft: "10px" }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() =>
                                handleDeleteFile(student.registerNumber)
                              }
                              style={{ backgroundColor: "red" }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <label htmlFor={`file-input-${index}`}>
                          <Button
                            variant="contained"
                            component="span"
                            size="small"
                            style={{ width: "120px" }}
                          >
                            Choose File
                          </Button>
                        </label>
                        <Input
                          id={`file-input-${index}`}
                          type="file"
                          onChange={(event) => handleFileChange(index, event)}
                          style={{ display: "none" }}
                        />
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ViewPlacedStudents;
