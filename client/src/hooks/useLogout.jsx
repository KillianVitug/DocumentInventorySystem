import { useUserContext } from './useUserContext'; // Adjust based on your auth context setup
import { useDocumentsContext } from './useDocumentsContext';
import axios from 'axios';

export const useLogout = () => {
  const { dispatch } = useUserContext();
  const { dispatch: dispatchDocuments } = useDocumentsContext();

  const logout = async () => {
    try {
      // Call the backend API to handle the logout and clear the token
      await axios.post('/logout', {}, { withCredentials: false });

      // Remove user from local storage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken'); // Make sure this line exists

      // Dispatch logout action to update the context state
      dispatch({ type: 'LOGOUT' });
      dispatchDocuments({ type: 'SET_DOCUMENTS', payload: null });

      // Optionally clear cookies manually if needed in the frontend
      document.cookie =
        'employeeId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'serverId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { logout };
};
