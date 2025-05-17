import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Login, Register } from "../view/conta/loginAndRegister";
import { Home } from "../view/home/home";
import { auth } from "../config/firebase";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const user = auth.currentUser
      setIsAuthenticated(!!user)
    };
    checkUser()
  }, [])

  if (isAuthenticated === null) {
    return <div></div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/criar-conta" element={<Register />} />
    <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
    
    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
)

export default AppRoutes
