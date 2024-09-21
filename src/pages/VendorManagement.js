import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog, faHome, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown, Modal, Image } from '@themesberg/react-bootstrap';

const VendorsTable = [
    {
      id: 1,
      name: "Vendor A",
      contact: "vendorA@example.com",
      legalDocs: "Uploaded",
      image: "image1.jpg",
      description: "Supplier of electronic components.",
    },
    {
      id: 2,
      name: "Vendor B",
      contact: "vendorB@example.com",
      legalDocs: "Uploaded",
      image: "image2.jpg",
      description: "Provider of office supplies.",
    },
    {
      id: 3,
      name: "Vendor C",
      contact: "vendorC@example.com",
      legalDocs: "Not Uploaded",
      image: "image3.jpg",
      description: "Manufacturer of industrial machinery.",
    },
  ];

export default () => {
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Vendor Management</Breadcrumb.Item>
            <Breadcrumb.Item active>Vendors</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Vendors</h4>
          <p className="mb-0">Manage your vendors and their details.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <ButtonGroup>
            <Button variant="outline-primary" size="sm" onClick={handleShow}>
              <FontAwesomeIcon icon={faPlus} /> Add Vendor
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={8} md={6} lg={3} xl={4}>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control type="text" placeholder="Search Vendors" />
            </InputGroup>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-0">
                <span className="icon icon-sm icon-gray">
                  <FontAwesomeIcon icon={faCog} />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-right">
                <Dropdown.Item className="fw-bold text-dark">Show</Dropdown.Item>
                <Dropdown.Item className="d-flex fw-bold">
                  10 <span className="icon icon-small ms-auto"><FontAwesomeIcon icon={faCheck} /></span>
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                <Dropdown.Item className="fw-bold">30</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <VendorsTable />

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formVendorName">
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control type="text" placeholder="Enter vendor name" />
            </Form.Group>
            <Form.Group controlId="formVendorContact">
              <Form.Label>Contact Information</Form.Label>
              <Form.Control type="text" placeholder="Enter contact information" />
            </Form.Group>
            <Form.Group controlId="formVendorLegalDocs">
              <Form.Label>Legal Documents</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Form.Group controlId="formVendorImage">
              <Form.Label>Vendor Image</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Form.Group controlId="formVendorDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter a description for the vendor" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {/*fix save */}}>
            Save Vendor
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
