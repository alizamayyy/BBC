// Import React and other necessary libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

// Define a custom component for each row of the table
const StudentRow = ({ student, onAssignClass, onEditStudent, onDeleteStudent }) => {
  // Use state variables to store the modal visibility and the selected class id
  const [showAssignClassModal, setShowAssignClassModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(student.class_id);

  // Define a function to handle the assign class button click
  const handleAssignClass = () => {
    // Show the modal
    setShowAssignClassModal(true);
  };

  // Define a function to handle the modal close event
  const handleClose = () => {
    // Hide the modal
    setShowAssignClassModal(false);
  };

  // Define a function to handle the modal save event
  const handleSave = () => {
    // Call the onAssignClass function with the student id and the selected class id
    onAssignClass(student.id, selectedClassId);
    // Hide the modal
    setShowAssignClassModal(false);
  };

  // Define a function to handle the class selection change event
  const handleClassChange = (e) => {
    // Set the selected class id to the value of the event target
    setSelectedClassId(e.target.value);
  };

  // Define a function to handle the edit student button click
  const handleEditStudent = () => {
    // Call the onEditStudent function with the student object
    onEditStudent(student);
  };

  // Define a function to handle the delete student button click
  const handleDeleteStudent = () => {
    // Call the onDeleteStudent function with the student id
    onDeleteStudent(student.id);
  };

  // Return the JSX element for the row
  return (
    <tr>
      <td>{student.id}</td>
      <td>{student.name}</td>
      <td>{student.email}</td>
      <td>{student.date_of_birth}</td>
      <td>{student.class_id}</td>
      <td>
        <Button variant="primary" onClick={handleAssignClass}>
          Assign Class
        </Button>
        <Button variant="secondary" onClick={handleEditStudent}>
          Edit Student
        </Button>
        <Button variant="danger" onClick={handleDeleteStudent}>
          Delete Student
        </Button>
      </td>
      <Modal show={showAssignClassModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formClassSelect">
              <Form.Label>Select a class</Form.Label>
              <Form.Control
                as="select"
                value={selectedClassId}
                onChange={handleClassChange}
              >
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </tr>
  );
};

// Define a custom component for the students table
const StudentsTable = () => {
  // Use state variables to store the students data, the modal visibility, and the current student object
  const [students, setStudents] = useState([]);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Define a function to fetch the students data from the API server
  const fetchStudents = async () => {
    try {
      // Send a GET request to the /student/all endpoint
      const response = await axios.get('http://localhost:5000/student/all');
      // Set the students state variable to the response data
      setStudents(response.data);
    } catch (error) {
      // Log the error
      console.error(error);
    }
  };

  // Use the useEffect hook to fetch the students data when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Define a function to handle the assign class event
  const handleAssignClass = async (studentId, classId) => {
    try {
      // Send a PUT request to the /student/<studentId> endpoint with the class id as the data
      await axios.put(`http://localhost:5000/student/${studentId}`, {
        class_id: classId,
      });
      // Fetch the updated students data
      fetchStudents();
    } catch (error) {
      // Log the error
      console.error(error);
    }
  };

  // Define a function to handle the edit student event
  const handleEditStudent = (student) => {
    // Set the current student state variable to the student object
    setCurrentStudent(student);
    // Show the modal
    setShowEditStudentModal(true);
  };

  // Define a function to handle the modal close event
  const handleClose = () => {
    // Hide the modal
    setShowEditStudentModal(false);
  };

  // Define a function to handle the modal save event
  const handleSave = async () => {
    try {
      // Send a PUT request to the /student/<studentId> endpoint with the current student object as the data
      await axios.put(`http://localhost:5000/student/${currentStudent.id}`, {
        name: currentStudent.name,
        email: currentStudent.email,
      });
      // Fetch the updated students data
      fetchStudents();
      // Hide the modal
      setShowEditStudentModal(false);
    } catch (error) {
      // Log the error
      console.error(error);
    }
  };

  // Define a function to handle the name change event
  const handleNameChange = (e) => {
    // Set the current student name to the value of the event target
    setCurrentStudent({ ...currentStudent, name: e.target.value });
  };

  // Define a function to handle the email change event
  const handleEmailChange = (e) => {
    // Set the current student email to the value of the event target
    setCurrentStudent({ ...currentStudent, email: e.target.value });
  };

  // Define a function to handle the delete student event
  const handleDeleteStudent = async (studentId) => {
    try {
      // Send a DELETE request to the /student/<studentId> endpoint
      await axios.delete(`http://localhost:5000/student/${studentId}`);
      // Fetch the updated students data
      fetchStudents();
    } catch (error) {
      // Log the error
      console.error(error);
    }
  };

  // Return the JSX element for the table
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Class ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentRow
              key={student.id}
              student={student}
              onAssignClass={handleAssignClass}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          ))}
        </tbody>
      </Table>
      <Modal show={showEditStudentModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStudentName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent ? currentStudent.name : ''}
                onChange={handleNameChange}
              />
            </Form.Group>
            <Form.Group controlId="formStudentEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentStudent ? currentStudent.email : ''}
                onChange={handleEmailChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Export the component
export default StudentsTable;
