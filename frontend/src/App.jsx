import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import SignUp from './components/SignUp';
import './App.css'
import Header from './components/Header';

function App() {


  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signIn" element={<SignUp />} />
        <Route path="/" element={<ProtectedRoute element={Home} />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </div>
  )

}

export default App

