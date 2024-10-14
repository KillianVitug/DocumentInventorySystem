import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  if (location.pathname === '/login') {
    return null; // Hide NavBar on the login page
  }
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/documents">Documents</Link>
      <Link to="/register">Add User</Link>
      <Link to="/delivery">Delivery</Link>
    </nav>
  );
}
