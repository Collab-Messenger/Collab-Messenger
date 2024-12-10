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
      setAppState({
        user: credentials.user,
      });
      navigate('/');
    } catch (error) {
      alert('Invalid email or password');
    }
  };

return (
    <div className="ml-[700px] self-center">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
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
            <input value={form.email} onChange={updateUser('email')} type="email" placeholder="Email" name="email" id="email" className="grow" />
        </label>
        <label className="input input-bordered flex items-center mt-5">
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
            <input value={form.password} onChange={updateUser('password')} type="password" placeholder="Password" name="password" id="password" className="grow" />
        </label>
        {form.email.includes('@') && (
            <button className="btn btn-primary mt-3" onClick={checkLogin}>Login</button>
        )}
        <NavLink className="signUpText" to='/register'>If you do not have an account you can <span>Sign Up</span> here</NavLink>
    </div>
);
}