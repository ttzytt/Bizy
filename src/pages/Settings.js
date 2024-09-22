import React, { useState } from 'react';
import { Card, Button, Form, Row, Col } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";

const Settings = () => {
  const [requestType, setRequestType] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [skills, setSkills] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log({ requestType, urgency, skills, date, startTime, endTime });
    setShowAlert(true);
    // Reset form
    setRequestType('');
    setUrgency('normal');
    setSkills('');
    setDate('');
    setStartTime('');
    setEndTime('');
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
          <Form.Group className="mb-3">
            <Form.Label>
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
              Date
            </Form.Label>
            <Form.Control 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  Start Time
                </Form.Label>
                <Form.Control 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  End Time
                </Form.Label>
                <Form.Control 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon={faUserPlus} className="me-2" /> Submit Request
          </Button>
        </Form>

        {showAlert && (
          <div className="alert alert-success mt-3" role="alert">
            Your request has been submitted successfully! We'll notify you when we find a match.
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Settings;