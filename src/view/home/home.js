import React from "react";
import { handleLogout } from "../../config/auth";
import { auth } from '../../config/firebase';
import { getSessao } from "../../config/auth";
import { NavBar } from "../../components/navbar";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.currentUser,
            establishment: null,
            isLoading: true,
            sessao: getSessao(),
        };
    }

    async componentDidMount() {
        try {
            const establishment = this.state.sessao.estabelecimento
            this.setState({ establishment: establishment, isLoading: false });
        } catch (error) {
            handleLogout()
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
                <NavBar>
                    <div className="container d-flex flex-column justify-content-center align-items-center">
                        <div className="card p-4 shadow-lg bg-white rounded">
                            <h1>Bem-vindo!</h1>
                            <h1>Seu e-mail: {user.email}</h1>
                            <h1>Seu nome de estabelecimento: {establishment.nomeEstabelecimento}</h1>
                        </div>
                    </div>
                </NavBar>
            </>
        );
    }
}

export { Home };
