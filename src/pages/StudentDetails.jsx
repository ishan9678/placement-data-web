import React, { useState, useEffect } from "react";
import AddStudentForm from "../components/AddStudentForm";
import StudentList from "../components/StudentList";
import "../styles/home.css";
import Navbar from "../components/Navbar";
import api_url from "../apiconfig";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [isAddingMode, setIsAddingMode] = useState(true);

  useEffect(() => {
    // Fetch user data (faculty advisor's name and students)
    fetch(`${api_url}server/get_student_details.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setStudents(data.students);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const handleAddStudent = (newStudent) => {
    // Add the new student to the list
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setIsAddingMode(false);
  };

  const handleEditStudent = (student) => {
    // Set the student to be edited
    setEditStudent(student);
  };

  const handleToggleMode = () => {
    // Toggle between "Adding" and "Viewing" modes
    setIsAddingMode((prevMode) => !prevMode);
    // Clear the editStudent state when switching modes
    setEditStudent(null);
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        <div>
          <button onClick={handleToggleMode} className="toggleButton">
            {isAddingMode ? "Switch to Viewing Mode" : "Switch to Adding Mode"}
          </button>
        </div>

        {isAddingMode ? (
          <AddStudentForm onSubmit={handleAddStudent} />
        ) : (
          <StudentList students={students} onEdit={handleEditStudent} />
        )}

        {/* Add logic for editing student details based on the selected student */}
        {editStudent && (
          <div>
            <h3>Edit Student</h3>
            {/* Render a form with the current student details for editing */}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
