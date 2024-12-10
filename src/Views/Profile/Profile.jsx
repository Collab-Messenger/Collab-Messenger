/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from 'react';
import { auth } from '../../config/firebase-config';
import { AppContext } from "../../store/app-context";
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../services/user.service';

/**
 * Profile component to display and update user profile information.
 * @returns 
 */
export const Profile = () => {
  const { userData, setAppState } = useContext(AppContext);
  const [userForm, setUserForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
        setUserForm(userData);
    }
  }, [userData]);
  
  const handleUpdate = (prop) => (e) => {
    setUserForm({
      ...userForm,
      [prop]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await updateUser(userForm);
      setAppState({
        user: userData,
        userData: userForm,
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!userForm) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ml-[600px] self-center">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <label className="input input-bordered flex items-center gap-2 mt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path
            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input value={userForm.email} readOnly type="email" name="email" id="email" placeholder="Email" className="grow" />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input value={userForm.handle} readOnly type="text" name="handle" id="handle" placeholder="Username" className="grow" />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd" />
        </svg>
        <input value={userForm.firstName} onChange={handleUpdate('firstName')} type="text" name="firstName" placeholder="First name" className="grow" />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd" />
        </svg>
        <input value={userForm.lastName} onChange={handleUpdate('lastName')} type="text" name="lastName" placeholder="Last name" className="grow" />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd" />
        </svg>
        <input value={userForm.phone} onChange={handleUpdate('phone')} type="text" name="phone" id="phone" placeholder="Phone" className="grow" />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd" />
        </svg>
        <input value={userForm.address} onChange={handleUpdate('address')} type="text" name="address" id="address" placeholder="Address" className="grow" />
      </label>
      <div className="button-container mt-5">
        {(userForm.firstName !== userData.firstName || userForm.lastName !== userData.lastName || userForm.phone !== userData.phone || userForm.address !== userData.address) && (
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        )}
      </div>
    </div>
  );
};

export default Profile;