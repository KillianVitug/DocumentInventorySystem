import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext'; // Adjust path as necessary
import { useDocumentsContext } from '../hooks/useDocumentsContext';

export default function AddDocumentForm() {
  const { dispatch } = useDocumentsContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [company, setCompany] = useState('');
  const [images, setImages] = useState(null); // For file uploads
  const { user } = useContext(UserContext); // Use the user context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('company', company);
   if (images.length > 0) {
     images.forEach((image) => {
       formData.append('images', image); // Use 'images' to match backend
     });
   }

    try {
      // Optionally, include user info in the request if needed
      const response = await axios.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true, // Send cookies along with request
      });
      dispatch({ type: 'CREATE_DOCUMENT', payload: response.data });
      navigate('/documents'); // Redirect to documents list after submission
    } catch (err) {
      console.error('Error adding document:', err);
      alert('Failed to add document. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  return (
    <div>
      <h2>Add New Document</h2>
      {user ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Type:</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Company:</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Image:</label>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*" // Optional: restrict to image files
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>You need to be logged in to add a document.</p>
      )}
    </div>
  );
}
