import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDocumentsContext } from '../hooks/useDocumentsContext';

export default function EditDocumentForm() {
  const { id } = useParams();
  const { dispatch } = useDocumentsContext();
  const navigate = useNavigate();

  const [document, setDocument] = useState({
    name: '',
    description: '',
    type: '',
    company: '',
    uploadedAt: '',
    old_images: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch document details by ID to pre-fill the form
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`/documents/${id}`);
        setDocument({
          name: response.data.name,
          description: response.data.description,
          type: response.data.type,
          company: response.data.company,
          uploadedAt: response.data.uploadedAt,
          old_images: response.data.imageUrl || [],
        });
        setLoading(false);
      } catch (error) {
        setError('Error fetching document details');
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDocument({ ...document, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.name);
    formData.append('description', document.description);
    formData.append('type', document.type);
    formData.append('company', document.company);
    formData.append('uploadedAt', document.uploadedAt);
    formData.append('old_images', JSON.stringify(document.old_images));

    if (newImages.length > 0) {
      Array.from(newImages).forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      const response = await axios.patch(`/documents/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch({ type: 'UPDATE_DOCUMENT', payload: response.data });
      navigate(`/documents/view/${id}`);
    } catch (error) {
      setError('Error updating document');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3500';
  return (
    <div>
      <h1>Edit Document</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={document.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={document.description}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={document.type}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Company:
          <input
            type="text"
            name="company"
            value={document.company}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Uploaded At:
          <input
            type="date"
            name="uploadedAt"
            value={new Date(document.uploadedAt).toISOString().split('T')[0]}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Current Images:
          {document.old_images.length > 0 ? (
            <div>
              {document.old_images.map((image, index) => (
                <img
                  key={index}
                  src={`${backendURL}${image}`}
                  alt={`Document ${index + 1}`}
                  width="200"
                  style={{ margin: '10px' }} // Add margin between images
                />
              ))}
            </div>
          ) : (
            <p>No images available for this document.</p>
          )}
        </label>
        <label>
          Upload New Images (optional):
          <input
            type="file"
            name="images"
            onChange={handleFileChange}
            multiple
          />
        </label>
        <button type="submit">Update Document</button>
      </form>
    </div>
  );
}
