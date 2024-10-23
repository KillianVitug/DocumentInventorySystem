import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { apiWithoutCredentials } from '../../utils/api';
import Select from 'react-select';

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);
  const [data, setData] = useState({
    username: '',
    password: '',
    serverName: '',
  });
  const [selectedServerId, setSelectedServerId] = useState('');
  const [servers, setServers] = useState([]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const { data: serverData } = await apiWithoutCredentials.get('/v2/api/servers');

        const sortedServers = serverData.sort((a, b) =>
          a.servername.localeCompare(b.servername)
        );

        setServers(
          sortedServers.map((server) => ({
            value: server.id,
            label: server.servername,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch servers:', err);
        toast.error('Failed to load servers');
      }
    };

    fetchServers();
  }, []);

  const loginUser = async (e) => {
    e.preventDefault();
    const { username, password } = data;

    try {
      const { data: responseData } = await apiWithoutCredentials.post('/v2/api/auth/login', {
        user: username,
        pwd: password,
        serverid: selectedServerId,
      });

      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        console.log('Login successful:', responseData);
        document.cookie = `employeeId=${responseData.employeeid}; path=/`;
        document.cookie = `serverId=${responseData.serverId}; path=/`;

        localStorage.setItem(
          'user',
          JSON.stringify({
            employeeId: responseData.employeeid,
            serverId: responseData.serverId,
          })
        );

        dispatch({
          type: 'LOGIN',
          payload: {
            employeeId: responseData.employeeid,
            serverId: responseData.serverId,
          },
        });
        setData({ username: '', password: '', serverName: '' });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed');
    }
  };

  const handleServerSelection = (selectedOption) => {
    setData({ ...data, serverName: selectedOption ? selectedOption.label : '' });
    setSelectedServerId(selectedOption ? selectedOption.value : '');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3 className="text-center mb-4">Login</h3>
          <Form onSubmit={loginUser}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formServer">
              <Form.Label>Server</Form.Label>
              <Select
                options={servers}
                onChange={handleServerSelection}
                placeholder="Select or search for a server"
                isClearable
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
