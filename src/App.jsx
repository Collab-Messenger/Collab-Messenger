import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase-config';
import { AppContext } from './store/app-context'
import { getUserData, setUserOnlineStatus } from './services/user.service'
import { NotFound } from './components/NotFound/NotFound'
import { Register } from './Views/Register/Register'
import { Login } from './Views/Login/Login'
import { Profile } from './Views/Profile/Profile'
// import { Teams } from './Views/Teams/Teams'
import { Notifications } from './Views/Notifications/Notifications'
import Home from './Views/Home/Home'
import CreateChatRoom from './components/ChatRoom/create-chatroom'
import { Friends } from './Views/Friends/Friends'
import { Admin } from './Views/Admin/Admin'
import { TeamDetails } from './Views/TeamDetails/TeamDetails'
import { TeamsCreate } from './Views/TeamsCreate/TeamsCreate'
import { VideoCallView } from './Views/VideoCall/VideoCallView'
import ChatRoomList from './components/ChatRoom/chat-roomlist'
import ChatRoomView from './Views/ChatRoomView/chat-room-view'
import { Anonymous } from './Views/Anonymous/Anonymous'
import ChannelDetails from './components/ChannelDetails/ChannelDetails'

function App() {
    const [appState, setAppState] = useState({
        user: null,
        userData: null,
    });

    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (user) {
          getUserData(user.uid, (data) => {
            if (data) {
              const userData = data[Object.keys(data)[0]];
              setUserOnlineStatus(userData.handle);
              setAppState({
                user: user,
                userData,
              });
            }
          });
        }
      }, [user, setAppState]);

    return (
        <>
            <AppContext.Provider value={{ ...appState, setAppState }}>
                <BrowserRouter>
                <div className="h-dvh flex flex-col">
                    <Header />
          <div className="flex gap-1 h-full">
            {/* Height = 100vh - headerHeight */}
              {appState.user && (
                                <Sidebar />
                            )}
                            <Routes>
                            <Route path="/" element={appState.user ? <Home /> : <Anonymous />} />
                                <Route path="*" element={<NotFound />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/profile" element={<Profile />} />
                                {/* <Route path="/teams" element={<Teams />} /> */}
                                <Route path="/teams/:teamId" element={<TeamDetails />} />
                                <Route path="/createTeam" element={<TeamsCreate />} />
                                <Route path="/users" element={<></>}/>
                                <Route path='/friends' element={<Friends/>}/>
                                <Route path='/admin' element={<Admin/>}/>
                                <Route path='/teams/:teamId' element={<TeamDetails/>}/>
                                <Route path='/videoCall' element={<VideoCallView/>}/>
                                <Route path='notifications' element={<Notifications/>}/>
                                <Route path='createChatRoom' element={<CreateChatRoom/>}/>
                                <Route path='chatRoomList' element={<ChatRoomList/>}/>
                                <Route path='/chatRooms/:id' element={<ChatRoomView/>}/>
                                <Route path='/teams/:teamId/channels/:channelId/' element={<ChannelDetails/>}/>
                                
                            </Routes>
                        </div>
                        </div>
            </BrowserRouter>
        </AppContext.Provider >
        </>
    )
}

export default App
