import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import React from 'react'
import { Home } from './Views/Home/Home'
import Sidebar from './components/Sidebar/Sidebar'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase-config';
import { AppContext } from './store/app-context'
import { getUserData } from './services/user.service'
import { NotFound } from './components/NotFound/NotFound'
import { Register } from './Views/Register/Register'
import { Login } from './Views/Login/Login'
import { Profile } from './Views/Profile/Profile'
import { Teams } from './Views/Teams/Teams'
import AllUsers from './components/AllUsers/AllUsers'

function App() {
    const [appState, setAppState] = useState({
        user: null,
        userData: null,
    });

    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            getUserData(user.uid).then(snapshot => {
                if (snapshot.exists()) {
                    setAppState({
                        user: user,
                        userData: snapshot.val()[Object.keys(snapshot.val())[0]]
                    });
                }
            });
        }
    }, [user]);

    return (
        <>
            <AppContext.Provider value={{ ...appState, setAppState }}>
                <BrowserRouter>

                    <Header />
                    <Sidebar />
                    <div className="min-h-screen flex flex-row pt-16">
          <div className="ml-64 flex-grow p-4">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="*" element={<NotFound />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/teams" element={<Teams />} />
                                <Route path="/users" element={<></>}/>
                                <Route path='friends' element={<AllUsers/>}/>
                            </Routes>
                        </div>
                    </div>
            </BrowserRouter>
        </AppContext.Provider >
        </>
    )
}

export default App
