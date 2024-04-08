import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function BackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate back one step
  };

  return (
    <Button
      onClick={goBack}
      variant="contained"
      style={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "20px",
        padding: "5px 10px",
      }}
    >
      Back
    </Button>
  );
}

export default BackButton;
