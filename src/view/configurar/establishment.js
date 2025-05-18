import React from "react";
import { NavBar } from "../../components/navbar"

class Establishment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: null,
            isEditing: false,
        }
    }
    render() {
        return (
            <>
                <NavBar>
                    <div className="container d-flex flex-column justify-content-center align-items-center">
                        <div className="card p-4 shadow-lg bg-white rounded">
                            <div className="mb-2">
                                <h1>Dados do seu estabelecimento</h1>  
                            </div>
                            {
                                this.state.isEditing == false ? (
                                    <div className="mb-3">
                                        <div> Nome do estabelecimento: {this.state.establishment?.nomeEstabelecimento}</div>
                                        <div> E-mail: {this.state.establishment?.email}</div>
                                        <div> Celular: {this.state.establishment?.celular}</div>
                                        <div> Endereço: {this.state.establishment?.endereco}</div>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <div> tela de edição</div>
                                    </div>
                                )   
                            }
                        </div>
                    </div>
                </NavBar>
            </>
        )
    }
}

export { Establishment }