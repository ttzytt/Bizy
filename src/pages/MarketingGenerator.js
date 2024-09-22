import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import './MarketingGenerator.css';
import * as cfg from "../config"

// rikhil api key: AIzaSyCvdIUp2Ok6b0ltfS-KsaV75NJy45br-Lo
// rikhil calendar id: e8dc5521652742d79a7882d8ab52d95347e7ce5ee68fd0f3cbd7c52ea921fc2c@group.calendar.google.com
// tony api key: AIzaSyCmOvQJzRDgnGS7baE6pf8v2CzSGLIZvsg
// tony calendar id: 6db397f9e4df5b89c9192ea4d8c311fa306d08f0d87884a116c11d497594c9b7@group.calendar.google.com


var inventoryItems = [];
var vendors = [];
var events = [];

function transformInventoryToEvents(inventoryItems, vendors) {
  return inventoryItems.map(item => {
    // Find the vendor corresponding to the vendorId in the inventory item
    const vendor = vendors.find(v => v._id === item.vendorId);

    // Construct the event title
    const eventTitle = `${item.quantity} ${item.unit} of ${item.name} by ${vendor.name} expires`;

    // Create the event object
    return {
      title: eventTitle,
      date: item.expiryDate,
      extendedProps: {
        status: item.status || 'default-status', // Add status (if available) or a default value
        post: `This event is related to ${item.name}.`, // Add other custom fields if necessary
      }
    };
  });
}



const MarketingGenerator = () => {
  const [eventDescription, setEventDescription] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('casual');
  const [targetAudience, setTargetAudience] = useState('general');
  const [postLength, setPostLength] = useState('medium');
  const [showGoogleEvents, setShowGoogleEvents] = useState(false);
  const [calendarId, setCalendarId] = useState(''); // State for Calendar ID
  const [apiKey, setApiKey] = useState(''); // State for API Key
  const calendarRef = useRef(null);
  
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch(cfg.BACKEND_URL + '/inventory');
        const data = await response.json();
        inventoryItems = data;
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };
  
    const fetchVendors = async () => {
      try {
        const response = await fetch(cfg.BACKEND_URL + '/vendors');
        const data = await response.json();
        vendors = data;
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
  
    const fetchData = async () => {
      await Promise.all([fetchInventoryItems(), fetchVendors()]);
      events = transformInventoryToEvents(inventoryItems, vendors); // Generate events
    };
  
    fetchData();
  }, []);
  
  const generatePost = async () => {
    if (!eventDescription.trim()) {
      alert('Please enter an event description');
      return;
    }

    setIsGenerating(true);
    setGeneratedPost('');

    // Simulate API Call for post generation (replace with actual code as needed)
    setTimeout(() => {
      const generatedText = `Generated post for: "${eventDescription}"`;
      setGeneratedPost(generatedText);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost)
      .then(() => alert('Post copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleEventClick = (info) => {
    const event = info.event;
    if (event.source && event.source.googleCalendarId) {
      alert(`Google Calendar Event: ${event.title}\nDate: ${event.start.toDateString()}`);
    } else {
      const status = event.extendedProps.status;  // Keep status if you need it
      alert(`Event: ${event.title}\nDate: ${event.start.toDateString()}\nStatus: ${status}`);
    }
  };


  const eventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
        {eventInfo.event.source && eventInfo.event.source.googleCalendarId &&
          <span className="event-icon google">G</span>
        }
      </>
    );
  };

  return (
    <div className="marketing-generator">
      <h1>Marketing Event Planner</h1>

      <div className="input-section">
        <textarea
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          placeholder="Describe your event or topic briefly..."
          rows="3"
        />

        <div className="options">
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="excited">Excited</option>
            <option value="informative">Informative</option>
          </select>

          <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
            <option value="general">General</option>
            <option value="youth">Youth</option>
            <option value="professionals">Professionals</option>
            <option value="seniors">Seniors</option>
          </select>

          <select value={postLength} onChange={(e) => setPostLength(e.target.value)}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <button onClick={generatePost} disabled={isGenerating} className="generate-btn">
          {isGenerating ? 'Generating...' : 'Generate Post and Events'}
        </button>
      </div>

      <div className="output-section">
        <h2>Generated Post</h2>
        <textarea
          value={generatedPost}
          readOnly
          rows="10"
          className="generated-post-textarea"
          placeholder="Your generated post will appear here..."
        />
        {generatedPost && (
          <button onClick={copyToClipboard} className="copy-btn">Copy to Clipboard</button>
        )}
      </div>

      <div className="calendar-container">
        <h2>Event Calendar</h2>

        {/* Input for API Key */}
        <div className="api-key-input">
          <label>Google API Key:</label>
          <input
            type="text"
            value={apiKey}
            // onChange={(e) => setApiKey(e.target.value)}
            // on change -> first print then setapikey
            onChange={(e) => {
              console.log("setting api key " + e.target.value);
              setApiKey(e.target.value);
            }}
            placeholder="Enter your Google API Key"
          />
        </div>

        {/* Input for Calendar ID */}
        <div className="calendar-id-input">
          <label>Google Calendar ID:</label>
          <input
            type="text"
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            placeholder="Enter Google Calendar ID"
          />
        </div>

        <label className="google-events-toggle">
          <input
            type="checkbox"
            checked={showGoogleEvents}
            onChange={() => setShowGoogleEvents(!showGoogleEvents)}
          />
          Show Google Calendar Events
        </label>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
          initialView="dayGridMonth"
          // events={events}
          eventClick={handleEventClick}
          eventContent={eventContent}
          googleCalendarApiKey={apiKey} // Use the API key from the state
          eventSources={[

            {events: events},
            ...(showGoogleEvents ? [{
              googleCalendarId: calendarId,
              color: 'blue',
            }] : [])
          ]}
        />
      </div>
    </div>
  );
};

export default MarketingGenerator;
