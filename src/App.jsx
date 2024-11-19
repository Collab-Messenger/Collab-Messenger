import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header/Header'
import React from 'react'
import Home from './Views/Home/Home'
import WrapperContainer from './config/WrapperContainer/WrapperContainer'

import './App.css'

function App() {

  return (
    <>

      
        <Header />
      

      <WrapperContainer>
        <Home />
      </WrapperContainer>


    </>
  )
}

export default App
