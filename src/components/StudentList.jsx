import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Input,
} from "@mui/material";
import api_url from "../apiconfig";

const StudentList = ({ students, onEdit }) => {
  return (
    <TableContainer component={Paper} sx={{ marginTop: "5px" }}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#00afef",
              color: "white",
            }}
          >
            <TableCell>Register Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Specialization</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell>Career Option</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell>{student.registerNumber}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.section}</TableCell>
              <TableCell>{student.specialization}</TableCell>
              <TableCell>{student.batch}</TableCell>
              <TableCell>{student.careerOption}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentList;
