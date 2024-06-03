import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import EditStudentImage from "../assets/student_details.svg";
import { ClipLoader } from "react-spinners";
import api_url from "../apiconfig";
import Navbar from "../components/Navbar";
import "../styles/home.css";

const PlacementCoordinatorHome = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${api_url}server/get_user_info.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUser(data.name);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container ">
        <Card className="mainCard">
          <CardContent>
            {user !== null ? (
              <>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  style={{ textAlign: "center" }}
                >
                  {`Welcome, ${user}!`}
                </Typography>
                <div className="optionsContainer placement-coordinator-options-container">
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    className="mobile-greeting"
                    style={{ textAlign: "center" }}
                  >
                    {`Welcome, ${user}!`}
                  </Typography>

                  <OptionCard
                    title="Add Placed Student Details"
                    description="Click here to add details of newly placed students."
                    imageUrl={EditStudentImage}
                    action={() => navigate("/add-placed-student-details")}
                  />
                  <OptionCard
                    title="View Placed Student Details"
                    description="Click here to view details of placed students."
                    imageUrl={EditStudentImage}
                    action={() => navigate("/view-all-placed-student-details")}
                  />
                  <OptionCard
                    title="Edit Placed Student Details"
                    description="Click here to edit details of placed students."
                    imageUrl={EditStudentImage}
                    action={() => navigate("/edit-placed-students")}
                  />
                  <OptionCard
                    title="View Consolidated Report"
                    description="Click here to view the consolidated report."
                    imageUrl={EditStudentImage}
                    action={() => navigate("/consolidated-report")}
                  />
                </div>
              </>
            ) : (
              <ClipLoader
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const OptionCard = ({ title, description, imageUrl, action }) => {
  return (
    <Card className="optionCard">
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <img src={imageUrl} alt={title} className="cardImage" />
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ margin: "1rem 0" }}
        >
          {description}
        </Typography>
        <Button
          onClick={action}
          variant="contained"
          color="primary"
          className="button"
        >
          Go
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlacementCoordinatorHome;
