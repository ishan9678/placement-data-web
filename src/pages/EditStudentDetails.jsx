import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../components/Navbar";
import api_url from "../apiconfig";

const useStyles = makeStyles({
  option: {
    color: "black !important",
  },
});

function EditStudentDetails() {
  const [searchValue, setSearchValue] = useState("");
  // const [editRowsModel, setEditRowsModel] = useState({});
  const [studentData, setStudentData] = useState([]);
  const [showSave, setShowSave] = useState(false);

  const styles = useStyles();

  const columns = [
    {
      field: "registerNumber",
      headerName: "Register Number",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "name",
      headerName: "Name",
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
    // {
    //   field: "specialization",
    //   headerName: "Specialization",
    //   flex: 1,
    //   minWidth: 150,
    //   editable: true,
    // },
    {
      field: "department",
      headerName: "Department",
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
          <option value="CINTEL">CINTEL</option>
          <option value="DSBS">DSBS</option>
          <option value="CTECH">CTECH</option>
          <option value="NWC">NWC</option>
        </TextField>
      ),
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
      field: "careerOption",
      headerName: "Career Option",
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
          <option value="Superset Enrolled">Superset Enrolled</option>
          <option value="Higher Studies">Higher Studies</option>
          <option value="Entrepreneur">Entrepreneur</option>
          <option value="Arrear/Detained">Arrear/Detained</option>
          <option value="None">None</option>
        </TextField>
      ),
    },
    {
      field: "facultyAdvisorName",
      headerName: "Faculty Advisor",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "batch",
      headerName: "Batch",
      flex: 1,
      minWidth: 150,
      editable: true,
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
          <option value="Marquee">Marquee</option>
          <option value="Super Dream">Super Dream</option>
          <option value="Dream">Dream</option>
          <option value="Day Sharing">Day Sharing</option>
          <option value="Internship">Internship</option>
        </TextField>
      ),
    },
    {
      field: "package",
      headerName: "Package in LPA",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
  ];

  const handleSearch = (value) => {
    setSearchValue(value);

    // Make a request to the PHP file to get student details based on the register number
    fetch(`${api_url}server/get_students_by_search.php?registerNumber=${value}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.student)) {
          const updatedStudentData = data.student.map((student, index) => ({
            ...student,
            id: `student-${index}`,
          }));
          setStudentData(updatedStudentData);
        } else if (data.student) {
          // If data.student is not an array but exists, convert it to an array
          setStudentData([{ ...data.student, id: "student-0" }]);
        } else {
          setStudentData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching student details:", error);
        setStudentData([]);
      });
  };

  // const handleDoubleClick = (params) => {
  //   const id = params.id;
  //   const row = params.row;

  //   const newModel = {
  //     ...editRowsModel,
  //     [id]: { ...row },
  //   };
  //   setEditRowsModel(newModel);

  //   console.groupEnd();
  // };

  const handleDoubleClick = () => {
    setShowSave(true);
  };

  const handleSave = () => {
    // Create a copy of the studentData
    const updatedData = [...studentData];

    // Update the edited rows in the updatedData
    // Object.keys(editRowsModel).forEach((id) => {
    //   const editedRow = updatedData.find((student) => student.id === id);
    //   if (editedRow) {
    //     editedRow[Object.keys(editRowsModel[id])[0]] =
    //       editRowsModel[id][Object.keys(editRowsModel[id])[0]].value;
    //   }
    // });

    // Send the updated data to the server
    updatedData.forEach((student) => {
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

    // // Update the state
    // setStudentData(updatedData);
    // setEditRowsModel({});
  };

  return (
    <div>
      <Navbar />
      <h1 style={{ textAlign: "center" }}>Edit Student Details</h1>
      <div style={{ minWidth: "60rem" }}>
        <TextField
          fullWidth
          label="Search by Register Number"
          variant="outlined"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {studentData.map((student) => (
        <div key={student.id} style={{ height: 400, maxWidth: "85rem" }}>
          <DataGrid
            rows={studentData}
            key={JSON.stringify(studentData)}
            columns={columns}
            checkboxSelection={false}
            disableSelectionOnClick
            // editRowsModel={editRowsModel}
            onCellDoubleClick={handleDoubleClick}
            processRowUpdate={(updatedRow, originalRow) => {
              const updatedData = studentData.map((student) => {
                console.log("sfs", student);
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
            Scroll horizontally to view all details | Double click to edit
          </h5>
        </div>
      ))}
    </div>
  );
}

export default EditStudentDetails;
