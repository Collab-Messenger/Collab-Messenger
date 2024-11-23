import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../store/app-context';
import { useContext } from 'react';
import { Search } from '../Search/Search';
import { PiDiscordLogoBold } from "react-icons/pi";
import { auth } from '../../config/firebase-config';


const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();

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
        } else if (userData.handle) {
            return userData.handle[0].toUpperCase();
        }
        return "User";
    };

    const handleLogout = () => {
        auth.signOut().then(() => {
            setAppState({
                userForm: null,
                userData: null
            });
        });
    };

    return (
        <header className="flex items-center justify-between bg-gray-800 text-white p-4">
            {/* Logo Section */}
            <div className="logo">
                <NavLink to='/'><PiDiscordLogoBold /></NavLink>
            </div>
            
            {userData ? (
                <>
                    <Search />
                </>
            ):(
                <></>
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
                        {userData? (
                            <>
                                <NavLink to='profile'><li><a href="#item1">Edit Profile</a></li></NavLink>
                                <NavLink to='friends'><li><a href="#item2">Friends</a></li></NavLink>
                            </>
                        ) : (
                            <>
                            <NavLink to='/login'><li><a href="#item1">Log In</a></li></NavLink>
                            <NavLink to='/register'><li><a href="#item2">Register</a></li></NavLink>
                            </>
                        )}

                        
                        {userData && (
                            <li><a href="#item3">Set Status</a></li>
                        )}
                        {userData && userData.isAdmin && (
                            <li><a href="#item4">Admin Panel</a></li>
                        )}
                        {userData && (
                            <NavLink to='/'><li><a href="#item3" onClick={handleLogout}>Logout</a></li></NavLink>
                        )}


                    </ul>
                )}
                <div className="indicator">
                    <NavLink to='notifications'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-9"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </NavLink>
                    {/*Notification bublle*/}
                    {/*<span className="badge badge-xs badge-primary indicator-item"></span>*/}
                </div>
            </div>
        </header>
    );
};

export default Header;
