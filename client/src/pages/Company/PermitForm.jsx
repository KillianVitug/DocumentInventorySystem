import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';

export default function PermitForm({ defaultValues, handleFormSubmit, editMode, terminalTypes, servers }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="mb-4">
      <Form.Group controlId="formProprietorName">
        <Form.Label>Proprietor Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter proprietor name"
          {...register('proprietorname')}
        />
      </Form.Group>

      <Form.Group controlId="formBusinessName" className="mt-3">
        <Form.Label>Business Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter business name"
          {...register('businessname')}
        />
      </Form.Group>

      <Form.Group controlId="formAddress" className="mt-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          {...register('address')}
        />
      </Form.Group>

      <Form.Group controlId="formTinNumber" className="mt-3">
        <Form.Label>TIN Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter TIN number"
          {...register('tinnumber')}
        />
      </Form.Group>

      <Form.Group controlId="formTerminalTypeId" className="mt-3">
        <Form.Label>Terminal Type</Form.Label>
        <Form.Control
          as="select"
          {...register('terminaltypeid', { required: 'Terminal type is required' })}
        >
          <option value="">Select Terminal Type</option>
          {terminalTypes.map((type) => (
            <option key={type.terminaltypeid} value={type.terminaltypeid}>
              {type.terminaltypename}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formBrandName" className="mt-3">
        <Form.Label>Brand Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter brand name"
          {...register('brandname')}
        />
      </Form.Group>

      <Form.Group controlId="formModelName" className="mt-3">
        <Form.Label>Model Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter model name"
          {...register('modelname')}
        />
      </Form.Group>

      <Form.Group controlId="formSerialNo" className="mt-3">
        <Form.Label>Serial Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter serial number"
          {...register('serialno')}
        />
      </Form.Group>

      <Form.Group controlId="formPermitNo" className="mt-3">
        <Form.Label>Permit Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter permit number"
          {...register('permitno')}
        />
      </Form.Group>

      <Form.Group controlId="formSoftwareName" className="mt-3">
        <Form.Label>Software Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter software name"
          {...register('softwarename')}
        />
      </Form.Group>

      <Form.Group controlId="formMinNumber" className="mt-3">
        <Form.Label>MIN Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter MIN number"
          {...register('minnumber')}
        />
      </Form.Group>

      <Form.Group controlId="formServerId" className="mt-3">
        <Form.Label>Server</Form.Label>
        <Form.Control
          as="select"
          {...register('serverid', { required: 'Server is required' })}
        >
          <option value="">Select Server</option>
          {servers.map((server) => (
            <option key={server.id} value={server.id}>
              {server.servername}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formLocalTerminalId" className="mt-3">
        <Form.Label>Local Terminal ID</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter local terminal ID"
          {...register('localterminalid')}
        />
      </Form.Group>

      <Form.Group controlId="formIsCancelled" className="mt-3">
        <Form.Label>Is Cancelled</Form.Label>
        <Form.Check
          type="checkbox"
          label="Cancelled"
          {...register('iscancelled')}
        />
      </Form.Group>

      <Form.Group controlId="formIsActiveDB" className="mt-3">
        <Form.Label>Is Active DB</Form.Label>
        <Form.Check
          type="checkbox"
          label="Active"
          {...register('isactivedb')}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-4">
        {editMode ? 'Update Permit' : 'Add Permit'}
      </Button>
    </Form>
  );
}