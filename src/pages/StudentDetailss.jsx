import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import api_url from "../apiconfig";

function StudentDetailss() {
  // const [students, setStudents] = useState([]);
  // const [newStudents, setNewStudents] = useState([]);
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   fetch(`${api_url}server/get_student_details.php`, {
  //     method: "GET",
  //     credentials: "include",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.status === "success") {
  //         setStudents(data.students);
  //       } else {
  //         console.error("Error:", data.message);
  //       }
  //     })
  //     .catch((error) => console.error("Fetch error:", error));
  // }, []);

  // useEffect(() => {
  //   fetch(`${api_url}server/get_user_info.php`, {
  //     method: "GET",
  //     credentials: "include",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.status === "success") {
  //         console.log("User's Name:", data.name);
  //         setUser(data);
  //       } else {
  //         console.error("Error:", data.message);
  //       }
  //     })
  //     .catch((error) => console.error("Fetch error:", error));
  // }, []);

  // const handleAddRow = () => {
  //   const newRowData = {
  //     registerNumber: "",
  //     name: "",
  //     section: user ? user.section : "",
  //     specialization: user ? user.specialization : "",
  //     batch: user ? user.batch : "",
  //     careerOption: "",
  //     facultyAdvisorName: user ? user.name : "",
  //   };
  //   setNewStudents([...newStudents, newRowData]);
  // };

  // const handleChange = (index, field, value) => {
  //   const updatedNewStudents = newStudents.map((student, idx) => {
  //     if (idx === index) {
  //       return { ...student, [field]: value };
  //     }
  //     return student;
  //   });
  //   setNewStudents(updatedNewStudents);
  // };

  // const handleSaveRow = () => {
  //   if (newStudents.length > 0) {
  //     newStudents.forEach((newRow) => {
  //       fetch(`${api_url}server/add_student_details.php`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newRow),
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           if (data.status === "success") {
  //             console.log("Student details added successfully!");
  //           } else {
  //             console.error("Error:", data.message);
  //           }
  //         })
  //         .catch((error) => console.error("Fetch error:", error));
  //     });

  //     setStudents([...students, ...newStudents]);
  //     setNewStudents([]);
  //   }
  // };

  const fields = [
    {
      label: "Registration Number",
      key: "registerNumber",
      alternateMatches: [],
      fieldType: {
        type: "input",
      },
      example: "RA2111047010042",
      validations: [
        {
          rule: "required",
          errorMessage: "Registration Number is required",
          regex: /^RA\d+$/,
          level: "error",
        },
      ],
    },
    {
      label: "Full Name (AS PER ATTENDANCE)",
      key: "fullName",
      alternateMatches: [],
      fieldType: {
        type: "input",
      },
      example: "John Doe",
      validations: [
        {
          rule: "required",
          errorMessage: "Name is required",
          level: "error",
        },
      ],
    },
    {
      label: "Section",
      key: "section",
      alternateMatches: [],
      fieldType: {
        type: "input",
      },
      example: "A",
      validations: [
        {
          rule: "required",
          errorMessage: "Section is required",
          level: "error",
        },
      ],
    },
    {
      label: "Company Name",
      key: "companyName",
      alternateMatches: [],
      fieldType: {
        type: "input",
      },
      example: "ABC Corp",
      validations: [
        {
          rule: "required",
          errorMessage: "Company Name is required",
          level: "error",
        },
      ],
    },
    {
      label: "Category",
      key: "category",
      alternateMatches: [],
      fieldType: {
        type: "input",
      },
      example: "Marquee",
      validations: [
        {
          rule: "required",
          errorMessage: "Category is required",
          level: "error",
        },
      ],
    },
    {
      label: "Package",
      key: "package",
      alternateMatches: [],
      fieldType: {
        type: "input",
      },
      example: "8 LPA",
      validations: [
        {
          rule: "required",
          errorMessage: "Package is required",
          level: "error",
        },
      ],
    },
    {
      label: "Faculty Advisor",
      key: "facultyAdvisorName",
      alternateMatches: [],
      fieldType: {
        type: "input",
      },
      example: "Mr John Doe",
      validations: [
        {
          rule: "required",
          errorMessage: "Faculty Advisor Name is required",
          level: "error",
        },
      ],
    },
    {
      label: "Batch",
      key: "batch",
      alternateMatches: [],
      fieldType: {
        type: "input",
      },
      example: "2025",
      validations: [
        {
          rule: "required",
          errorMessage: "Batch year is required",
          level: "error",
        },
      ],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
    console.log("Flow closed without reaching submit");
  };

  const onSubmit = (data, file) => {
    console.log("Submitted data:", data);
  };

  return (
    <>
      <ReactSpreadsheetImport
        isOpen={isOpen}
        onClose={onClose}
        fields={fields}
        onSubmit={onSubmit}
      />
      {/* <Paper>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <TableContainer style={{ maxHeight: "600px", width: "900px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Register Number</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Career Option</TableCell>
                  <TableCell>Faculty Advisor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.registerNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>{student.specialization}</TableCell>
                    <TableCell>{student.batch}</TableCell>
                    <TableCell>{student.careerOption}</TableCell>
                    <TableCell>{student.facultyAdvisorName}</TableCell>
                  </TableRow>
                ))}
                {newStudents.length > 0 &&
                  newStudents.map((newRow, index) => (
                    <TableRow key={index} id={`new-row-${index}`}>
                      <TableCell>
                        <TextField
                          size="small"
                          value={newRow.registerNumber}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "registerNumber",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={newRow.name}
                          onChange={(e) =>
                            handleChange(index, "name", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>{newRow.section}</TableCell>
                      <TableCell>{newRow.specialization}</TableCell>
                      <TableCell>{newRow.batch}</TableCell>
                      <TableCell>
                        <Select
                          value={newRow.careerOption}
                          onChange={(e) =>
                            handleChange(index, "careerOption", e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Choose
                          </MenuItem>
                          <MenuItem value="Superset Enrolled">
                            Superset Enrolled
                          </MenuItem>
                          <MenuItem value="Higher Studies">
                            Higher Studies
                          </MenuItem>
                          <MenuItem value="Entrepreneur">Entrepreneur</MenuItem>
                          <MenuItem value="Arrear/Detained">
                            Arrear/Detained
                          </MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>{newRow.facultyAdvisorName}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "1rem" }}
            onClick={handleAddRow}
          >
            Add
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveRow}>
            Save
          </Button>
        </div>
      </Paper> */}
    </>
  );
}

export default StudentDetailss;
