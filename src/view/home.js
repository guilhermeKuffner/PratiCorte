import React from "react";
import { PhoneNumberInput } from "../shared/utils";

const initialState = {
    screenType: 'login',
    cpfCnpj: "",
    phoneNumber: ""
}

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    showRegisterPage = () => {
        this.setState({ screenType: "register" })
    }

    showLoginPage = () => {
        this.setState({ screenType: "login" })
    }

    render() {
        return (
            <>
                { 
                    this.state.screenType === "login" &&
                    <div className="container d-flex flex-column justify-content-center align-items-center">
                        <div className="card p-4 shadow-lg bg-white rounded">
                            <div className="mb-2">
                                <img src="" alt="" />
                                <h1 className="mb-2">Acesse sua conta!</h1>
                                <h5>PratiCorte - Gestão rapida e fácil da sua barbearia.</h5>
                            </div>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="email">E-mail</label>
                                    <input className="form-control" type="text" name="email" id="email" placeholder="exemplo@gmail.com"/>
                                </div>
                                <div>
                                    <label className="form-label" htmlFor="password">Senha</label>
                                    <input className="form-control" type="password" name="password" id="password" placeholder="***********"
                                    />
                                </div>
                            </form>
                            <a href="" className="d-block mb-3 text-decoration-none text-center">Esqueceu sua senha?</a>
                            <button className="btn btn-primary mb-3">Fazer Login</button>
                            <div className="text-center">
                                <span className="d-block mb-2">Ainda não é cliente?</span>
                                <button className="btn btn-outline-secondary" onClick={this.showRegisterPage}>Crie sua conta!</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.screenType === "register" &&
                    <div className="container d-flex flex-column justify-content-center align-items-center">
                        <div className="card p-4 shadow-lg bg-white rounded">
                            <div className="mb-2">
                                <img src="" alt="" />
                                <h1 className="mb-2">Crie sua conta!</h1>
                                <h5>PratiCorte - Gestão rapida e fácil da sua barbearia.</h5>
                            </div>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="email">E-mail</label>
                                    <input className="form-control" type="text" name="email" id="email" placeholder="exemplo@gmail.com"/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="password">Senha</label>
                                    <input className="form-control" type="password" name="password" id="password" placeholder="***********"/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="phoneNumber">Celular</label>
                                    <PhoneNumberInput value={this.state.phoneNumber} onChange={(e) => this.setState({ phoneNumber: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="establishment">Nome do Estabelecimento</label>
                                    <input className="form-control" type="text" name="establishment" id="establishment" placeholder="Barbearia PratiCorte"/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Como nos conheceu?</label>
                                    <select className='form-select'>
                                        <option value="">Selecione</option>
                                        <option value="Google">Google</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="Indicação de amigo">Indicação de amigo</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                            </form>
                            <a href="" className="mb-3"><b>termo de uso e política de privacidade.</b></a>
                            <button className="btn btn-primary mb-3">Cadastre-se</button>
                            <div className="text-center">
                                <span className="d-block mb-2">Já é cliente?</span>
                                <button className="btn btn-outline-secondary" onClick={this.showLoginPage}>Voltar para tela inicial!</button>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}

export { Home }