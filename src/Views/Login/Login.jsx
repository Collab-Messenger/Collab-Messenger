// import './Login.css';
import { useState, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../store/app-context";
import { loginUser } from "../../services/auth.service";
import { setUserOnlineStatus } from "../../services/user.service";
// import { FaArrowRight } from "react-icons/fa";

/**
 * Login component to handle user login.
 * @returns 
 */
export function Login() {
  const { user, setAppState } = useContext(AppContext);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const updateUser = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value
    });
  };

  const navigate = useNavigate();
  const location = useLocation();

  const checkLogin = async () => {
    try {
      const credentials = await loginUser(form.email, form.password);
      setUserOnlineStatus(credentials.user.handle);
      console.log(credentials);
      setAppState({
        user: credentials.user,
      });
      navigate('/');
    } catch (error) {
      alert('Invalid email or password');
    }
  };

  return (
    <div>
      <div className="container">
        <h1 className='title'>Login</h1>
        <label htmlFor="email" className="emailLabel">Email</label>
        <input value={form.email} onChange={updateUser('email')} type="email" placeholder="Email" name="email" id="email" className="email" />
        <label htmlFor="password" className="passwordLabel">Password</label>
        <input value={form.password} onChange={updateUser('password')} type="password" placeholder="Password" name="password" id="password" className="password" />
        {form.email.includes('@') && (
          <button className="arrow" onClick={checkLogin}>login</button>
        )}
        <NavLink className="signUpText" to='/register'>If you do not have account you can <span> `Sign Up` </span> here</NavLink>
      </div>
    </div>
  );
}