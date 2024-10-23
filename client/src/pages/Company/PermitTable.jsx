import React from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';

export default function PermitTable({ permits, handleEdit, handleDelete, handleCopyAsNew, paginate, totalPermits, permitsPerPage, terminalTypes, servers }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPermits / permitsPerPage); i++) {
    pageNumbers.push(i);
  }

  const getTerminalTypeName = (terminaltypeid) => {
    const type = terminalTypes.find((t) => t.terminaltypeid === terminaltypeid);
    return type ? type.terminaltypename : terminaltypeid;
  };

  const getServerName = (serverid) => {
    const server = servers.find((s) => s.id === serverid);
    return server ? server.servername : serverid;
  };

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Proprietor Name</th>
            <th>Business Name</th>
            <th>Address</th>
            <th>TIN Number</th>
            <th>Terminal Type</th>
            <th>Brand Name</th>
            <th>Model Name</th>
            <th>Serial Number</th>
            <th>Permit Number</th>
            <th>Software Name</th>
            <th>MIN Number</th>
            <th>Server</th>
            <th>Local Terminal ID</th>
            <th>Is Cancelled</th>
            <th>Is Active DB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permits.length > 0 ? (
            permits.map((permit) => (
              <tr key={permit.terminalid}>
                <td>{permit.terminalid}</td>
                <td>{permit.proprietorname}</td>
                <td>{permit.businessname}</td>
                <td>{permit.address}</td>
                <td>{permit.tinnumber}</td>
                <td>{getTerminalTypeName(permit.terminaltypeid)}</td>
                <td>{permit.brandname}</td>
                <td>{permit.modelname}</td>
                <td>{permit.serialno}</td>
                <td>{permit.permitno}</td>
                <td>{permit.softwarename}</td>
                <td>{permit.minnumber}</td>
                <td>{getServerName(permit.serverid)}</td>
                <td>{permit.localterminalid}</td>
                <td>{permit.iscancelled ? 'Yes' : 'No'}</td>
                <td>{permit.isactivedb ? 'Yes' : 'No'}</td>
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
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleCopyAsNew(permit)}
                  >
                    Copy as New
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(permit.terminalid)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="17" className="text-center">
                No permits available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        {pageNumbers.map((number) => (
          <Pagination.Item key={number} onClick={() => paginate(number)}>
            {number}
          </Pagination.Item>
        ))}
      </Pagination>
    </>
  );
}