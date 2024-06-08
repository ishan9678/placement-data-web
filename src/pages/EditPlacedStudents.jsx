import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/pages.css";

const useStyles = makeStyles({
  option: {
    color: "black !important",
  },
});

function EditPlacedStudents() {
  const [searchValue, setSearchValue] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const [department, setDepartment] = useState("");

  const styles = useStyles();

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setDepartment(data.department);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const columns = [
    {
      field: "registerNumber",
      headerName: "Register Number",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "section",
      headerName: "Section",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "specialization",
      headerName: "Specialization",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "careerOption",
      headerName: "Career Option",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderEditCell: renderSelectCell([
        "Superset Enrolled",
        "Higher Studies",
        "Entrepreneur",
        "Arrear/Detained",
        "None",
      ]),
    },
    {
      field: "facultyAdvisorName",
      headerName: "Faculty Advisor",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "batch",
      headerName: "Batch",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderEditCell: renderSelectCell([
        "Marquee",
        "Super Dream",
        "Dream",
        "Day Sharing",
        "Internship",
        "None",
      ]),
    },
    {
      field: "package",
      headerName: "Package in LPA",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
  ];

  function renderSelectCell(options) {
    return (params) => (
      <TextField
        select
        SelectProps={{ native: true }}
        value={params.value}
        onChange={(e) => {
          const newValue = e.target.value;
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: newValue,
          });
        }}
        fullWidth
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>
    );
  }

  const handleSearch = (value) => {
    setSearchValue(value);
    fetch(
      `${api_url}server/get_students_by_search.php?registerNumber=${value}&department=${department}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          const studentData = formatStudentData(data.data);
          setStudentData(studentData);
        } else {
          setStudentData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching student details:", error);
        setStudentData([]);
      });
  };

  function formatStudentData(data) {
    const student = data.student;
    const placements = data.placements;
    if (placements.length === 0) {
      // If there are no placements, return the student data as a single entry
      return [
        {
          ...student,
          id: student.registerNumber, // Use the register number as the ID
          companyName: "", // Add default values for editable fields
          category: "",
          package: "",
        },
      ];
    }
    // If there are placements, map the placements to include student data
    return placements.map((placement) => ({
      ...student,
      ...placement,
      id: placement.id, // Use the actual placement id
    }));
  }

  const handleDoubleClick = () => {
    setShowSave(true);
  };

  const handleSave = () => {
    // Send the updated data to the server
    studentData.forEach((student) => {
      fetch(`${api_url}server/update_student_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Student updated successfully");
        })
        .catch((error) => {
          console.error("Error updating student:", error);
        });
    });

    setShowSave(false);
  };

  return (
    <div>
      <Navbar />
      <div className="edit-placed-container">
        <h1 className="edit-placed-title" style={{ textAlign: "center" }}>
          Edit Placed Student Details in {department}
        </h1>
        <TextField
          fullWidth
          label="Search by Register Number"
          variant="outlined"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {studentData.length !== 0 && (
        <div className="edit-placed-data-grid-container">
          <DataGrid
            rows={studentData}
            columns={columns}
            checkboxSelection={false}
            disableSelectionOnClick
            onCellDoubleClick={handleDoubleClick}
            processRowUpdate={(updatedRow, originalRow) => {
              const updatedData = studentData.map((student) => {
                if (student.id === originalRow.id) {
                  return updatedRow;
                }
                return student;
              });
              setStudentData(updatedData);
              console.log("Row updated:", updatedRow);
            }}
            onProcessRowUpdateError={(error) => {
              console.log(error);
            }}
            hideFooterPagination
          />

          {showSave && <Button onClick={handleSave}>Save</Button>}

          <h5>
            Scroll horizontally to view all details | Double click to edit |
            Only Career Option, Company Name, Category editable
          </h5>
        </div>
      )}
      {studentData.length === 0 && searchValue.length !== 0 && (
        <h4 style={{ textAlign: "center" }}>No Student found</h4>
      )}
    </div>
  );
}

export default EditPlacedStudents;
