import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../store/app-context';
import { useContext } from 'react';
import { Search } from '../Search/Search';
import { PiHandshakeBold } from "react-icons/pi";
import { auth } from '../../config/firebase-config';
import { setUserOfflineStatus, setUserOnlineStatus } from '../../services/user.service';
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";


const Header = () => {
    const navigate = useNavigate();
    const { userData, setAppState } = useContext(AppContext);
    const [ nameInitials, setNameInitials ] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        if (userData?.firstName) {
            const firstNameI = userData?.firstName.split(' ');
            const lastNameI = userData?.lastName.split(' ');
            const initialOne = firstNameI.map(name => name[0]).join('');
            const initialTwo = lastNameI.map(name => name[0]).join('');
            setNameInitials (initialOne.toUpperCase() + initialTwo.toUpperCase());
        } else{
            const firstHandleSymbol = userData?.handle[0].toUpperCase();
            setNameInitials (firstHandleSymbol);

        }
    }, [userData]);

    useEffect(() => {
        if (userData?.friendRequests) {
          setNotificationCount(userData.friendRequests.length);
        }
      }, [userData]);

    console.log(nameInitials);

    const userStatusOnline = () => setUserOnlineStatus(userData?.handle);

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
                    <>
                        <Search />
                    </>
                ) : (
                    null
                )}

                

            </div>

            <div className="flex gap-4 items-center relative mr-5">
                {/* Profile Button */}
                {userData? (

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className={`text-gray-900 btn btn-accent btn-circle avatar w-16 h-16 ${userData?.isOnline? "online" : "offline"}`}>
                        {/*<div className="w-10 rounded-full flex items-center justify-center">*/}
                            
                                <div className="placeholder">
                                    <div className="rounded-full" >
                                        <span className="text-xl/4">{nameInitials}</span>
                                    </div>
                                </div>
                            
                        {/*</div>*/}
                    </div>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        {userData ? (
                            <>
                                <NavLink to='/profile'><li><a href="#item1">Edit Profile</a></li></NavLink>
                                <NavLink to='/friends'><li><a href="#item2">Friends</a></li></NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to='/login'><li><a href="#item1">Log In</a></li></NavLink>
                                <NavLink to='/register'><li><a href="#item2">Register</a></li></NavLink>
                            </>
                        )}

                        {userData && (
                            <>
                                {userData?.isOnline ? (
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
                ): <>
                <NavLink to='/login'><li><a href="#item1">Log In</a></li></NavLink>
                <NavLink to='/register'><li><a href="#item2">Register</a></li></NavLink>
            </>}
                <div className="indicator ">
                    <NavLink to='notifications'>
                    {notificationCount > 0 ? (
            <IoNotifications size={20} />
          ) : (
            <IoNotificationsOutline size={20} />
          )}
                    </NavLink>
                    {/*Notification bublle*/}
                    {/*<span className="badge badge-xs badge-primary indicator-item"></span>*/}
                </div>
            </div>
        </header>
    );
};

export default Header;
