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
                    className="profile-btn bg-blue-600 px-4 py-2 rounded-full"
                >
                    Profile
                </button>
                {menuOpen && (
                    <ul className="menu bg-base-200 w-56 absolute top-full mt-2 right-0 shadow-lg rounded-lg">
                        <NavLink to='profile'><li><a href="#item1">Profile View</a></li></NavLink>
                        <li><a href="#item2">Item 2</a></li>
                        <li><a href="#item3">Item 3</a></li>
                    </ul>
                )}
            </div>
        </header>
    );
};

export default Header;
