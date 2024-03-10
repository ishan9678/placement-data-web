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
import "../styles/signup.css";
import api_url from "../apiconfig";
import srm_logo from "../assets/srm_logo.png";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    emailId: "",
    role: "",
    specialization: "",
    batch: "",
    password: "",
    section: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.employeeId ||
      !formData.emailId ||
      !formData.role ||
      !formData.specialization ||
      !formData.batch ||
      !formData.password
    ) {
      console.error("All fields are required");
      return;
    }

    console.log(formData);

    try {
      const response = await fetch(`${api_url}server/process_signup.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        console.log(data.message);
        navigate("/");
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
      <div>
        {/* <div className="logo">
          <img src={srm_logo} alt="logo" />
        </div> */}
        <form onSubmit={handleSignup} className="form-container">
          <h2 className="form-heading">Registration</h2>
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
            <InputLabel htmlFor="role">Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              label="Role"
            >
              <MenuItem value="Faculty Advisor">Faculty Advisor</MenuItem>
              <MenuItem value="HOD">HOD</MenuItem>
              <MenuItem value="Academic Advisor">Academic Advisor</MenuItem>
              <MenuItem value="Placement Coordinator">
                Placement Coordinator
              </MenuItem>
              <MenuItem value="Program Coordinator">
                Program Coordinator
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" className="form-control">
            <InputLabel htmlFor="specialization">Specialization</InputLabel>
            <Select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              label="Specialization"
            >
              <MenuItem value="AI">AI</MenuItem>
              <MenuItem value="AIML">AI/ML</MenuItem>
              <MenuItem value="SWE">SWE</MenuItem>
              <MenuItem value="NA">NA</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" className="form-control">
            <InputLabel htmlFor="batch">Batch</InputLabel>
            <Select
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              required
              label="Batch"
            >
              {[...Array(2051 - 2022).keys()].map((year) => (
                <MenuItem key={2022 + year} value={2022 + year}>
                  {2022 + year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.role === "Faculty Advisor" && (
            <TextField
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              className="form-control"
            />
          )}
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
              Register
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
