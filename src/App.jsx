import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase-config';
import { AppContext } from './Store/app-context'
import { getUserData } from './services/user.service'
import { NotFound } from './components/NotFound/NotFound'
import { Register } from './Views/Register/Register'
import { Login } from './Views/Login/Login'

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
                            </Routes>
                        </div>
                    </div>

            </BrowserRouter>
        </AppContext.Provider >
        </>
    )
}

export default App
