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

function EditFacultyDetails() {
  const [searchValue, setSearchValue] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [showSave, setShowSave] = useState(false);

  const styles = useStyles();

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "employee_id",
      headerName: "Employee ID",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "specialization",
      headerName: "Specialization",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          select
          SelectProps={{
            native: true,
          }}
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
          <option value="AI">AI</option>
          <option value="AI/ML">AI/ML</option>
          <option value="SWE">SWE</option>
        </TextField>
      ),
    },
    {
      field: "batch",
      headerName: "Batch",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "email_id",
      headerName: "Email Adress",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "section",
      headerName: "Section",
      flex: 1,
      minWidth: 150,
      editable: true,
    },

    {
      field: "additional_specialization",
      headerName: "Additional Specialization",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          select
          SelectProps={{
            native: true,
          }}
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
          <option value="AI">AI</option>
          <option value="AI/ML">AI/ML</option>
          <option value="SWE">SWE</option>
        </TextField>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchValue(value);

    // Make a request to the PHP file to get student details based on the register number
    fetch(`${api_url}server/get_faculties_by_search.php?employee_id=${value}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.faculty)) {
          const updatedFacultyData = data.faculty.map((faculty, index) => ({
            ...faculty,
            id: `faculty-${index}`,
          }));
          setFacultyData(updatedFacultyData);
        } else if (data.faculty) {
          // If data.student is not an array but exists, convert it to an array
          setFacultyData([{ ...data.faculty, id: "faculty-0" }]);
        } else {
          setFacultyData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching student details:", error);
        setFacultyData([]);
      });
  };

  const handleDoubleClick = () => {
    setShowSave(true);
  };

  const handleSave = () => {
    const updatedData = [...facultyData];

    // Send the updated data to the server
    updatedData.forEach((faculty) => {
      fetch(`${api_url}server/update_faculty_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(faculty),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Faculty updated successfully");
        })
        .catch((error) => {
          console.error("Error updating faculty:", error);
        });
    });

    setShowSave(false);
  };

  return (
    <div>
      <Navbar />
      <div className="edit-placed-container">
        <h1 className="edit-placed-title" style={{ textAlign: "center" }}>
          Edit Faculty Details
        </h1>
        <TextField
          fullWidth
          label="Search by Employee ID"
          variant="outlined"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {facultyData.map((faculty) => (
        <div className="edit-placed-data-grid-container" key={faculty.id}>
          <DataGrid
            rows={facultyData}
            key={JSON.stringify(facultyData)}
            columns={columns}
            checkboxSelection={false}
            disableSelectionOnClick
            onCellDoubleClick={handleDoubleClick}
            processRowUpdate={(updatedRow, originalRow) => {
              const updatedData = facultyData.map((student) => {
                console.log("sfs", student);
                if (student.id === originalRow.id) {
                  return updatedRow;
                }
                return student;
              });
              setFacultyData(updatedData);
              console.log("Row updated:", updatedRow);
            }}
            onProcessRowUpdateError={(error) => {
              console.log(error);
            }}
            hideFooterPagination
          />

          {showSave && <Button onClick={handleSave}>Save</Button>}

          <h5>
            Scroll horizontally to view all details | Double click to edit
          </h5>
        </div>
      ))}
    </div>
  );
}

export default EditFacultyDetails;
