import React, { useState } from 'react';
import './VendorManagement.css'; // We'll create this CSS file

const VendorManagement = () => {
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorAddress, setVendorAddress] = useState('');
  const [contractLength, setContractLength] = useState('');
  const [vendors, setVendors] = useState([]);

  // Function to add a new vendor
  const addVendor = () => {
    if (!vendorName || !vendorEmail || !vendorAddress || !contractLength) {
      alert('Please fill in all fields');
      return;
    }

    const newVendor = {
      id: Date.now(),
      name: vendorName,
      email: vendorEmail,
      address: vendorAddress,
      contract_length: contractLength,
      isNew: true // Flag to trigger animation
    };

    setVendors((prevVendors) => [...prevVendors, newVendor]);

    // Remove the 'isNew' flag after animation
    setTimeout(() => {
      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === newVendor.id ? { ...vendor, isNew: false } : vendor
        )
      );
    }, 500); // Match this with your CSS animation duration

    // Clear input fields
    setVendorName('');
    setVendorEmail('');
    setVendorAddress('');
    setContractLength('');
  };

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
              <tr key={vendor.id} className={vendor.isNew ? 'new-vendor' : ''}>
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