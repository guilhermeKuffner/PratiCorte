import React from "react"
import { Link } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from '../../config/firebase'

class Home extends React.Component {

    handleLogout = async () => {
        try {
            await signOut(auth);    
            window.location.href = "/";
        } catch (error) {
            console.error("Erro ao deslogar:", error.message);
            alert(`Erro ao deslogar: ${error.message}`);
        }
    }
    render() {
        return (
            <>
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <div className="card p-4 shadow-lg bg-white rounded">
                        <h1>Bem-vindo!</h1>
                        <button className="btn btn-danger mt-3" onClick={this.handleLogout}>Logout</button>
                        <Link to="/" className="d-block mt-3 text-decoration-none">Voltar para o Login</Link>
                    </div>
                </div>
            </>
        )
    }
}

export { Home }