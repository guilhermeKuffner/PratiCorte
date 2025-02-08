import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login, Register } from "../view/conta/loginAndRegister";
import { Home } from "../view/home/home";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/criar-conta" element={<Register />} />
        <Route path="/home" element={<Home />} />
    </Routes>
)

export default AppRoutes
