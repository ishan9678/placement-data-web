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

function ViewPlacedStudents() {
  const [placedStudents, setPlacedStudents] = useState([]);
  const [fileStates, setFileStates] = useState([]);

  useEffect(() => {
    // Fetch consolidated report data
    fetch(`${api_url}server/get_placed_student_details.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setPlacedStudents(data.students);

          // Set initial state for fileStates after placedStudents is populated
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
  }, []);

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const newFileStates = [...fileStates];
    newFileStates[index] = { selected: true, fileName: file.name, file: file };
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

  return (
    <div>
      <Navbar />
      <div>
        <h2>Placed Students</h2>
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
                    {fileStates[index].selected ? (
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
