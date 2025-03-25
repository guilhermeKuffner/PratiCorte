import React from "react";
import { Link } from "react-router-dom";
import { handleLogout, getEstablishmentByUser } from "../../config/auth";
import { auth } from '../../config/firebase';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.currentUser,
            establishment: null,
            isLoading: true,
        };
    }

    async componentDidMount() {
        try {
            const establishment = await getEstablishmentByUser(this.state.user.email);
            this.setState({ establishment: establishment, isLoading: false });
        } catch (error) {
            console.error("Erro ao obter o estabelecimento", error);
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { user, establishment, isLoading } = this.state;
        if (isLoading) {
            return <div></div>;
        }

        return (
            <>
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <div className="card p-4 shadow-lg bg-white rounded">
                        <h1>Bem-vindo!</h1>
                        <h1>Seu e-mail: {user.email}</h1>
                        <h1>Seu nome de estabelecimento: {establishment.nomeEstabelecimento}</h1>
                        <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
                        <Link to="/" className="d-block mt-3 text-decoration-none">Voltar para o Login</Link>
                    </div>
                </div>
            </>
        );
    }
}

export { Home };
