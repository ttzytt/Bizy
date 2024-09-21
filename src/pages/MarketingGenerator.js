import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import './MarketingGenerator.css';

const genAI = new GoogleGenerativeAI('AIzaSyD8ZZKKoaJ8oKOek7caaiISI45W3U2g2a0');

const MarketingGenerator = () => {
  const [eventDescription, setEventDescription] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('casual');
  const [targetAudience, setTargetAudience] = useState('general');
  const [postLength, setPostLength] = useState('medium');
  const [events, setEvents] = useState([]);
  const [showGoogleEvents, setShowGoogleEvents] = useState(false);
  const calendarRef = useRef(null);

  const generatePost = async () => {
    if (!eventDescription.trim()) {
      alert('Please enter an event description');
      return;
    }

    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
        Create an engaging Instagram post for the following event or topic:
        "${eventDescription}"

        Consider the following:
        - Tone: ${tone}
        - Target Audience: ${targetAudience}
        - Post Length: ${postLength}

        The post should:
        - Start with an attention-grabbing opening line
        - Include relevant emojis throughout the text
        - Use appropriate hashtags (3-5)
        - End with a clear call-to-action

        Format the post as it would appear on Instagram, including line breaks.

        Also, suggest 3 potential event dates in the next 3 months with titles. 
        Present this information in a JSON format like this:
        {
          "post": "Your generated Instagram post here",
          "events": [
            {"title": "Event Title 1", "date": "YYYY-MM-DD"},
            {"title": "Event Title 2", "date": "YYYY-MM-DD"},
            {"title": "Event Title 3", "date": "YYYY-MM-DD"}
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedContent = JSON.parse(response.text());
      
      setGeneratedPost(generatedContent.post);

      // Add events to calendar (i dont think this works :skull:)
      const newEvents = generatedContent.events.map(event => ({
        ...event,
        extendedProps: { post: generatedContent.post, status: 'pending' }
      }));
      setEvents(prevEvents => [...prevEvents, ...newEvents]);
      
      const calendarApi = calendarRef.current.getApi();
      newEvents.forEach(event => calendarApi.addEvent(event));
    } catch (error) {
      console.error('Error generating post:', error);
    } finally {
      setIsGenerating(false);
    }
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
      const status = event.extendedProps.status;
      if (status === 'pending') {
        const accept = window.confirm(`Accept this event?\n\nTitle: ${event.title}\nDate: ${event.start.toDateString()}`);
        if (accept) {
          event.setExtendedProp('status', 'accepted');
          event.setProp('backgroundColor', 'green');
        } else {
          event.setExtendedProp('status', 'declined');
          event.setProp('backgroundColor', 'red');
        }
      } else {
        alert(`Event: ${event.title}\nDate: ${event.start.toDateString()}\nStatus: ${status}\n\nPost:\n${event.extendedProps.post}`);
      }
    }
  };

  const eventContent = (eventInfo) => {
    if (eventInfo.event.source && eventInfo.event.source.googleCalendarId) {
      return (
        <>
          <b>{eventInfo.timeText}</b>
          <i>{eventInfo.event.title}</i>
          <span style={{marginLeft: '5px', color: 'blue'}}>[ G ]</span>
        </>
      );
    }
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
        {eventInfo.event.extendedProps.status === 'pending' && 
          <span style={{marginLeft: '5px'}}>[ ? ]</span>
        }
        {eventInfo.event.extendedProps.status === 'accepted' && 
          <span style={{marginLeft: '5px', color: 'green'}}>[ ✓ ]</span>
        }
        {eventInfo.event.extendedProps.status === 'declined' && 
          <span style={{marginLeft: '5px', color: 'red'}}>[ ✗ ]</span>
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
        
        <button onClick={generatePost} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Post and Events'}
        </button>
      </div>
      
      {generatedPost && (
        <div className="output-section">
          <h2>Generated Post</h2>
          <div className="post-preview">
            {generatedPost}
          </div>
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
        </div>
      )}

      <div className="calendar-container">
        <h2>Event Calendar</h2>
        <label>
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
          events={events}
          eventClick={handleEventClick}
          eventContent={eventContent}
          googleCalendarApiKey="AIzaSyCvdIUp2Ok6b0ltfS-KsaV75NJy45br-Lo"
          eventSources={[
            ...(showGoogleEvents ? [{
              googleCalendarId: 'e8dc5521652742d79a7882d8ab52d95347e7ce5ee68fd0f3cbd7c52ea921fc2c@group.calendar.google.com',
              color: 'blue',
            }] : [])
          ]}
        />
      </div>
    </div>
  );
};

export default MarketingGenerator;