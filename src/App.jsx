import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Footer from './pages/Footer'
import Login from './components/Login'
import Signup from './components/Signup'
import Admin from './pages/Admin'
import Doctor from './pages/Doctor'
import Patient from './pages/Patient'
import ProtectedRoutes from './components/ProtectedRoutes'
import Navbar from './components/Navbar'

import HomePageScroll from './components/homePageScroll'



function App() {

  const location = useLocation();

  // ✅ Check if we are on homepage
  const isHomePage = location.pathname === "/";


  return (
    <>
    <Navbar />
   
      <Routes>

  <Route path='/' element={isHomePage ? <HomePageScroll /> : <></>} />
  <Route path='/auth/users/login' element={<Login />} />
  <Route path='/auth/users/register' element={<Signup />} />

  <Route path='/dashboard/admin' element={
    <ProtectedRoutes allowedRoles={['admin']}>
      <Admin />
    </ProtectedRoutes>
  } />
  <Route path='/dashboard/doctor' element={
    <ProtectedRoutes allowedRoles={['doctor']}>
      <Doctor />
    </ProtectedRoutes>
  } />
  <Route path='/dashboard/patient' element={
    <ProtectedRoutes allowedRoles={['patient']}>
      <Patient />
    </ProtectedRoutes>
  } />
</Routes>
<Footer />
    </>
  )
}


export default App
