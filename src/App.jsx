import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import React from 'react'
import { Home } from './Views/Home/Home'
import Sidebar from './components/Sidebar/Sidebar'

import './App.css'

function App() {

  return (
    <>
    <Header/>
    <Sidebar/>
    <Home />

    </>
  )
}

export default App
