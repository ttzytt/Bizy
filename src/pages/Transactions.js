import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, Breadcrumb, InputGroup, Card, Dropdown } from '@themesberg/react-bootstrap';
import axios from 'axios';

const CollaborationPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const searchBusinesses = async () => {
    setLoading(true);
    try {
      const nominatimResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      
      if (nominatimResponse.data && nominatimResponse.data.length > 0) {
        const { lat, lon } = nominatimResponse.data[0];
        
        const overpassQuery = `
          [out:json];
          (
            node["shop"](around:1000,${lat},${lon});
            node["amenity"="restaurant"](around:1000,${lat},${lon});
            node["amenity"="cafe"](around:1000,${lat},${lon});
          );
          out body;
        `;
        
        const overpassResponse = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        
        if (overpassResponse.data && overpassResponse.data.elements) {
          const formattedBusinesses = overpassResponse.data.elements.map(element => ({
            id: element.id,
            name: element.tags.name || 'Unnamed',
            type: element.tags.shop || element.tags.amenity || 'Business',
            description: `${element.tags.shop || element.tags.amenity} in ${searchQuery}`,
            lat: element.lat,
            lon: element.lon
          }));
          setBusinesses(formattedBusinesses);
        } else {
          setBusinesses([]);
        }
      } else {
        setBusinesses([]);
        alert('Location not found. Please try a different search.');
      }
    } catch (error) {
      console.error("Error searching businesses:", error);
      alert('An error occurred while searching. Please try again.');
    }
    setLoading(false);
  };

  const filteredBusinesses = filter === 'All' 
    ? businesses 
    : businesses.filter(business => business.type.toLowerCase().includes(filter.toLowerCase()));

  const openGoogleSearch = (businessName, businessType, city) => {
    const searchQuery = encodeURIComponent(`${businessName} ${businessType} in ${city}`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <h4>Find Collaboration Partners</h4>
          <p className="mb-0">Discover local businesses and potential partners for your ventures.</p>
        </div>
      </div>

      <Row className="mb-4">
        <Col xs={12}>
          <InputGroup style={{ display: 'flex', alignItems: 'center' }}>
            <InputGroup.Text style={{ backgroundColor: '#f8f9fa', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, height: '38px', width: '50px' }}>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Enter a location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderLeft: 'none', borderRight: 'none', borderRadius: '0', height: '38px' }}
            />
            <Button 
              variant="primary" 
              onClick={searchBusinesses} 
              disabled={loading || !searchQuery.trim()}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: '38px' }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row className="justify-content-between align-items-center mb-4">
        <Col xs={8} md={6} lg={3} xl={4}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary">
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              Filter: {filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter('All')}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('restaurant')}>Restaurant</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('cafe')}>Cafe</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('shop')}>Shop</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={4} md={2} xl={1} className="text-end">
          <p>{filteredBusinesses.length} results</p>
        </Col>
      </Row>

      <Row>
        {filteredBusinesses.map((business) => (
          <Col key={business.id} xs={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{capitalizeWords(business.name)}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{capitalizeWords(business.type)}</Card.Subtitle>
                <Card.Text>{business.description}</Card.Text>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => openGoogleSearch(business.name, business.type, searchQuery)}
                >
                  Contact
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CollaborationPage;