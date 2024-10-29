import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { apiWithCredentials } from '../../utils/api';
import PurchasesTableForm from './PurchasesTableForm';

// import PermitForm from './PermitForm';
// import PermitTable from './PermitTable';
export default function PurchasesTablePage() {
  const [purchases, setPurchases] = useState([]);
  const [purchaseData, setPurchaseData] = useState({});
  const [servers, setServers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [purchasesPerPage] = useState(20);

  // Fetch Purchases and Servers (Read)

  useEffect(() => {
    const fetchAllData = async () => {
      console.log('Fetching all data...');
      


export default function BirPermitsCrudPage() {
  const [permits, setPermits] = useState([]);
  const [permitData, setPermitData] = useState({});
  const [terminalTypes, setTerminalTypes] = useState([]);
  const [servers, setServers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [permitsPerPage] = useState(20);

  // Fetch BIR Permits, Terminal Types, and Servers (Read)
  useEffect(() => {
    const fetchAllData = async () => {
      console.log('Fetching all data...');
      try {
        const permitsPromise = apiWithCredentials.get('/v2/api/bir-permits');
        const terminalTypesPromise = apiWithCredentials.get(
          '/v2/api/bir-permit-types'
        );
        const serversPromise = apiWithCredentials.get('/v2/api/servers');

        const [permitsResponse, terminalTypesResponse, serversResponse] =
          await Promise.all([
            permitsPromise,
            terminalTypesPromise,
            serversPromise,
          ]);

        setPermits(permitsResponse.data);
        console.log('Permits fetched:', permitsResponse.data);
        setTerminalTypes(terminalTypesResponse.data);
        console.log('Terminal Types fetched:', terminalTypesResponse.data);
        setServers(serversResponse.data);
        console.log('Servers fetched:', serversResponse.data);
      } catch (error) {
        if (
          error.response &&
          error.response.config.url.includes('/v2/api/bir-permits')
        ) {
          console.error('Error fetching permits:', error);
        } else if (
          error.response &&
          error.response.config.url.includes('/v2/api/bir-permit-types')
        ) {
          console.error('Error fetching terminal types:', error);
        } else if (
          error.response &&
          error.response.config.url.includes('/v2/api/servers')
        ) {
          console.error('Error fetching servers:', error);
        } else {
          console.error('General error fetching data:', error);
        }
      }
    };
    fetchAllData();
  }, []);

  // Create or Update BIR Permit
  const handleFormSubmit = async (data) => {
    // Ensure fields are empty strings if left blank
    const fields = [
      'proprietorname',
      'businessname',
      'address',
      'tinnumber',
      'brandname',
      'modelname',
      'serialno',
      'permitno',
      'softwarename',
      'minnumber',
    ];
    fields.forEach((field) => {
      data[field] = data[field] || '';
    });

    console.log('Form data being submitted:', data);
    try {
      if (editMode) {
        // Update permit - Include ID in the payload
        const response = await apiWithCredentials.put('/v2/api/bir-permits', {
          ...permitData,
          ...data,
        });
        console.log('API response for updating permit:', response.data);
      } else {
        // Create permit
        const response = await apiWithCredentials.post(
          '/v2/api/bir-permits',
          data
        );
        console.log('API response for creating permit:', response.data);
      }
      fetchPermits(); // Refresh permits list
      setEditMode(false);
      setPermitData({});
    } catch (error) {
      console.error(
        `Error ${editMode ? 'updating' : 'creating'} permit:`,
        error
      );
    }
  };

  const fetchPermits = async () => {
    console.log('Fetching permits...');
    try {
      const response = await apiWithCredentials.get('/v2/api/bir-permits');
      setPermits(response.data);
      console.log('Permits fetched:', response.data);
    } catch (error) {
      console.error('Error fetching BIR permits:', error);
    }
  };

  // Delete Permit - Include ID in the payload
  const handleDelete = async (id) => {
    try {
      await apiWithCredentials.delete('/v2/api/bir-permits', {
        data: { terminalid: id },
      });
      fetchPermits(); // Refresh permits list
    } catch (error) {
      console.error('Error deleting permit:', error);
    }
  };

  // Edit Permit
  const handleEdit = (permit) => {
    setEditMode(true);
    setPermitData({ ...permit });
  };

  // Copy Permit as New Entry
  const handleCopyAsNew = (permit) => {
    const newPermitData = { ...permit };
    delete newPermitData.terminalid; // Remove ID to create a new entry
    setEditMode(false);
    setPermitData(newPermitData);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get current permits
  const indexOfLastPermit = currentPage * permitsPerPage;
  const indexOfFirstPermit = indexOfLastPermit - permitsPerPage;
  const currentPermits = permits.slice(indexOfFirstPermit, indexOfLastPermit);

  return (
    <Container className="my-5">
      <h2>BIR Permits Management</h2>
      <PermitForm
        defaultValues={permitData}
        handleFormSubmit={handleFormSubmit}
        editMode={editMode}
        terminalTypes={terminalTypes}
        servers={servers}
      />
      <PermitTable
        permits={currentPermits}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleCopyAsNew={handleCopyAsNew}
        paginate={paginate}
        totalPermits={permits.length}
        permitsPerPage={permitsPerPage}
        terminalTypes={terminalTypes}
        servers={servers}
      />
    </Container>
  );
}
