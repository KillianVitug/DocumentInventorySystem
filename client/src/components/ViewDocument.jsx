import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocumentsContext } from '../hooks/useDocumentsContext';
import axios from 'axios';


export default function ViewDocument() {
  const { id } = useParams(); // Get the document ID from the URL
  const [document, setDocument] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch the specific document by ID
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`/documents/${id}`);
        setDocument(response.data);
        setImages(response.data.imageUrl || []); // Assuming imageUrls is an array of image paths
        setLoading(false);
      } catch (error) {
        setError('Error fetching document details');
        setLoading(false);
      }
    };

    if (id) {
      // Ensure id is defined
      fetchDocument();
    } else {
      setError('Invalid document ID');
      setLoading(false);
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/documents/edit/${id}`); // Navigate to the edit document page
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await axios.delete(`/documents/${id}`);
        navigate('/documents'); // Redirect to the documents list after deletion
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete the document. Please try again.');
      }
    }
  };
  
   const handleDownloadPdf = (id) => {
     window.location.href = `/documents/downloadPdf/${id}`;
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
      <h1>Document Details</h1>
      {document && (
        <>
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Company</th>
                <th>Uploaded At</th>
                <th>Images</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{document.name}</td>
                <td>{document.description}</td>
                <td>{document.type}</td>
                <td>{document.company}</td>
                <td>{new Date(document.uploadedAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDownloadPdf(document._id)}>
                    Download PDF
                  </button>
                </td>
                <td>
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <h2>Images</h2>
          {images.length > 0 ? (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {images.map((imageUrl, index) => (
                <div className="image-container" key={index}>
                  <img
                    src={`${backendURL}${imageUrl}`} // Correctly referencing backend
                    alt={`Document ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No images available for this document</p>
          )}
        </>
      )}
    </div>
  );
}
