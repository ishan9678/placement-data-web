import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import PlacedStudentImage from "../assets/placed.svg";
import { ClipLoader } from "react-spinners";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/home.css";

const HodHome = () => {
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
    <div className="container">
      <Navbar />
      <Card className="mainCard">
        <CardContent>
          {user !== null ? (
            <>
              <Typography variant="h5" component="div" gutterBottom>
                {`Welcome, ${user}!`}
              </Typography>
              <div className="optionsContainer">
                <OptionCard
                  title="View Placed Student Details"
                  description="Click here to view details of placed students."
                  imageUrl={PlacedStudentImage}
                  action={() => navigate("/view-all-placed-student-details")}
                />
                <OptionCard
                  title="View Consolidated Report"
                  description="Click here to view the consolidated report."
                  imageUrl={PlacedStudentImage}
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

export default HodHome;
