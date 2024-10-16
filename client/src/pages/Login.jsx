import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext); // Access dispatch from context
  const [data, setData] = useState({
    username: '',
    password: '',
    serverName: '', // Field for the selected server name
  });
  const [selectedServerId, setSelectedServerId] = useState(''); // Store server ID for login
  const [servers, setServers] = useState([]);

  // Fetch servers on component mount
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const { data: serverData } = await axios.get(
          'http://192.168.23.67:3500/v2/api/servers', // New API route
          {
            withCredentials: false,
            credentials: 'same-origin',
          }
        );

        const sortedServers = serverData.sort((a, b) =>
          a.servername.localeCompare(b.servername)
        );

        // Map server data to store name and ID
        setServers(
          sortedServers.map((server) => ({
            id: server.id,
            name: server.servername,
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
      const { data: responseData } = await axios.post(
        'http://192.168.23.67:3500/v2/api/auth/login', // Updated login route
        {
          user: username,
          pwd: password,
          serverid: selectedServerId, // Use the selected server ID for login
        },
        { withCredentials: false }
      );

      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        // Store employeeId and serverId in cookies
        console.log('Login successful:', responseData);
        document.cookie = `employeeId=${responseData.employeeid}; path=/`;
        document.cookie = `serverId=${responseData.serverId}; path=/`;

        localStorage.setItem('user', JSON.stringify({
          employeeId: responseData.employeeid,
          serverId: responseData.serverId
        }));

        // Dispatch the user information
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

  const handleServerSelection = (e) => {
    const selectedServerName = e.target.value;
    setData({ ...data, serverName: selectedServerName });

    // Find the server by its name and set the corresponding server ID
    const selectedServer = servers.find(
      (server) => server.name === selectedServerName
    );
    if (selectedServer) {
      setSelectedServerId(selectedServer.id); // Set the server ID internally
    }
  };

  return (
    <div>
      <form onSubmit={loginUser}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter Username"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <label>Server</label>
        <input
          type="text"
          list="servers" // Use a datalist for autocomplete
          placeholder="Select or search for a server"
          value={data.serverName}
          onChange={handleServerSelection} // Call custom handler
          required
        />
        <datalist id="servers">
          {servers.map((server) => (
            <option key={server.id} value={server.name}>
              {server.name} {/* Display server name */}
            </option>
          ))}
        </datalist>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
