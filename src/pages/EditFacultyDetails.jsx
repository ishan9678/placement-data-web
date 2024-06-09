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
  const [updatedRow, setUpdatedRow] = useState(null);

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
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 150,
      editable: false,
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
      field: "email_id",
      headerName: "Email Address",
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
    {
      field: "additional_specialization",
      headerName: "Additional Specialization",
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
  ];

  const handleSearch = (value) => {
    setSearchValue(value);

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

    const updateType =
      updatedRow._id !== "user" ? "facultyadvisor_assignments" : "users";
    fetch(`${api_url}server/update_faculty_details.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...updatedRow, update_type: updateType }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Faculty updated successfully");
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
              Save
            </Button>
          )}
          <h5>
            Scroll horizontally to view all details | Double click to edit
          </h5>
        </div>
      )}
    </div>
  );
}

export default EditFacultyDetails;
