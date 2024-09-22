import React, { useState } from 'react';
import { Card, Button, Form, Table } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import resumesData from './resumes.json';

const Settings = () => {
  const [requestType, setRequestType] = useState('');
  const [urgency, setUrgency] = useState('');
  const [skills, setSkills] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [matchingResumes, setMatchingResumes] = useState([]);

  const findMatchingResumes = (requirements) => {
    return resumesData.filter(resume => 
      resume.staffType === requirements.requestType &&
      resume.urgency === requirements.urgency &&
      resume.skills.includes(requirements.skills)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requirements = { requestType, urgency, skills };
    const matches = findMatchingResumes(requirements);
    setMatchingResumes(matches);
    setShowAlert(true);
    // Reset form
    setRequestType('');
    setUrgency('');
    setSkills('');
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Request Temporary Staff</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Staff Type</Form.Label>
            <Form.Select 
              value={requestType} 
              onChange={(e) => setRequestType(e.target.value)}
              required
            >
              <option value="">Select staff type...</option>
              <option value="chef">Chef</option>
              <option value="server">Server</option>
              <option value="cashier">Cashier</option>
              <option value="janitor">Janitor</option>
              <option value="manager">Manager</option>
              <option value="bartender">Bartender</option>
              <option value="dishwasher">Dishwasher</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Urgency</Form.Label>
            <Form.Select 
              value={urgency} 
              onChange={(e) => setUrgency(e.target.value)}
              required
            >
              <option value="">Select level of urgency...</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Skills</Form.Label>
            <Form.Select 
              value={skills} 
              onChange={(e) => setSkills(e.target.value)}
              required
            >
              <option value="">Select skill needed...</option>            
              <option value="cooking">Cooking</option>
              <option value="serving">Serving</option>
              <option value="accounting">Accounting</option>
              <option value="cleaning">Cleaning</option>
              <option value="managing">Managing</option>
              <option value="bartending">Bartending</option>
              <option value="dishwashing">Dishwashing</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon={faUserPlus} className="me-2" /> Submit Request
          </Button>
        </Form>

        {showAlert && (
          <div className="alert alert-success mt-3" role="alert">
            Your request has been submitted successfully! We'll notify you when we find a match.
          </div>
        )}

        {matchingResumes.length > 0 && (
          <div className="mt-4">
            <h5>Matching Resumes</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Staff Type</th>
                  <th>Skills</th>
                  <th>Urgency</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {matchingResumes.map((resume, index) => (
                  <tr key={index}>
                    <td>{resume.name}</td>
                    <td>{resume.staffType}</td>
                    <td>{resume.skills.join(', ')}</td>
                    <td>{resume.urgency}</td>
                    <td>{resume.phoneNumber}</td>
                    <td>{resume.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Settings;