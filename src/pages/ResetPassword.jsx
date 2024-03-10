import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import api_url from "../apiconfig";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const handleResetPassword = () => {
    // Password validation
    const passwordRegex = /^(?=.*[0-9]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be at least 6 characters long and contain at least 1 number"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Send token and new password to reset_password.php
    fetch(`${api_url}server/reset_password.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setSuccessMessage("Password reset successful");
          setError("");
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again.");
        console.error("Error:", error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Reset Password
      </Typography>
      {error && (
        <Box my={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      {successMessage && (
        <Box my={2}>
          <Typography color="success">{successMessage}</Typography>
        </Box>
      )}
      <TextField
        label="Enter new password"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
        inputProps={{ style: { width: 250 } }}
      />
      <TextField
        label="Re-enter password"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
        inputProps={{ style: { width: 250 } }}
      />
      <Button variant="contained" color="primary" onClick={handleResetPassword}>
        Reset Password
      </Button>
    </Container>
  );
}

export default ResetPassword;
