import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './VendorManagement.css';
import * as cfg from "../config"
const genAI = new GoogleGenerativeAI('AIzaSyD8ZZKKoaJ8oKOek7caaiISI45W3U2g2a0');

const VendorManagement = () => {
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorAddress, setVendorAddress] = useState('');
  const [contractLength, setContractLength] = useState('');
  const [vendors, setVendors] = useState([]);
  const [emailContent, setEmailContent] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [contractTemplate, setContractTemplate] = useState(''); // New state for contract template
  const [isGeneratingContract, setIsGeneratingContract] = useState(false); // New state for contract generation

  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: '',
    batchNumber: '',
    expiryDate: '',
    vendorId: '',
  });

  const [restockQuantity, setRestockQuantity] = useState(''); // New state for restock quantity

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(cfg.BACKEND_URL + '/vendors');
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch(cfg.BACKEND_URL + '/inventory');
        const data = await response.json();
        setInventoryItems(data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };

    fetchInventoryItems();
  }, []);

  useEffect(() => {
    const simulatedSalesData = [
      { date: '2024-09-01', itemName: 'Tomatoes', quantity: 50 },
      { date: '2024-09-02', itemName: 'Tomatoes', quantity: 45 },
      { date: '2024-09-03', itemName: 'Tomatoes', quantity: 55 },
    ];
    setSalesData(simulatedSalesData);
  }, []);

  const generateEmail = async (vendorName, itemName, quantity) => {
    console.log("vendorName: " + vendorName + " itemName: " + itemName + " quantity: " + quantity);
    if (!vendorName || !itemName || !quantity) {
      console.error('Missing required data for email generation');
      return;
    }
  
    setIsGeneratingEmail(true);
    try {
      const unit = inventoryItems.find(item => item.name === itemName)?.unit || 'units';
      const prompt = `
        Write a professional email to a vendor named ${vendorName} requesting a restock of ${quantity} ${unit} of ${itemName}.
        The email should:
        - Be polite and formal
        - Mention the current low stock situation
        - Request confirmation of the order and estimated delivery time
        - Thank them for their continued partnership
      `;
  
      const result = await genAI.generateText({
        model: 'gemini-pro',
        prompt: prompt,
      });
  
      const text = result.candidates[0].text;
      setEmailContent(text);
    } catch (error) {
      console.error('Error generating email:', error);
      setEmailContent('Failed to generate email. Please try again.');
    } finally {
      setIsGeneratingEmail(false);
    }
  };
  
  const generateContractTemplate = async () => {
    setIsGeneratingContract(true);
    try {
      const prompt = `
        Create a contract template for a vendor named ${vendorName} and a shop owner. 
        The contract should include:
        - Vendor details (name, address, email)
        - Shop owner details
        - Contract length of ${contractLength} months
        - Terms and conditions
        - Signatures
      `;
  
      const result = await genAI.generateText({
        model: 'gemini-pro',
        prompt: prompt,
      });
  
      const text = result.candidates[0].text;
      setContractTemplate(text);
    } catch (error) {
      console.error('Error generating contract template:', error);
      setContractTemplate('Failed to generate contract template. Please try again.');
    } finally {
      setIsGeneratingContract(false);
    }
  };


  const addVendor = async () => {
    if (!vendorName || !vendorEmail || !vendorAddress || !contractLength) {
      alert('Please fill in all vendor fields');
      return;
    }
  
    const newVendor = {
      name: vendorName,
      email: vendorEmail,
      address: vendorAddress,
      contract_length: contractLength,
    };
    
    try {
      const response = await fetch(cfg.BACKEND_URL + '/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor),
      });

      if (response.ok) {
        const createdVendor = await response.json();
        setVendors((prevVendors) => [...prevVendors, createdVendor]);
        setVendorName('');
        setVendorEmail('');
        setVendorAddress('');
        setContractLength('');
      } else {
        console.error('Error adding vendor:', response);
      }
  
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  };
  
  const addInventoryItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.unit || !newItem.batchNumber || !newItem.expiryDate || !newItem.vendorId) {
      alert('Please fill in all inventory fields');
      return;
    }
    const deleteVendor = async (vendorId) => {
      console.log("deleteVendor called with vendorId of " + vendorId);
      try {
        const response = await fetch(`${cfg.BACKEND_URL}/vendors/${vendorId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setVendors((prevVendors) => prevVendors.filter(vendor => vendor._id !== vendorId));
        } else {
          console.error('Error deleting vendor:', response);
        }
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    };
    const newInventoryItem = {
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      batchNumber: newItem.batchNumber,
      expiryDate: newItem.expiryDate,
      vendorId: newItem.vendorId,
    }
  
    try {
      const response = await fetch(cfg.BACKEND_URL + '/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInventoryItem),
      });
  
      if (response.ok) {
        const createdItem = await response.json();
        setInventoryItems((prevItems) => [...prevItems, createdItem]);
        setNewItem({
          name: '',
          quantity: '',
          unit: '',
          batchNumber: '',
          expiryDate: '',
          vendorId: '',
        });
      } else {
        console.error('Error adding inventory item:', response);
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  // Removed duplicate generateContractTemplate function
  const deleteInventoryItem = async (itemId) => {
    try {
      const response = await fetch(`${cfg.BACKEND_URL}/inventory/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInventoryItems((prevItems) => prevItems.filter(item => item._id !== itemId));
      } else {
        console.error('Error deleting inventory item:', response);
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const checkExpiryAlerts = () => {
    const today = new Date();
    const alertThreshold = 7;
    return inventoryItems.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= alertThreshold && daysUntilExpiry > 0;
    });
  };

  const forecastInventory = (itemName) => {
    const itemSales = salesData.filter(sale => sale.itemName === itemName);
    if (itemSales.length === 0) return "No sales data available";

    const totalSales = itemSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averageDailySales = totalSales / itemSales.length;
    const forecastedNeed = Math.ceil(averageDailySales * 7);

    return `Forecasted need for next week: ${forecastedNeed} ${inventoryItems.find(item => item.name === itemName)?.unit || 'units'}`;
  };

  return (
    <div className="container py-4">
      <h1>Vendor and Inventory Management</h1>

      <h2>Vendor Management</h2>
      <div className="input-group mb-4">
        <input type="text" placeholder="Vendor Name" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
        <input type="email" placeholder="Vendor Email" value={vendorEmail} onChange={(e) => setVendorEmail(e.target.value)} />
        <input type="text" placeholder="Vendor Address" value={vendorAddress} onChange={(e) => setVendorAddress(e.target.value)} />
        <input type="number" placeholder="Contract Length (months)" value={contractLength} onChange={(e) => setContractLength(e.target.value)} />
        <button onClick={addVendor}>Add Vendor</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Contract Length (months)</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr>
              <td>{vendor.name}</td>
              <td>{vendor.email}</td>
              <td>{vendor.address}</td>
              <td>{vendor.contract_length}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Inventory Management</h2>
      <div className="input-group mb-4">
        <input type="text" placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
        <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
        <input type="text" placeholder="Unit" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} />
        <input type="text" placeholder="Batch Number" value={newItem.batchNumber} onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })} />
        <input type="date" placeholder="Expiry Date" value={newItem.expiryDate} onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })} />
        <select value={newItem.vendorId} onChange={(e) => setNewItem({ ...newItem, vendorId: e.target.value })}>
          <option value="">Select Vendor</option>
          {vendors.map(vendor => (
            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
          ))}
        </select>
        <button onClick={addInventoryItem}>Add Inventory Item</button>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Batch Number</th>
            <th>Expiry Date</th>
            <th>Vendor</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.batchNumber}</td>
              <td>{item.expiryDate}</td>
              <td>{vendors.find(v => v._id === item.vendorId)?.name || 'N/A'}</td>
              <td>
                <button onClick={() => deleteInventoryItem(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Generate Contract Template</h2>
      <button onClick={generateContractTemplate} disabled={isGeneratingContract}>
        {isGeneratingContract ? 'Generating...' : 'Generate Contract'}
      </button>
      <textarea value={contractTemplate} rows="10" placeholder="Generated contract template will appear here..." />
      </div>

      <h2>Expiry Alerts</h2>
      <ul className="expiry-alerts">
        {checkExpiryAlerts().map(item => (
          <li key={item.id} className="expiry-alert">
            {item.name} (Batch: {item.batchNumber}) expires on {item.expiryDate}
          </li>
        ))}
      </ul>

      <h2>Generate Restock Request Email</h2>
      <div className="input-group mb-4">
        <select onChange={(e) => {
          const selectedVendor = vendors.find(v => v._id === e.target.value);
          if (selectedVendor) {
            setVendorName(selectedVendor.name);
            // Clear the selected item when changing vendor
            setNewItem({ ...newItem, name: '' });
          }
        }}>
          <option value="">Select Vendor</option>
          {vendors.map(vendor => (
            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
          ))}
        </select>

        <select onChange={(e) => {
          const selectedItem = inventoryItems.find(item => item._id === e.target.value);
          if (selectedItem) {
            setNewItem({ ...newItem, name: selectedItem.name });
            setRestockQuantity(selectedItem.quantity);
          }
        }}>
          <option value="">Select Item</option>
          {inventoryItems
            .filter(item => item.vendorId === vendors.find(v => v.name === vendorName)?._id) // Filter by selected vendor
            .map(item => (
              <option key={item._id} value={item._id}>{item.name}</option>
            ))}
        </select>

        <input
          type="number"
          placeholder="Restock Quantity"
          value={restockQuantity}
          onChange={(e) => setRestockQuantity(e.target.value)}
        />

        <button
          onClick={() => generateEmail(vendorName, newItem.name, restockQuantity)}
          disabled={isGeneratingEmail}
        >
          {isGeneratingEmail ? 'Generating...' : 'Generate Email'}
        </button>
        
      </div>


      <textarea
        className="email-content"
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        rows="10"
        placeholder="Generated email will appear here..."
      />
    </div>
    

  );
};

export default VendorManagement;