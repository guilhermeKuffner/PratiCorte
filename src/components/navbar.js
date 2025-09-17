import { Link, NavLink } from "react-router-dom";
import { handleLogout } from "../config/auth";
import { useLocation } from "react-router-dom";

export const NavBar = props => {
    const location = useLocation();
    const isConfiguracoesActive = location.pathname.startsWith("/configuracoes");
    
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-modern fixed-top w-100">
                <div className="container-fluid">
                    <NavLink to="/home" className="navbar-brand navbar-brand-modern">
                        <i className="fas fa-cut me-2"></i>
                        PratiCorte
                    </NavLink>
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/home" className={({ isActive }) => `nav-link fw-semibold px-3 py-2 rounded-pill ${isActive ? "active bg-primary text-white" : "text-dark"}`}>
                                    <i className="fas fa-home me-2"></i>
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/historico" className={({ isActive }) => `nav-link fw-semibold px-3 py-2 rounded-pill ${isActive ? "active bg-primary text-white" : "text-dark"}`}>
                                    <i className="fas fa-history me-2"></i>
                                    Histórico
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/relatorios" className={({ isActive }) => `nav-link fw-semibold px-3 py-2 rounded-pill ${isActive ? "active bg-primary text-white" : "text-dark"}`}>
                                    <i className="fas fa-chart-bar me-2"></i>
                                    Relatórios
                                </NavLink>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item dropdown">
                                <button className={`nav-link dropdown-toggle fw-semibold px-3 py-2 rounded-pill border-0 ${isConfiguracoesActive ? "active bg-primary text-white" : "text-dark bg-transparent"}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fas fa-cog me-2"></i>
                                    Configurações
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end modern-card border-0 shadow-lg">
                                    <li>
                                        <Link to="/configuracoes/estabelecimento" className="dropdown-item py-3 px-4">
                                            <i className="fas fa-store me-3 text-primary"></i>
                                            Estabelecimento
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/configuracoes/usuarios" className="dropdown-item py-3 px-4">
                                            <i className="fas fa-users me-3 text-primary"></i>
                                            Usuários
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/configuracoes/horarios" className="dropdown-item py-3 px-4">
                                            <i className="fas fa-clock me-3 text-primary"></i>
                                            Horários
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/configuracoes/servicos" className="dropdown-item py-3 px-4">
                                            <i className="fas fa-scissors me-3 text-primary"></i>
                                            Serviços
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item ms-2">
                                <button className="btn btn-modern-secondary" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt me-2"></i>
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="pt-5 mt-5">
                {props.children}
            </div>
        </>
    )
}