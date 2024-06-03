import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/pages.css";

function UnapprovedUsersTable() {
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [refetch, setRefetch] = useState(null);

  useEffect(() => {
    fetch(`${api_url}server/get_unapproved_users.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUnapprovedUsers(data.unapprovedUsers);
          refetch(0);
        } else {
          console.error("Failed to fetch unapproved users:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [refetch]);

  const handleApproveUser = (userId) => {
    fetch(`${api_url}server/approve_user.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          console.log("User approved successfully");
          // Remove the approved user from the unapprovedUsers state array
          setUnapprovedUsers(
            unapprovedUsers.filter((user) => user.id !== userId)
          );
        } else {
          console.error("Failed to approve user:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  return (
    <>
      <Navbar />
      <h1 style={{ textAlign: "center" }}>Approve Users</h1>
      <TableContainer
        className="admin-dashboard-container"
        component={Paper}
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Action</TableCell>{" "}
              {/* New column for the approve button */}
            </TableRow>
          </TableHead>
          <TableBody>
            {unapprovedUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.employee_id}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.specialization}</TableCell>
                <TableCell>{user.batch}</TableCell>
                <TableCell>{user.email_id}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApproveUser(user.id)}
                  >
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default UnapprovedUsersTable;
