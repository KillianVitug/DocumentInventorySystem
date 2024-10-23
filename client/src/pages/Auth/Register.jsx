import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../hooks/useRegister';

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    role: '',
    password: '',
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { username, role, password } = data;
    try {
      const { data } = await axios.post('/register', {
        user: username,
        roles: [role],
        pwd: password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({ username: '', role: '', password: '' });
        toast.success('User Created');
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      toast.error('Registration failed');
    }
  };

  return (
    <div>
      <form onSubmit={registerUser}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter Username"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <label>Role</label>
        <select
          value={data.role}
          onChange={(e) => setData({ ...data, role: e.target.value })}
        >
          <option value="">Select a role</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="User">User</option>
        </select>
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
