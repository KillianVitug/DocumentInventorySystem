import React, { useState, useEffect } from 'react';
import { Table, Container, Form, Button, Row, Col, Pagination } from 'react-bootstrap';
import { apiWithCredentials } from '../../../utils/api'; // Assuming this is where your custom API call function is located

export default function PurchasesTablePage() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [servers, setServers] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [serverId, setServerId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50;

  // Fetch Suppliers and Servers
  useEffect(() => {
    fetchSuppliers();
    fetchServers();
  }, []);

  // Fetch Purchases when currentPage changes
//   useEffect(() => {
//     fetchPurchases(startDate, endDate, currentPage, serverId);
//   }, [currentPage]);

  const fetchPurchases = async (start = '', end = '', server = '') => {
    try {
      const response = await apiWithCredentials.get('/v2/api/purchases', {
        params: {
          purchasedate_start: start,
          purchasedate_end: end,
          serverId: server,
        },
      });
  
      setPurchases(response.data);
      setTotalPages(Math.max(1, Math.ceil(response.data.length / itemsPerPage)));
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };
  
  

  const fetchSuppliers = async () => {
    try {
      const response = await apiWithCredentials.get('/v2/api/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await apiWithCredentials.get('/v2/api/servers');
      setServers(response.data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  };

  // Handle form submission to filter dates
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on filter
    await fetchPurchases(startDate, endDate, 1, serverId);
  };

  // Helper function to get supplier name by supplier ID
  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((sup) => sup.supplierid === supplierId);
    return supplier ? supplier.name : 'Unknown';
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  

  return (
    <Container className="my-5">
      <h2>Purchases</h2>
      <Form onSubmit={handleFilterSubmit} className="mb-4">
        <Row className="align-items-end">
          <Col xs={12} md={3}>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group controlId="serverId">
              <Form.Label>Server</Form.Label>
              <Form.Control
                as="select"
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
              >
                <option value="">Select Server</option>
                {servers.map((server) => (
                  <option key={server.id} value={server.id}>
                    {server.servername}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Button variant="primary" type="submit" className="w-100">
              Filter
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <Table striped bordered hover responsive size="sm">
  <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
    <tr>
      <th style={{ whiteSpace: 'nowrap' }}>
        <input type="checkbox" />
      </th>
      <th style={{ whiteSpace: 'nowrap' }}>Purchase ID</th>
      <th style={{ whiteSpace: 'nowrap' }}>Purchase Date</th>
      <th style={{ whiteSpace: 'nowrap' }}>Supplier Name</th>
      <th style={{ whiteSpace: 'nowrap' }}>Reference Number</th>
      <th style={{ whiteSpace: 'nowrap' }}>Memo</th>
      <th style={{ whiteSpace: 'nowrap' }}>Total</th>
      <th style={{ whiteSpace: 'nowrap' }}>Employee ID</th>
      <th style={{ whiteSpace: 'nowrap' }}>Is Received</th>
      <th style={{ whiteSpace: 'nowrap' }}>Date Created</th>
      <th style={{ whiteSpace: 'nowrap' }}>Date Modified</th>
      <th style={{ whiteSpace: 'nowrap' }}>Delivery Date</th>
      <th style={{ whiteSpace: 'nowrap' }}>Supplier Class ID</th>
      <th style={{ whiteSpace: 'nowrap' }}>Billed Status</th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(purchases) && purchases.length > 0 ? (
      purchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((purchase) => (
        <tr key={purchase.purchaseheaderid}>
          <td>
            <input type="checkbox" />
          </td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.purchaseheaderid}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.purchasedate}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{getSupplierName(purchase.supplierid)}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.refnumber}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.memo}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.total}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.employeeid}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.isreceived ? 'Yes' : 'No'}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.datecreated}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.datemodified}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.deliverydate}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.supplierclassid}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{purchase.billedstatus}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="14" className="text-center">No purchases found</td>
      </tr>
    )}
  </tbody>
</Table>

      </div>



      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      )}
    </Container>
  );
}
