import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faCloudUploadAlt, faPlus, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup, Modal, Form } from '@themesberg/react-bootstrap';
import Papa from 'papaparse';
import { CounterWidget, CircleChartWidget, BarChartWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AIResponseWidget} from "../../components/Widgets";
// import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts"; // Ensure totalOrders is updated when CSV is fetched
import { SalesValueChartData, SalesValueChart } from "../../components/Charts";
import { GoogleGenerativeAI } from '@google/generative-ai';  // Import the library
import * as cfg from "../../config";
import { CounterWidget, CircleChartWidget, BarChartWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";

export default () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loadingData, setLoadingData] = useState(false); // State to handle loading status
  const [strtitle, setStrtitle] = useState("---");
  const [strper1, setSetstrper1] = useState("");
  const [percent1, setPercent1] = useState(0.00);
  const [rev, setRev] = useState(0.00);
  const [strper2, setSetstrper2] = useState("");
  const [percent2, setPercent2] = useState(0.00);
  const [strpertotalorders, setSetstrpertotalorders] = useState(0.00);
  const [percent3, setPercent3] = useState(0.00);
  const [salesval, setSalesval] = useState(0.00);
  const [percentsales, setPercentsales] = useState(0.00);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gk, setGlobalRank] = useState(0);
  const [rk, setRank] = useState(0);
  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(cfg.BACKEND_URL + '/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
      } else {
        setUploadStatus('File upload failed.');
      }
    } catch (error) {
      setUploadStatus('An error occurred while uploading.');
    }
  };

  const fetchCSVData = async () => {
    setIsLoading(true);
    setLoadingData(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/get-csv-data');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const csvText = await response.text();
      const parsedData = Papa.parse(csvText, { header: false });
  
      if (parsedData && parsedData.data && Array.isArray(parsedData.data)) {
        if (parsedData.data.length > 1) {
          const julyValues = parsedData.data[0].map(value => Number(value.trim()) || 0);
          const augustValues = parsedData.data[1].map(value => Number(value.trim()) || 0);
          const trendValues = parsedData.data[2].map(value => Number(value.trim()) || 0);
          const stringval1Values = parsedData.data[3].map(value => value.trim());
          const strper1val = parsedData.data[4].map(value => value.trim());
          const percentValues1 = parsedData.data[5].map(value => Number(value.trim()) || 0);
          const stringval2Values = parsedData.data[6].map(value => value.trim());
          const strper2val = parsedData.data[7].map(value => value.trim());
          const percentValues2 = parsedData.data[8].map(value => Number(value.trim()) || 0);
          const strpertotalorders = parsedData.data[9].map(value => value.trim());
          const percent3 = parsedData.data[10].map(value => Number(value.trim()) || 0);
          const usageValue1 = parsedData.data[11].map(value => Number(value.trim()) || 0);
          const usageValue2 = parsedData.data[12].map(value => Number(value.trim()) || 0);
          const salesval = (trendValues[6] - trendValues[0]).toFixed(2);
          const percentsales = ((trendValues[6]/trendValues[0] - 1) * 100).toFixed(4);
          const x = parsedData.data[6].map(value => Number(value.trim()) || 0);
          const rank = Math.round((30000000 * (1 - 0.5 * (1 + Math.sign((x[0] - 440000) / 150000) * Math.sqrt(1 - Math.exp(-Math.pow((x[0] - 440000) / 150000, 2) * (4/Math.PI + 0.14 * Math.pow((x[0] - 440000) / 150000, 2)) / (1 + 0.14 * Math.pow((x[0] - 440000) / 150000, 2))))))))+1;
          const globalrank = Math.round((400000000 * (1 - 0.5 * (1 + Math.sign((x[0] - 25000) / 300000) * Math.sqrt(1 - Math.exp(-Math.pow((x[0] - 25000) / 300000, 2) * (4/Math.PI + 0.14 * Math.pow((x[0] - 25000) / 300000, 2)) / (1 + 0.14 * Math.pow((x[0] - 25000) / 300000, 2))))))))+1;
          console.log(rank);
          console.log(globalrank);
          totalOrders[0].value = julyValues;
          totalOrders[1].value = augustValues;
          trafficShares[0].value = usageValue1[0];
          trafficShares[1].value = usageValue2[0];
          SalesValueChartData.series[0] = trendValues;
          setGlobalRank(globalrank);
          setRank(rank);
          setStrtitle(stringval1Values);
          setSetstrper1(strper1val);
          setPercent1(percentValues1);
          setRev(stringval2Values);
          setSetstrper2(strper2val);
          setPercent2(percentValues2);
          setSetstrpertotalorders(strpertotalorders);
          setPercent3(percent3);
          setSalesval(salesval);
          setPercentsales(Math.round(percentsales));
          
          console.log("July values:", julyValues);
          console.log("August values:", augustValues);
          console.log("Trend values: ", trendValues);
          console.log("str values: ", stringval1Values);
          console.log(strper1val);
          console.log(percentValues1);
          console.log("str values: ", stringval2Values);
          console.log(strper2val);
          console.log(percentValues2);
          console.log(strpertotalorders);
          console.log(percent3);
          
          setUploadStatus("Displayed Successfully!");
  
          // // AI Analysis
          // setIsLoading(true);
          const genAI = new GoogleGenerativeAI("AIzaSyD2DkyvC-5gb4sO7zNQrDllMj9URuP-cws");  // Replace with your actual API key
  
          const dataForAI = {
            julyValues,
            augustValues,
            trendValues,
            stringval1Values,
            strper1val,
            percentValues1,
            stringval2Values,
            strper2val,
            percentValues2,
            strpertotalorders,
            percent3,
            usageValue1,
            usageValue2,
            salesval,
            percentsales
          };
  
          const prompt = `
            As a small business AI consultant, analyze the following financial data:
            ${JSON.stringify(dataForAI)}
            The first line of this data represents the average weekly sales for each day of the week except Saturday during July,
            while the second line represents the average weekly sales for each day of the week except Saturday during August.
            The next line is the closing stock price of the last seven buisness days.
            The next line is the number of customers, while the one after it is the duartion of the recording of number of customers.
            The line after that is is the percentage increase from the month before it for number of customers.
            The next line is the revenue, while the one after it is the duartion of the recording of revenue.
            The line after that is is the percentage increase from the month before it for revenue.
            The number after that is the total number of orders sold by the restaurant in the past month.
            The number after is the percentage increase from the last month for the number of orders.
            The number after is the percentage of orders who ate in person.
            The finam number is the percentage of orders who ordered online.
            Based on this data, provide insights and recommendations on:
            1. Suggested course of action for business growth
            2. Gross revenue needed to achieve significant growth
            3. Key areas for improvement or cost-cutting
            4. Potential market opportunities
            5. Financial health assessment
  
            Provide a detailed, objective, actionable response with specific numbers and strategies.
            Also make a prediction on the future of the restaurant, the next stock closing price value, and make inferences.
          `;
  
          try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();
            console.log(responseText);
            setAiResponse(responseText);
          } catch (error) {
            console.error('Error generating AI response:', error);
            setAiResponse('Error: Could not retrieve a response. Please try again later.');
          } finally {
            // setIsLoading(false);
          }
  
        } else {
          console.error('Not enough data in CSV');
          setUploadStatus('Not enough data in CSV');
        }
      } else {
        console.error('Parsed data is not in the expected format:', parsedData);
        setUploadStatus('Unexpected data format received.');
      }
    } catch (error) {
      console.error('Error fetching CSV data:', error);
      setUploadStatus('Failed to load data.');
    } finally {
      setLoadingData(false);
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <Dropdown className="btn-toolbar">
          <Dropdown.Toggle as={Button} variant="primary" size="sm" className="me-2">
            <FontAwesomeIcon icon={faPlus} className="me-2" />Manage Data
          </Dropdown.Toggle>
          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2">
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" /> Upload Files
              {/* File Input */}
              <Form.Group controlId="formFile" className="mt-2">
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
              {/* Upload Button */}
              <Button onClick={handleUpload} size="sm" className="mt-2">Upload</Button>
              {/* Upload Status */}
              {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
            </Dropdown.Item>

            <Dropdown.Item
              className="fw-bold"
              onClick={fetchCSVData} // Fetch CSV data on click
            >
              <FontAwesomeIcon icon={faUserShield} className="me-2" /> Display Data
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </div>

      {/* Loading status display */}
      {loadingData && <p>Loading data...</p>}
      {uploadStatus && <p>{uploadStatus}</p>}

      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <SalesValueWidget
            title="Stock tracking"
            value={salesval}
            percentage={percentsales}
          />
        </Col>
        <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Stock tracking"
            value="10,567"
            percentage={10.57}
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Customers"
            title={strtitle}
            period={strper1}
            percentage={percent1}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Revenue"
            title={rev}
            period={strper2}
            percentage={percent2}
            icon={faCashRegister}
            iconColor="shape-tertiary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CircleChartWidget
            title="Customer Split"
            data={trafficShares} />
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <AIResponseWidget response={aiResponse} isLoading={isLoading}/>
                </Col>


              </Row>
            </Col>

            <Col xs={12} xl={4}>
              <Row>
                <Col xs={12} className="mb-4">
                  <BarChartWidget
                    title="Total orders"
                    value={strpertotalorders}
                    percentage={percent3}
                    data={totalOrders} />
                </Col>

                <Col xs={12} className="px-0 mb-4">
                  <RankingWidget globalRank={gk} rank={rk} />
                </Col>

              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Security Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your data is secure. It is not stored anywhere on our servers.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};