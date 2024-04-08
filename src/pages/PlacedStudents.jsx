import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";

function PlacedStudents() {
  // State to manage form data
  const [formData, setFormData] = useState({
    registerNumber: "",
    fullName: "",
    section: "",
    companyName: "",
    category: "",
    package: "",
    facultyAdvisorName: "",
    batch: "",
  });

  const [facultyAdvisors, setFacultyAdvisors] = useState([]);

  const navigate = useNavigate(); // Initialize useHistory hook

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to your PHP backend
      const response = await fetch(
        `${api_url}server/add_placed_student_details.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        console.log("Placed student details added successfully");
        // Optionally, you can reset the form after a successful submission
        setFormData({
          registerNumber: "",
          fullName: "",
          section: "",
          companyName: "",
          category: "",
          package: "",
          facultyAdvisorName: "",
          batch: "",
        });
        navigate("/view-all-placed-student-details");
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    // Fetch faculty advisors
    fetch(`${api_url}server/get_faculty_advisors.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setFacultyAdvisors(data.facultyAdvisors);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <Card style={{ width: "30%" }}>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              style={{ marginBottom: "15px", marginTop: "15px" }}
            >
              Enter Placed Student Details
            </Typography>
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
                label="Full Name"
                fullWidth
                margin="dense"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextField
                label="Section"
                fullWidth
                margin="dense"
                name="section"
                value={formData.section}
                onChange={handleChange}
              />
              <TextField
                label="Company Name"
                fullWidth
                margin="dense"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ color: "black" }}
                >
                  <MenuItem value="marquee" style={{ color: "black" }}>
                    Marquee
                  </MenuItem>
                  <MenuItem value="superDream" style={{ color: "black" }}>
                    Super Dream
                  </MenuItem>
                  <MenuItem value="dream" style={{ color: "black" }}>
                    Dream
                  </MenuItem>
                  <MenuItem value="daySharing" style={{ color: "black" }}>
                    Day Sharing
                  </MenuItem>
                  <MenuItem value="internship" style={{ color: "black" }}>
                    Internship
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Package (LPA)"
                fullWidth
                margin="dense"
                name="package"
                value={formData.package}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="faculty-advisor-label">
                  Faculty Advisor
                </InputLabel>
                <Select
                  labelId="faculty-advisor-label"
                  label="Faculty Advisor"
                  fullWidth
                  name="facultyAdvisorName"
                  value={formData.facultyAdvisorName}
                  onChange={handleChange}
                  style={{ color: "black" }}
                >
                  <MenuItem disabled value="" style={{ color: "black" }}>
                    <em>Select Faculty Advisor</em>
                  </MenuItem>
                  {facultyAdvisors.map((advisor) => (
                    <MenuItem
                      key={advisor.id}
                      value={advisor.name}
                      style={{ color: "black" }}
                    >
                      {advisor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Batch"
                fullWidth
                margin="dense"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PlacedStudents;
