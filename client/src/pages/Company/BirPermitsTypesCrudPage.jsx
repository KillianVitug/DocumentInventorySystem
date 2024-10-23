import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Container } from 'react-bootstrap';
import { apiWithCredentials } from '../../utils/api'; // Assuming this is where your custom API call function is located

export default function BirPermitTypesCrudPage() {
  const [permitTypes, setPermitTypes] = useState([]);
  const [permitData, setPermitData] = useState({ terminaltypeid: '', terminaltypename: '' });
  const [editMode, setEditMode] = useState(false);

  // Fetch BIR Permit Types (Read)
  useEffect(() => {
    fetchPermitTypes();
  }, []);

  const fetchPermitTypes = async () => {
    try {
      const response = await apiWithCredentials.get('/v2/api/bir-permit-types');
      setPermitTypes(response.data);
    } catch (error) {
      console.error('Error fetching BIR permit types:', error);
    }
  };

  // Create or Update BIR Permit Type
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      // Update permit type - Include ID in the payload
      try {
        await apiWithCredentials.put('/v2/api/bir-permit-types', permitData);
        fetchPermitTypes(); // Refresh permit types list
        setEditMode(false);
        setPermitData({ terminaltypeid: '', terminaltypename: '' });
      } catch (error) {
        console.error('Error updating permit type:', error);
      }
    } else {
      // Create permit type
      try {
        await apiWithCredentials.post('/v2/api/bir-permit-types', permitData);
        fetchPermitTypes(); // Refresh permit types list
        setPermitData({ terminaltypeid: '', terminaltypename: '' });
      } catch (error) {
        console.error('Error creating permit type:', error);
      }
    }
  };

  // Delete Permit Type - Include ID in the payload
  const handleDelete = async (id) => {
    try {
      await apiWithCredentials.delete('/v2/api/bir-permit-types', { data: { terminaltypeid: id } });
      fetchPermitTypes(); // Refresh permit types list
    } catch (error) {
      console.error('Error deleting permit type:', error);
    }
  };

  // Edit Permit Type
  const handleEdit = (permit) => {
    setEditMode(true);
    setPermitData({ terminaltypeid: permit.terminaltypeid, terminaltypename: permit.terminaltypename });
  };

  return (
    <Container className="my-5">
      <h2>BIR Permit Types Management</h2>

      {/* Create / Update Form */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="formPermitTypeName">
          <Form.Label>Permit Type Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter permit type name"
            value={permitData.terminaltypename}
            onChange={(e) => setPermitData({ ...permitData, terminaltypename: e.target.value })}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          {editMode ? 'Update Permit Type' : 'Add Permit Type'}
        </Button>
      </Form>

      {/* Permit Types List Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Permit Type Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permitTypes.length > 0 ? (
            permitTypes.map((permit) => (
              <tr key={permit.terminaltypeid}>
                <td>{permit.terminaltypeid}</td>
                <td>{permit.terminaltypename}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(permit)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(permit.terminaltypeid)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No permit types available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
