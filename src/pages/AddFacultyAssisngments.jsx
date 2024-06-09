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

function AddFacultyAssignments() {
  const [searchValue, setSearchValue] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const [updatedRow, setUpdatedRow] = useState(null);
  const [employee_id, setEmployee_id] = useState("");

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
      editable: false,
    },
    {
      field: "email_id",
      headerName: "Email Address",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 150,
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
      field: "section",
      headerName: "Section",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
  ];

  const handleSearch = (value) => {
    setSearchValue(value);

    fetch(
      `${api_url}server/get_faculty_for_assignment.php?employee_id=${value}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.faculty)) {
          const updatedFacultyData = data.faculty.map((faculty, index) => ({
            ...faculty,
            id: `faculty-${index}`,
          }));
          setFacultyData(updatedFacultyData);
          setEmployee_id(data.faculty[0].employee_id);
        } else if (data.faculty) {
          setFacultyData([{ ...data.faculty, id: "faculty-0" }]);
        } else {
          setFacultyData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching faculty details:", error);
        setFacultyData([]);
      });
  };

  const handleDoubleClick = () => {
    setShowSave(true);
  };

  const handleSave = () => {
    if (!updatedRow) {
      console.error("No row has been updated");
      return;
    }

    fetch(
      `${api_url}server/add_faculty_assignments.php?employee_id=${employee_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedRow }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Faculty Assignment added successfully");
        alert("Faculty Assignment added successfully");
      })
      .catch((error) => {
        console.error("Error updating faculty:", error);
      });

    setShowSave(false);
  };

  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    const updatedData = facultyData.map((faculty) => {
      if (faculty.id === originalRow.id) {
        return updatedRow;
      }
      return faculty;
    });
    setFacultyData(updatedData);

    // Keep track of the updated row
    setUpdatedRow(updatedRow);

    return updatedRow;
  };

  return (
    <div>
      <Navbar />
      <div className="edit-placed-container">
        <h1 className="edit-placed-title" style={{ textAlign: "center" }}>
          Add Faculty Assignment
        </h1>
        <TextField
          fullWidth
          label="Search by Employee ID"
          variant="outlined"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {facultyData.length !== 0 && (
        <div className="edit-placed-data-grid-container">
          <DataGrid
            rows={facultyData}
            columns={columns}
            checkboxSelection={false}
            disableSelectionOnClick
            onCellDoubleClick={handleDoubleClick}
            processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.log(error);
            }}
            hideFooterPagination
          />
          {showSave && (
            <Button
              style={{
                marginTop: "16px",
                marginLeft: "50%",
                transform: "translateX(-50%)",
              }}
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Add Assignment
            </Button>
          )}
          <h5>
            Scroll horizontally to view all details | Double click to Add
            details
          </h5>
        </div>
      )}
    </div>
  );
}

export default AddFacultyAssignments;
