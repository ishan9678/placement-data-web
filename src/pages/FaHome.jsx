import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import PlacedStudentImage from "../assets/placed.svg";
import EditStudentImage from "../assets/student_details.svg";
import Navbar from "../components/Navbar";
import ClipLoader from "react-spinners/ClipLoader";
import api_url from "../apiconfig";
import "../styles/home.css";

const FaHome = () => {
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
          console.log("User's Name:", data.name);
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
      <div className="container">
        <Card className="mainCard">
          <CardContent>
            {user !== null ? (
              <>
                <Typography variant="h5" component="div" gutterBottom>
                  {`Welcome, ${user}!`}
                </Typography>
                <div className="optionsContainer fa-home-options-container">
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
                    title="Placed Student Details"
                    description="Click here to view details of placed students."
                    imageUrl={EditStudentImage}
                    action={() => navigate("/view-placed-student-details")}
                  />
                  <OptionCard
                    title="Higher Studies Student Details"
                    description="Click here to view details of higher studies students."
                    imageUrl={EditStudentImage}
                    action={() =>
                      navigate("/view-higher-studies-student-details")
                    }
                  />
                  <OptionCard
                    title="Entrepreneur Student Details"
                    description="Click here to view details of Entrepreneur students."
                    imageUrl={EditStudentImage}
                    action={() =>
                      navigate("/view-entrepreneur-student-details")
                    }
                  />
                  <OptionCard
                    title="View Consilidated Report"
                    description="Click here to view the consolidated report for your students"
                    imageUrl={EditStudentImage}
                    action={() => navigate("/fa-consolidated-report")}
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
        <img
          src={imageUrl}
          alt={title}
          className="cardImage"
          style={{ marginTop: "20px" }}
        />
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Button
          onClick={action}
          variant="contained"
          color="primary"
          className="button"
          style={{ marginTop: "20px" }}
        >
          Go
        </Button>
      </CardContent>
    </Card>
  );
};

export default FaHome;
