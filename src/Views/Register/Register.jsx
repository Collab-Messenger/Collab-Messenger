import { useContext, useState } from 'react';
import { createUserHandle, getUserByHandle } from '../../services/user.service.js';
import { registerUser } from '../../services/auth.service.js';
import { AppContext } from '../../store/app-context.js';
import { useNavigate } from 'react-router-dom';


/**
 * Register component to handle user registration.
 * @returns 
 */
export const Register = () => {
    const [user, setUser] = useState({
      handle: '',
      email: '',
      password: '',
      isBlocked: false,
      isAdmin: false
    });
  
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();
  
    const register = async () => {
        console.log('1');
      try {
        const userT = await getUserByHandle(user.handle);
        if (userT.exists()) {
          alert(`User handle ${user.handle} already exists`);
          return;
        }
        const credentials = await registerUser(user.email, user.password);
        console.log("credentials", credentials)
        await createUserHandle(user.handle, credentials.user.uid, user.email);
        console.log('2');
        setAppState({
          user: null,
          userData: null
        });
        
        navigate('/');
      } catch (error) {
        console.error('Error during registration:', error);
        alert(`Registration failed. Please try again. Error: ${error.message}`);
      }
    };

    const updateUser = (prop) => (e) => {
        setUser({
            ...user,
            [prop]: e.target.value
        });
    };

    return (
        <div className="ml-[800px] self-center">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
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
                <input value={user.email} onChange={updateUser('email')} type="text" className="grow" placeholder="Email" />
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
                <input value={user.handle} onChange={updateUser('handle')} type="text" className="grow" placeholder="Username" />
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
                <input value={user.password} onChange={updateUser('password')} type="password" className="grow" />
            </label>
            {(user.email.includes('@') && user.handle && user.password) && (
                <button className="btn btn-primary mt-3" onClick={register}>Register</button>
            )}
        </div>
    );
};

// import { useContext, useState } from 'react';
// import { createUserHandle, getUserByHandle } from '../../services/user.service.js';
// import { registerUser } from '../../services/auth.service.js';
// import { AppContext } from '../../store/app-context.js';
// import { useNavigate } from 'react-router-dom';
// import { getAuth, sendEmailVerification } from 'firebase/auth';

// /**
//  * Register component to handle user registration.
//  * @returns 
//  */
// export const Register = () => {
//   const [user, setUser] = useState({
//     handle: '',
//     email: '',
//     password: '',
//     isBlocked: false,
//     isAdmin: false
//   });

//   const { setAppState } = useContext(AppContext);
//   const navigate = useNavigate();

//   const register = async () => {
//     try {
//       const userT = await getUserByHandle(user.handle);
//       if (userT.exists()) {
//         alert(`User handle ${user.handle} already exists`);
//         return;
//       }
      
//       // Register the user using the credentials (email and password)
//       const credentials = await registerUser(user.email, user.password);
//       const auth = getAuth();
//       const firebaseUser = credentials.user;

//       // Send verification email
//       await sendEmailVerification(firebaseUser);

//       console.log("Verification email sent to:", user.email);

//       // Create the user handle in your database
//       await createUserHandle(user.handle, firebaseUser.uid, user.email);

//       // Optionally, you can reset the app state to a logged-out state
//       setAppState({
//         user: null,
//         userData: null
//       });

//       // Redirect to home or any other page after successful registration
//       alert('A verification email has been sent to your email. Please verify your email before proceeding.');
//       navigate('/');
//     } catch (error) {
//       console.error('Error during registration:', error);
//       alert(`Registration failed. Please try again. Error: ${error.message}`);
//     }
//   };

//   const updateUser = (prop) => (e) => {
//     setUser({
//       ...user,
//       [prop]: e.target.value
//     });
//   };

//   return (
//     <div className="register-view">
//       <label className="input input-bordered flex items-center gap-2 mt-5">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 16 16"
//           fill="currentColor"
//           className="h-4 w-4 opacity-70">
//           <path
//             d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
//           <path
//             d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
//         </svg>
//         <input value={user.email} onChange={updateUser('email')} type="text" className="grow" placeholder="Email" />
//       </label>
//       <label className="input input-bordered flex items-center gap-2 mt-5">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 16 16"
//           fill="currentColor"
//           className="h-4 w-4 opacity-70">
//           <path
//             d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//         </svg>
//         <input value={user.handle} onChange={updateUser('handle')} type="text" className="grow" placeholder="Username" />
//       </label>
//       <label className="input input-bordered flex items-center mt-5">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 16 16"
//           fill="currentColor"
//           className="h-4 w-4 opacity-70">
//           <path
//             fillRule="evenodd"
//             d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
//             clipRule="evenodd" />
//         </svg>
//         <input value={user.password} onChange={updateUser('password')} type="password" className="grow" />
//       </label>
//       {(user.email.includes('@') && user.handle && user.password) && (
//         <button className="register mt-5" onClick={register}>Register</button>
//       )}
//     </div>
//   );
// };