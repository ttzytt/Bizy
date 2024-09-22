import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './MarketingGenerator.css';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyD8ZZKKoaJ8oKOek7caaiISI45W3U2g2a0'); // Replace with your actual API key

const MarketingGenerator = () => {
  const [eventDescription, setEventDescription] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('casual');
  const [targetAudience, setTargetAudience] = useState('general');
  const [postLength, setPostLength] = useState('medium');

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
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setGeneratedPost(text);
    } catch (error) {
      console.error('Error generating post:', error);
      setGeneratedPost('Failed to generate post. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost)
      .then(() => alert('Post copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="marketing-generator">
      <h1>Instagram Post Generator</h1>
      
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
          {isGenerating ? 'Generating...' : 'Generate Post'}
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
    </div>
  );
};

export default MarketingGenerator;