import { useContext, useState } from 'react';
import { createUserHandle, getUserByHandle } from '../../services/user.service.js';
import { registerUser } from '../../services/auth.service.js';
import { AppContext } from '../../Store/app-context.js';
import { useNavigate } from 'react-router-dom';


/**
 * Register component to handle user registration.
 * @returns 
 */
export const Register = () => {
  const [user, setUser] = useState({
    name: '',
    handle: '',
    email: '',
    password: '',
    isBlocked: false,
    isAdmin: false
  });

  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const register = async () => {
    try {
      const userT = await getUserByHandle(user.handle);
      if (userT.exists()) {
        alert(`User handle ${user.handle} already exists`);
        return;
      }
      const credentials = await registerUser(user.email, user.password);
      await createUserHandle(user.handle, credentials.user.uid, user.email, user.name);
      setAppState({
        user: null,
        userData: null
      });
      navigate('/');
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).")
        alert('Email already in use');
    }
  }

  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value
    });
  };

  return (
    <div>
      <div className="container">
        <h1 className="title">Register</h1>
        <label htmlFor="fullName" className="fullNameLabel">Full Name</label>
        <input value={user.name} onChange={updateUser('name')} type="text" name="fullName" placeholder="First and Last name" className="input" />
        <label htmlFor="handle" className="handleLabel">Username</label>
        <input value={user.handle} onChange={updateUser('handle')} type="text" name="handle" id="handle" placeholder="Username" className="input" />
        <label htmlFor="email" className="emailLabel">Email</label>
        <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" placeholder="Email" className="input" />
        <label htmlFor="password" className="passwordLabel">Password</label>
        <input value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" placeholder="Password" className="input" />

        {(user.email.includes('@') && user.handle && user.password && user.name) && (
          <button className="register" onClick={register}>Register</button>
        )}
      </div>
    </div>
  );
};