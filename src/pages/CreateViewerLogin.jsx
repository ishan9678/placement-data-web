import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/signup.css";
import api_url from "../apiconfig";
import Navbar from "../components/Navbar";
import "../styles/pages.css";

const CreateViewerLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    emailId: "",
    department: "",
    batch: "2025",
    password: "",
    section: "",
    expirationDate: null, // Add a new field for expiration date
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Add a new handler for the expiration date
  const handleDateChange = (date) => {
    setFormData((prevData) => ({ ...prevData, expirationDate: date }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.employeeId ||
      !formData.emailId ||
      !formData.department ||
      !formData.password
    ) {
      console.error("All fields are required");
      return;
    }

    if (!formData.emailId.endsWith("@srmist.edu.in")) {
      alert("Only SRMIST emails are allowed.");
      return;
    }

    console.log(formData);

    try {
      const response = await fetch(
        `${api_url}server/process_viewer_signup.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData).toString(),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        console.log(data.message);
        alert(data.message);
      } else {
        console.error("Signup failed:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-viewer-container">
        <form
          onSubmit={handleSignup}
          className="form-container"
          style={{ marginTop: "3rem" }}
        >
          <h2 className="form-heading">Create A Viewer Account</h2>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            className="form-control"
          />
          <TextField
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            className="form-control"
          />
          <TextField
            label="Email ID"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            className="form-control"
          />

          <FormControl fullWidth margin="normal" className="form-control">
            <InputLabel htmlFor="department">Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              label="Department"
              style={{ color: "black" }}
            >
              <MenuItem value="CINTEL" style={{ color: "black" }}>
                CINTEL
              </MenuItem>
              <MenuItem value="DSBS" style={{ color: "black" }}>
                DSBS
              </MenuItem>
              <MenuItem value="CTECH" style={{ color: "black" }}>
                CTECH
              </MenuItem>
              <MenuItem value="NWC" style={{ color: "black" }}>
                NWC
              </MenuItem>
            </Select>
          </FormControl>

          {/* Add the DatePicker field */}
          <div className="form-control">
            <DatePicker
              selected={formData.expirationDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Expiration Date"
              className="form-control date-picker"
              customInput={
                <TextField label="Account Expiration Date" fullWidth />
              }
            />
          </div>

          <div className="form-control">
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
          </div>

          <div className="button-container">
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#337ab7" }}
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateViewerLogin;
