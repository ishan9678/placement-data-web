# Placement Data Portal

**Website**: [Placement Data Portal](https://placementdata.in)  
**GitHub Repositories**:  
- [Front-end Repository (React)](https://github.com/ishan9678/placement-data-web)
- [Back-end Repository](https://github.com/ishan9678/placement-data-server)

## Project Overview
Developed for the **CINTEL Department at SRM University**, this portal manages placement data, offering detailed reports and insights. It features role-based access with specific functionality for admins, coordinators, faculty, and department heads.

## Tech Stack
- **Front-end**: React
- **Back-end**: PHP, MySQL
- **Version Control**: Git (GitHub)

# Video demo (placement coordinaor role)

  


https://github.com/user-attachments/assets/389dd2b6-546c-4c33-8c4f-65302122fa48




## Key Features

### **Admin Portal**:
- Approve users (restricts login until approved)
- Add students via Excel upload
- Edit student and faculty details
- Create temporary viewer accounts

### **Placement Coordinator**:
- Upload placed students via Excel
- View placed/unplaced students filtered by faculty, company, or year
- View higher studies and entrepreneur students
- Search and edit placed student details
- Access consolidated reports for the whole department (toggle by year)
- Permissions limited to students of the same department

### **Faculty Advisor**:
- View and upload offer letters for placed students in their class
- View higher studies and entrepreneur student details
- Access consolidated reports for their class

### **Academic Advisor**:
- View/search placed, unplaced, higher studies, and entrepreneur students (no edit access)
- Access consolidated reports of the department for specific years

### **Program Coordinator**:
- Same access as Academic Advisor but limited to students in the program/course

### **HOD (Head of Department)**:
- Same as Placement Coordinator but without the ability to add or edit placed student data

## **Consolidated Report** Features:
- Bar charts, year-over-year comparisons, company statistics, salary details, salary categorisation, student statistics etc.
- Exportable to Excel, downloadable as a PDF
