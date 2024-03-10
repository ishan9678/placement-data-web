import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Modal, Box } from "@mui/material";
import srm_logo from "../assets/srm_logo.png";
import api_url from "../apiconfig";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    employeeId: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!loginData.employeeId || !loginData.password) {
      console.error("Employee ID and password are required");
      return;
    }

    try {
      const response = await fetch(`${api_url}server/process_login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(loginData).toString(),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.status === "success") {
        console.log("Login successful!");
        navigate("/home");
        window.location.reload();
      } else {
        console.error("Login failed:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    console.log("Login Data:", loginData);
  };

  // State for reset password modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleResetPassword = async () => {
    // Use the resetEmail state value instead of prompt
    const email = resetEmail.trim();
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const response = await fetch(`${api_url}server/send_reset_password.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setOpen(false); // Close the modal
          alert("Password reset link sent to your email");
        } else {
          alert("Email not found");
        }
      } else {
        alert("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleEmailChange = (event) => {
    setResetEmail(event.target.value);
  };

  return (
    <div className="login-container">
      <div
        className="logo-container"
        style={{ textAlign: "center", marginBottom: "1rem" }}
      >
        <img src={srm_logo} alt="logo" className="logo" />
      </div>
      <form onSubmit={handleLogin} className="form-container">
        <h2 className="form-heading">Login</h2>
        <TextField
          label="Employee ID"
          name="employeeId"
          value={loginData.employeeId}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          className="form-control"
        />
        <div className="form-control">
          <TextField
            label="Password"
            type="password"
            name="password"
            value={loginData.password}
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
            Login
          </Button>
        </div>
      </form>
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <Button
          onClick={() => {
            navigate("/signup");
          }}
          variant="outlined"
        >
          Register
        </Button>
        <Button
          onClick={handleOpen}
          variant="outlined"
          style={{ marginLeft: "10px" }}
        >
          Reset Password
        </Button>
      </div>

      {/* Reset Password Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="reset-password-modal"
        aria-describedby="reset-password-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="reset-password-modal">Reset Password</h2>
          <TextField
            label="Enter your email"
            fullWidth
            margin="normal"
            required
            value={resetEmail}
            onChange={handleEmailChange}
          />
          <Button
            onClick={handleResetPassword}
            variant="contained"
            style={{ backgroundColor: "#337ab7", marginTop: "10px" }}
          >
            Reset
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Login;
