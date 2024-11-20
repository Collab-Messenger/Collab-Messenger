import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../store/app-context';
import { useContext } from 'react';
import { Search } from '../Search/Search';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { userData, setAppState } = useContext(AppContext);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);

    };

    const getUserInitials = (userData) => {
        if (userData.firstName) {
            const firstNameI = userData.firstName.split(' ');
            const lastNameI = userData.lastName.split(' ');
            const initialOne = firstNameI.map(name => name[0]).join('');
            const initialTwo = lastNameI.map(name => name[0]).join('');
            return (initialOne.toUpperCase() + initialTwo.toUpperCase());
        } else if (userData.email) {
            return userData.email[0].toUpperCase();
        }
        return "User";
    };

    const handleLogout = () => {
        auth.signOut().then(() => {
            setAppState({
                userForm: null,
                userData: null
            });
            window.location.reload();
        });
    };

    return (
        <header className="flex items-center justify-between bg-gray-800 text-white p-4">
            {/* Logo Section */}
            <div className="logo">
                <img src="logo.png" alt="App Logo" className="h-8" />
            </div>

            {userData ? (
                <>
                    <Search />
                </>
            ) : (
                <>
                    <NavLink to='register'><button className="btn btn-outline">Register</button></NavLink>
                    <NavLink to='/login'><button className='login-btn'>Login</button></NavLink>
                </>
            )}

            {/* Profile Button */}

            <div className="relative">
                <button
                    onClick={toggleMenu}

                >
                    <div className="avatar online placeholder">
                        <div className="bg-neutral text-neutral-content w-16 rounded-full">
                            <span className="text-xl">{userData ? getUserInitials(userData) : 'User'}</span>
                        </div>
                    </div>
                </button>

                {menuOpen && (
                    <ul className="menu bg-base-200 w-56 absolute top-full mt-2 right-0 shadow-lg rounded-lg">
                        <NavLink to='profile'><li><a href="#item1">Edit Profile</a></li></NavLink>
                        <NavLink to='friends'><li><a href="#item2">Friends</a></li></NavLink>
                        <li><a href="#item3">Set Status</a></li>
                        {userData && userData.isAdmin && (
                            <li><a href="#item4">Admin Panel</a></li>
                        )}
                        
                    </ul>
                )}
            </div>
        </header>
    );
};

export default Header;
