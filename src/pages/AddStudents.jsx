import React, { useState } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import {
  Button,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import ExcelTemplate from "../excel-templates/add-students.xlsx";
import api_url from "../apiconfig";
import Navbar from "../components/Navbar";

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
    key: "name",
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
    label: "Department",
    key: "department",
    alternateMatches: [],
    fieldType: {
      type: "input",
    },
    example: "CINTEL",
    validations: [
      {
        rule: "required",
        errorMessage: "Department is required",
        level: "error",
      },
    ],
  },
  {
    label: "Specialization",
    key: "specialization",
    alternateMatches: [],
    fieldType: {
      type: "input",
    },
    example: "AI",
    validations: [
      {
        rule: "required",
        errorMessage: "Specialization is required",
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
  {
    label: "Career Option",
    key: "careerOption",
    alternateMatches: [],
    fieldType: {
      type: "input",
    },
    example: "Superset Enrolled",
    validations: [
      {
        rule: "required",
        errorMessage: "Category is required",
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
];

function AddStudents() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitData, setSubmitData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onClose = () => {
    setIsOpen(false);
    console.log("Flow closed without reaching submit");
  };

  const onSubmit = (data, file) => {
    if (data.validData.length > 0) {
      console.log("Submitted data:", data.validData);
      setSubmitData(data.validData);
      setErrorMessage("");
      setSuccessMessage("");
      handleSubmit(data.validData); // Call handleSubmit with valid data
    } else {
      console.log("Validation Error: Please provide valid data");
      setErrorMessage("Validation Error: Please provide valid data");
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (validData) => {
    try {
      const response = await fetch(`${api_url}server/add_student_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Placed student details added successfully");
        // Reset form data or perform any other actions upon success
      } else {
        console.error("Error:", data.message);
        // Handle error, show error message, etc.
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Handle fetch error, show error message, etc.
    }
  };

  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" gutterBottom>
        Add Students
      </Typography>
      <Box
        className="buttons-container"
        display="flex"
        justifyContent="center"
        marginBottom={2}
      >
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: 16, marginTop: "1rem" }}
        >
          <a href={ExcelTemplate} download="ExcelTemplate.csv">
            {" "}
            Download Excel Template
          </a>
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsOpen(true)}
          style={{ marginTop: "1rem" }}
        >
          Upload Excel Sheet
        </Button>
      </Box>
      {errorMessage && (
        <Typography variant="body1" color="error" align="center" gutterBottom>
          {errorMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography variant="body1" color="success" align="center" gutterBottom>
          {successMessage}
        </Typography>
      )}
      {submitData.length > 0 && (
        <Table>
          {/* Table headers */}
          <TableHead>
            <TableRow>
              {fields.map((field) => (
                <TableCell key={field.key}>{field.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* Table body */}
          <TableBody>
            {submitData.map((row, index) => (
              <TableRow key={index}>
                {fields.map((field) => (
                  <TableCell key={field.key}>{row[field.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <ReactSpreadsheetImport
        isOpen={isOpen}
        onClose={onClose}
        fields={fields}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default AddStudents;
