import React, { useState, useEffect } from 'react';
import { apiWithCredentials } from '../../utils/api';
import { Container, Row, Col, Form, Button, Table, Spinner } from 'react-bootstrap';

export default function Delivery() {
  const [supplierName, setSupplierName] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [servers, setServers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [principals, setPrincipals] = useState([]);
  const [purchasesByServer, setPurchasesByServer] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch suppliers, principals, and servers
  useEffect(() => {
    const fetchSuppliersPrincipalsAndServers = async () => {
      try {
        const [suppliersResponse, principalsResponse, serversResponse] = await Promise.all([
          apiWithCredentials.get('/v2/api/suppliers'),
          apiWithCredentials.get('/v2/api/principals'),
          apiWithCredentials.get('/v2/api/servers'),
        ]);

        setSuppliers(suppliersResponse.data.map((supplier) => supplier.name));
        setPrincipals(principalsResponse.data.map((principal) => principal.name));
        setServers(
          serversResponse.data.map((server) => ({
            id: server.id,
            name: server.servername,
          }))
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSuppliersPrincipalsAndServers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (principalName) {
      setLoading(true);
      try {
        const newPurchasesByServer = {};

        await Promise.all(
          servers.map(async (server) => {
            try {
              const purchaseResponse = await apiWithCredentials.get(
                '/v2/api/purchases/getLastThreeByPrincipalName',
                {
                  params: {
                    serverId: server.id,
                    principalName: principalName,
                  },
                }
              );

              newPurchasesByServer[server.id] = purchaseResponse.data;
            } catch (error) {
              console.error(`Error fetching purchases for server ${server.id}:`, error);
            }
          })
        );

        setPurchasesByServer(newPurchasesByServer);
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Delivery</h1>

      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="align-items-center">
          <Col md={4} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              list="suppliers"
              placeholder="Supplier Name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
            <datalist id="suppliers">
              {suppliers.map((supplier, index) => (
                <option key={index} value={supplier} />
              ))}
            </datalist>
          </Col>

          <Col md={4} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              list="principals"
              placeholder="Principal Name"
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
            />
            <datalist id="principals">
              {principals.map((principal, index) => (
                <option key={index} value={principal} />
              ))}
            </datalist>
          </Col>

          <Col md={4}>
            <Button type="submit" variant="primary" className="w-100">
              {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Find'}
            </Button>
          </Col>
        </Row>
      </Form>

      <Row>
        <Col>
          <Table striped bordered hover responsive>
            {/* <caption>Warehouse</caption> */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Server</th>
                <th>Supplier and Date Received</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                servers.map((server) => {
                  const purchases = purchasesByServer[server.id] || [];
                  const combinedPurchases = purchases.map((purchase, index) => (
                    <span key={index}>
                      {purchase.name} - <strong>{purchase.purchasedate}</strong>
                      {index < purchases.length - 1 && ', '}
                    </span>
                  ));

                  return (
                    <tr key={server.id}>
                      <td>{server.id}</td>
                      <td>{server.name}</td>
                      <td>{combinedPurchases.length > 0 ? combinedPurchases : 'No purchases found'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
