import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // State for student form and records
  const [name, setName] = useState('');
  const [cls, setCls] = useState('');
  const [area, setArea] = useState('');
  const [students, setStudents] = useState([]);

  // Fetch students when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/student/get') // Your GET endpoint
      .then((response) => {
        setStudents(response.data); // Set fetched students data
      })
      .catch((error) => {
        console.error('There was an error fetching the student data:', error);
      });
  }, []);

  // Handle form submission (Insert Student)
  const handleSubmit = (e) => {
    e.preventDefault();

    const newStudent = {
      name: name,
      cls: cls,
      area: area,
    };

    // POST request to insert a new student
    axios.post('http://localhost:8080/student/insert', newStudent) // Your POST endpoint
      .then((response) => {
        setStudents([...students, response.data]); // Update students list
        setName('');
        setCls('');
        setArea('');
      })
      .catch((error) => {
        console.error('There was an error inserting the student:', error);
      });
  };

  return (
    <div>
      <h1>Student Management</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student's name"
          />
        </div>

        <div>
          <label>Class:</label>
          <input
            type="text"
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            placeholder="Enter class"
          />
        </div>

        <div>
          <label>Area:</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter area"
          />
        </div>

        <button type="submit">Add Student</button>
      </form>

      <h2>Students List</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - Class: {student.cls} - Area: {student.area}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
