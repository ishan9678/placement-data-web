import React, { useState } from "react";
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
import api_url from "../apiconfig";

const StudentList = ({ students, onEdit }) => {
  const [fileStates, setFileStates] = useState(
    students.map((student) => ({
      selected: !!student.file,
      fileName: student.file ? student.file.split("/")[1] : "",
      file: null,
    }))
  );

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const newFileStates = [...fileStates];
    newFileStates[index] = { selected: true, fileName: file.name, file: file };
    setFileStates(newFileStates);

    // Create a new FormData instance
    const formData = new FormData();
    // Add the file to the form data
    formData.append("file", file);
    formData.append("registerNumber", students[index].registerNumber);

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
    <TableContainer component={Paper} sx={{ marginTop: "5px" }}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#00afef",
              color: "white",
            }}
          >
            <TableCell>Register Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Specialization</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell>Career Option</TableCell>
            <TableCell>File</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell>{student.registerNumber}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.section}</TableCell>
              <TableCell>{student.specialization}</TableCell>
              <TableCell>{student.batch}</TableCell>
              <TableCell>{student.careerOption}</TableCell>
              <TableCell>
                {!fileStates[index].selected ? (
                  <>
                    <label htmlFor={`file-input-${index}`}>
                      <Button variant="contained" component="span">
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
                ) : (
                  <>
                    <span>{fileStates[index].fileName}</span>
                    <Button
                      variant="contained"
                      component="a"
                      href={`${api_url}server/download.php?registerNumber=${student.registerNumber}`}
                      download
                      sx={{ marginTop: "10px" }}
                    >
                      Download
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentList;
