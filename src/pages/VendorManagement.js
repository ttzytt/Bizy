import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorManagement = () => {
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorAddress, setVendorAddress] = useState('');
  const [contractLength, setContractLength] = useState('');
  const [vendors, setVendors] = useState([]);

  // Function to add a new vendor
  const addVendor = async () => {
    try {
      const response = await axios.post('http://localhost:5000/addVendor', {
        name: vendorName,
        email: vendorEmail,
        address: vendorAddress,
        contract_length: contractLength
      });
      setVendors((prevVendors) => [...prevVendors, response.data]);
      setVendorName('');
      setVendorEmail('');
      setVendorAddress('');
      setContractLength('');
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  };

  // Function to fetch vendors from the backend
  const fetchVendors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/vendors');
      console.log('Fetched vendors:', response.data); // Ensure the data is correct
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  // Fetch vendors when the component mounts
  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="container py-4">
      <h1>Vendor Management</h1>
      <div className="d-flex flex-column flex-md-row align-items-start mb-4">
        <input
          type="text"
          placeholder="Vendor Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          className="form-control mb-2 mb-md-0 me-md-2"
        />
        <input
          type="email"
          placeholder="Vendor Email"
          value={vendorEmail}
          onChange={(e) => setVendorEmail(e.target.value)}
          className="form-control mb-2 mb-md-0 me-md-2"
        />
        <input
          type="text"
          placeholder="Vendor Address"
          value={vendorAddress}
          onChange={(e) => setVendorAddress(e.target.value)}
          className="form-control mb-2 mb-md-0 me-md-2"
        />
        <input
          type="number"
          placeholder="Contract Length (months)"
          value={contractLength}
          onChange={(e) => setContractLength(e.target.value)}
          className="form-control mb-2 mb-md-0 me-md-2"
        />
        <button onClick={addVendor} className="btn btn-primary">
          Add Vendor
        </button>
      </div>

      <h2>Vendors List</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Contract Length (months)</th>
          </tr>
        </thead>
        <tbody>
          {vendors.length > 0 ? (
            vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.address}</td>
                <td>{vendor.contract_length}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No vendors found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorManagement;
