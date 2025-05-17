import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Login, Register } from "../view/conta/loginAndRegister";
import { Home } from "../view/home/home";
import { auth } from "../config/firebase";
import { Establishment } from "../view/configurar/establishment";
import { OpeningHours } from "../view/configurar/openingHours";
import { Services } from "../view/configurar/services";
import { Reports } from "../view/relatorios/reports";
import { History } from "../view/historico/history";

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
    <Route path="/historico" element={<PrivateRoute><History /></PrivateRoute>} />
    <Route path="/relatorios" element={<PrivateRoute><Reports /></PrivateRoute>} />
    <Route path="/configuracoes/estabelecimento" element={<PrivateRoute><Establishment /></PrivateRoute>} />
    <Route path="/configuracoes/horarios" element={<PrivateRoute><OpeningHours /></PrivateRoute>} />
    <Route path="/configuracoes/servicos" element={<PrivateRoute><Services /></PrivateRoute>} />
    
    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
)

export default AppRoutes
