import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";
import "../styles/pages.css";
import * as XLSX from "xlsx";

export const CareerOptionConsolidatedReport = () => {
    const [students, setStudents] = useState([])
    const [batch, setBatch] = useState("");
    const [department, setDepartment] = useState("");

    useEffect(() => {
        fetch(`${api_url}server/get_user_info.php`, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setBatch(data.batch);
                    setDepartment(data.department)
                } else {
                    console.error("Error:", data.message);
                }
            })
            .catch((error) => console.error("Fetch error:", error));
    }, []);

    useEffect(() => {
        fetch(
            `${api_url}server/get_consolidated_career_option.php?department=${department}&batch=${batch}`,
            {
                method: "GET",
                credentials: "include",
            }
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setStudents(data.students)
                } else {
                    console.error("Error:", data.message);
                }
                }
            )
            .catch((error) => console.error("Fetch error:", error));
    }, [department, batch]);

    const handleBatchChange = (event) => {
        setBatch(event.target.value);
      };

    const downloadExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "CareerOptionReport.xlsx");
    };

    return (
        <>
            <Navbar />
            <div
                className="view-all-placed-container"
                style={{ maxHeight: "500px", maxWidth: "1200px" }}
            >
                <h2 className="view-all-placed-title">
                    Career Option Consolidated Report {department}
                </h2>
                <div style={{ display: "flex" }}>
                    <FormControl className="form-control">
                        <InputLabel htmlFor="batch">Batch</InputLabel>{" "}
                        <Select
                            name="batch"
                            label="batch"
                            id="batch"
                            value={batch}
                            defaultValue={2025}
                            onChange={() => {
                                handleBatchChange();
                            }}
                            style={{ color: "black", minWidth: 120, marginBottom: "20px" }} // Adjust minWidth as needed
                        >
                            {[...Array(2051 - 2022).keys()].map((year) => (
                                <MenuItem
                                    key={2022 + year}
                                    value={2022 + year}
                                    style={{ color: "black" }}
                                >
                                    {2022 + year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

        
                <TableContainer
                    className="view-all-placed-table"
                    component={Paper}
                    style={{ overflowX: "auto" }}
                >
                    {students.length > 0 && (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => downloadExcel(students)}
                            style={{ backgroundColor: "#10793F"}}
                        >
                            Download As Excel
                        </Button>
                    )}
                    <Table>
                        <TableHead>
                        <TableRow
                                sx={{
                                backgroundColor: "#00afef",
                                color:  "black",
                                fontWeight: "800",
                                }}
                        >
                                <TableCell>Register No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Section</TableCell>
                                <TableCell>Faculty Advisor</TableCell>
                                <TableCell>Career Option</TableCell>
                                <TableCell>Batch</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.registerNumber}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.section}</TableCell>
                                    <TableCell>{student.careerOption}</TableCell>
                                    <TableCell>{student.facultyAdvisorName}</TableCell>
                                    <TableCell>{student.batch}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}
