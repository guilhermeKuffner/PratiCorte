import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login, Register } from "../view/conta/home";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/conta/criar-conta" element={<Register />} />
    </Routes>
)

export default AppRoutes
