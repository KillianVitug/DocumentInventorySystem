import { useEffect } from 'react';
import { useDocumentsContext } from '../hooks/useDocumentsContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Documents() {
  const { documents, dispatch } = useDocumentsContext();
  const navigate = useNavigate(); // For navigation to the edit page and add form

  // Fetch documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('/documents'); // Adjust the URL if necessary
        if (Array.isArray(response.data)) {
          dispatch({ type: 'SET_DOCUMENTS', payload: response.data }); // Use response.data directly
        } else {
          throw new Error('Unexpected response data format');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [dispatch]);

 

  const handleAddDocument = () => {
    navigate('/documents/add'); // Navigate to the Add Document form
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Documents</h1>
        <button onClick={handleAddDocument}>Add Document</button>
      </div>

      {documents === null ? (
        <p>Loading...</p> // Display a loading message while fetching data
      ) : documents.length === 0 ? (
        <p>No documents found</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Company</th>
              <th>Uploaded At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document._id}>
                <td>{document.name}</td>
                <td>{document.description}</td>
                <td>{document.type}</td>
                <td>{document.company}</td>
                <td>{new Date(document.uploadedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => navigate(`/documents/view/${document._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
