import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        bgcolor: "black",
        color: "white",
        textAlign: "center",
        py: 1,
        boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography variant="body2">
        Portal designed and maintained by{" "}
        <strong>Dr. T. R. Saravanan</strong>, Associate Professor, Computational Intelligence
      </Typography>
    </Box>
  );
};

export default Footer;
