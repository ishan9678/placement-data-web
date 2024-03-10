import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api_url from "../apiconfig";

const AddStudentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    registerNumber: "",
    name: "",
    section: "",
    specialization: "",
    batch: "",
    careerOption: "",
    facultyAdvisorName: "",
  });

  const [user, setUser] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate and submit the form data
    onSubmit(formData);

    // Reset the form
    setFormData({
      registerNumber: "",
      name: "",
      section: user ? user.section : "",
      specialization: user ? user.specialization : "",
      batch: user ? user.batch : "",
      careerOption: "",
      facultyAdvisorName: user ? user.name : "",
    });

    console.log(formData);

    // Make a POST request to the server to add the student
    fetch(`${api_url}server/add_student_details.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          console.log("User's Name:", data.name);
          setUser(data); // Store the entire user object for reference
          // Set the initial facultyAdvisorName value
          setFormData((prevData) => ({
            ...prevData,
            facultyAdvisorName: data.name,
            section: data.section,
            specialization: data.specialization,
            batch: data.batch,
          }));
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Register Number"
        fullWidth
        margin="dense"
        name="registerNumber"
        value={formData.registerNumber}
        onChange={handleChange}
      />
      <TextField
        label="Name"
        fullWidth
        margin="dense"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <TextField
        label="Section"
        fullWidth
        margin="dense"
        name="section"
        value={formData.section}
        onChange={handleChange}
        disabled
      />
      <TextField
        label="Specialization"
        fullWidth
        margin="dense"
        name="specialization"
        value={formData.specialization}
        onChange={handleChange}
        disabled
      />
      <TextField
        label="Batch"
        fullWidth
        margin="dense"
        name="batch"
        value={formData.batch}
        onChange={handleChange}
        disabled
      />
      <FormControl fullWidth margin="dense">
        <InputLabel id="career-option-label">Career Option</InputLabel>
        <Select
          labelId="career-option-label"
          label="Career Option"
          name="careerOption"
          value={formData.careerOption}
          onChange={handleChange}
        >
          <MenuItem value="Superset Enrolled">Superset Enrolled</MenuItem>
          <MenuItem value="Higher Studies">Higher Studies</MenuItem>
          <MenuItem value="Entrepreneur">Entrepreneur</MenuItem>
          <MenuItem value="Arrear/Detained">Arrear/Detained</MenuItem>
          <MenuItem value="Others">Others</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="dense"
        name="facultyAdvisorName"
        value={formData.facultyAdvisorName}
        onChange={handleChange}
        disabled
      />
      <Button type="submit" variant="contained" color="primary">
        Add Student
      </Button>
    </form>
  );
};

export default AddStudentForm;
