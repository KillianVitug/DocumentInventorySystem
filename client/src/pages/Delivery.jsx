import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Delivery() {
  const [supplierName, setSupplierName] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [servers, setServers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [principals, setPrincipals] = useState([]);
  const [purchasesByServer, setPurchasesByServer] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch suppliers, principals, and servers
  useEffect(() => {
    const fetchSuppliersPrincipalsAndServers = async () => {
      try {
        const [suppliersResponse, principalsResponse, serversResponse] =
          await Promise.all([
            axios.get('http://192.168.23.67:3500/v2/api/suppliers', {
              withCredentials: false,
            }),
            axios.get('http://192.168.23.67:3500/v2/api/principals', {
              withCredentials: false,
            }),
            axios.get('http://192.168.23.67:3500/v2/api/servers', {
              withCredentials: false,
            }),
          ]);

        // Map supplier names for the autocomplete dropdown
        setSuppliers(suppliersResponse.data.map((supplier) => supplier.name));
        setPrincipals(
          principalsResponse.data.map((principal) => principal.name)
        );

        // Map server names and IDs
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
      setLoading(true); // Set loading to true when starting the search
      try {
        const newPurchasesByServer = {};

        // Iterate over each server and fetch the last three purchases
        await Promise.all(
          servers.map(async (server) => {
            try {
              const purchaseResponse = await axios.get(
                'http://192.168.23.67:3500/v2/api/purchases/getLastThreeByPrincipalName',
                {
                  params: {
                    serverId: server.id, // Include server ID as query param
                    principalName: principalName, // Include principal name as query param
                  },
                  withCredentials: false,
                }
              );

              // Store the purchase results by server
              newPurchasesByServer[server.id] = purchaseResponse.data;
            } catch (error) {
              console.error(
                `Error fetching purchases for server ${server.id}:`,
                error
              );
            }
          })
        );

        setPurchasesByServer(newPurchasesByServer);
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        setLoading(false); // Stop the loading state after search completes
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <h1>Delivery</h1>

      <form
        onSubmit={handleSearch}
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <input
          type="text"
          list="suppliers"
          placeholder="Supplier Name"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          style={{ flex: 1 }}
        />
        <datalist id="suppliers">
          {suppliers.map((supplier, index) => (
            <option key={index} value={supplier} />
          ))}
        </datalist>

        <input
          type="text"
          list="principals"
          placeholder="Principal Name"
          value={principalName}
          onChange={(e) => setPrincipalName(e.target.value)}
          style={{ flex: 1 }}
        />
        <datalist id="principals">
          {principals.map((principal, index) => (
            <option key={index} value={principal} />
          ))}
        </datalist>

        <button type="submit">Find</button>
      </form>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0 20px',
          gap: '20px',
        }}
      >
        <table border="1" cellPadding="10" cellSpacing="0" style={{ flex: 1 }}>
          <caption>Warehouse</caption>
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
                <td colSpan="3">Loading...</td>
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
                    <td>
                      {combinedPurchases.length > 0
                        ? combinedPurchases
                        : 'No purchases found'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
