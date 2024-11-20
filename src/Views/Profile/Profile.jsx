import { useContext, useState, useEffect } from 'react';
import { auth } from '../../config/firebase-config';
import { AppContext } from "../../store/app-context";
import { useNavigate } from 'react-router-dom';
import { updateUser, getUserByHandle } from '../../services/user.service';
import './Profile.css';

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

  const handleSubmit = async () => {
   try {
    await updateUser(userData.handle, userForm);
    setAppState(
        previousState => ({
            ...previousState,
            userData: userForm
        })
    );
    navigate('/profile');
   } catch (error) {
    alert('Error updating user');
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setAppState({
        userForm: null,
        userData: null
      });
      navigate('/');
    });
  };

  if (!userForm) {
    return <div>Loading...</div>;
  }

return (
    <div>
        <div className="container">
            <h1 className="title">Hello {`${userForm.firstName}`}</h1>
            <label htmlFor="firstName">First Name</label>
            <input value={userForm.firstName} onChange={handleUpdate('firstName')} type="text" name="firstName" placeholder="First name" className="firstName"/>
            <label htmlFor="lastName">Last Name</label>
            <input value={userForm.lastName} onChange={handleUpdate('lastName')} type="text" name="lastName" placeholder="Last name" className="lastName"/>
            <label htmlFor="handle">Username</label>
            <input value={userForm.handle} readOnly onChange={handleUpdate('handle')} type="text" name="handle" id="handle" placeholder="Username" className="handle" />
            <label htmlFor="email">Email</label>
            <input value={userForm.email} readOnly type="email" name="email" id="email" placeholder="Email" className="email"/>
            <label htmlFor="Phone">Phone</label>
            <input value={userForm.phone} onChange={handleUpdate('phone')} type="text" name="phone" id="phone" placeholder="Phone" className="phone"/>
            <label htmlFor="Address">Address</label>
            <input value={userForm.address} onChange={handleUpdate('address')} type="text" name="address" id="address" placeholder="Address" className="address"/>

            <div className="button-container">
            {(userForm.firstName !== userData.firstName || userForm.lastName !== userData.lastName || userForm.phone !== userData.phone || userForm.address !== userData.address) && (
                    <button className="update" onClick={handleSubmit}>Update</button>
            )}
                <button className="logout" onClick={handleLogout}>Logout</button>
            </div>

        </div>
    </div>
);
};