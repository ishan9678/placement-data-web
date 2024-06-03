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
  Input,
} from "@mui/material";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/pages.css";

function ViewHigherStudiesStudents() {
  const [higherStudiesStudents, setHigherStudiesStudents] = useState([]);
  const [facultyAdvisorName, setFacultyAdvisorName] = useState(null);
  const [fileStates, setFileStates] = useState([]);

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
    if (facultyAdvisorName) {
      // Fetch consolidated report data
      fetch(
        `${api_url}server/get_higher_studies_student_details.php?advisor=${facultyAdvisorName}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setHigherStudiesStudents(data.students);

            const initialFileStates = data.students.map((student) => ({
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
  }, [facultyAdvisorName]);

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
    formData.append(
      "registerNumber",
      higherStudiesStudents[index].registerNumber
    );

    // Send the file to the server
    fetch(`${api_url}server/upload_alternative.php`, {
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
    fetch(`${api_url}server/delete_alternative.php`, {
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
          const index = higherStudiesStudents.findIndex(
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

  return (
    <div style={{ maxHeight: "720px" }}>
      <Navbar />
      <div>
        <h2 style={{ textAlign: "center" }}>Higher Studies Student Details</h2>
        <TableContainer className="fa-students-table" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Register No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Career Option</TableCell>
                <TableCell>Faculty Advisor</TableCell>
                <TableCell sx={{ textAlign: "center" }}>File</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {higherStudiesStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{student.registerNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.specialization}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>{student.careerOption}</TableCell>
                  <TableCell>{student.facultyAdvisorName}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {fileStates[index]?.selected ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>{fileStates[index]?.fileName}</span>
                          <div style={{ marginLeft: "10px" }}>
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

export default ViewHigherStudiesStudents;
