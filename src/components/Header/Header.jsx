import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../store/app-context';
import { useContext } from 'react';
import { Search } from '../Search/Search';
import { PiHandshakeBold } from "react-icons/pi";
import { auth } from '../../config/firebase-config';
import { setUserOfflineStatus, setUserOnlineStatus } from '../../services/user.service';
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";

/**
 * Header component for the application.
 *
 * @component
 */
const Header = () => {
    const navigate = useNavigate();
    const { userData, setAppState } = useContext(AppContext);
    const [nameInitials, setNameInitials] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);

    /**
     * Calculates the initials from user's first and last name.
     * Updates `nameInitials` state with the initials.
     */
    useEffect(() => {
        if (userData?.firstName) {
            const firstNameInitials = userData.firstName.split(' ').map(name => name[0]).join('');
            const lastNameInitials = userData.lastName.split(' ').map(name => name[0]).join('');
            setNameInitials(firstNameInitials.toUpperCase() + lastNameInitials.toUpperCase());
        } else {
            setNameInitials(userData?.handle[0].toUpperCase());
        }
    }, [userData]);

    /**
     * Updates notification count when there are changes in friend requests.
     */
    useEffect(() => {
        if (userData?.friendRequests) {
            setNotificationCount(userData.friendRequests.length);
        }
    }, [userData]);

    console.log(nameInitials);

    /**
     * Sets the user's status to online.
     */
    const userStatusOnline = () => setUserOnlineStatus(userData?.handle);

    /**
     * Sets the user's status to offline.
     */
    const userStatusOffline = async () => {
        try {
            await setUserOfflineStatus(userData?.handle);
        } catch (error) {
            console.error("Error setting user offline status:", error);
        }
    };
        //const getUserInitials = (userData) => {
    //    if (userData.firstName) {
    //        const firstNameI = userData.firstName.split(' ');
    //        const lastNameI = userData.lastName.split(' ');
    //        const initialOne = firstNameI.map(name => name[0]).join('');
    //        const initialTwo = lastNameI.map(name => name[0]).join('');
    //        return (initialOne.toUpperCase() + initialTwo.toUpperCase());
    //    } else{
    //        console.log(userData.handle[0].toUpperCase());
    //        return userData.handle[0].toUpperCase();

    //    }
    //};

    /**
     * Logs out the user by signing out from Firebase, setting offline status, and clearing app state.
     */
    const handleLogout = async () => {
        try {
            await auth.signOut();
            await userStatusOffline();
            setAppState({
                userForm: null,
                userData: null
            });
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <header className="flex items-center justify-between bg-gray-800 text-white p-5 w-full">
            {/* Logo Section */}
            <div className="logo px-5">
                <NavLink to='/'><PiHandshakeBold size={30}/></NavLink>
            </div>
            <div className='flex items-center gap-5'>
                {userData ? (
                    <Search />
                ) : null}
            </div>

            <div className="flex gap-4 items-center relative mr-5">
                {/* Profile Button */}
                {userData ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className={`text-gray-900 btn btn-accent btn-circle avatar w-16 h-16 ${userData?.isOnline ? "online" : "offline"}`}>
                            <div className="placeholder">
                                <div className="rounded-full">
                                    <span className="text-xl/3">{nameInitials}</span>
                                </div>
                            </div>
                        </div>
                        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <NavLink to='/profile'><li><a href="#item1">Edit Profile</a></li></NavLink>
                            <NavLink to='/friends'><li><a href="#item2">Friends</a></li></NavLink>

                            {userData && (
                                <>
                                    {userData.isOnline ? (
                                        <li><a href="#item3" onClick={userStatusOffline}>Set Status - Offline</a></li>
                                    ) : (
                                        <li><a href="#item3" onClick={userStatusOnline}>Set Status - Online</a></li>
                                    )}
                                </>
                            )}
                            {userData && userData.isAdmin && (
                                <NavLink to='/admin'><li><a href="#item4">Admin Panel</a></li></NavLink>
                            )}
                            {userData && (
                                <li><a href="#item5" onClick={handleLogout}>Logout</a></li>
                            )}
                        </ul>
                    </div>
                ) : (
                    <>
                        <NavLink to='/login'><li><a href="#item1">Log In</a></li></NavLink>
                        <NavLink to='/register'><li><a href="#item2">Register</a></li></NavLink>
                    </>
                )}
                <div className="indicator">
                    <NavLink to='notifications'>
                        {notificationCount > 0 ? (
                            <IoNotifications size={20} />
                        ) : (
                            <IoNotificationsOutline size={20} />
                        )}
                    </NavLink>
                    {/* Notification bubble */}
                    {/* <span className="badge badge-xs badge-primary indicator-item"></span> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
