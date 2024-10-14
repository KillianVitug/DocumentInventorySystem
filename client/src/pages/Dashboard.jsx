import { useContext } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'; // Import the useLogout hook

export default function Dashboard() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { logout } = useLogout(); // Get the logout function from the useLogout hook

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {!!user && (
        <>
          <h2>Logged In: {user.username}</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}
