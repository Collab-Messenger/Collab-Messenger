import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

const LogoutForm = () => {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      // Redirect to login or home page if needed
      // e.g., navigate("/login") using react-router
    } catch (error) {
      console.error('Error logging out: ', error.message);
    }
  };

  return (
    <div className="logout-form">
      <button
        onClick={handleLogout}
        className="btn btn-primary"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutForm;
