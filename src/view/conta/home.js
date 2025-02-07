import React from "react";
import { PhoneNumberInput } from "../../shared/utils";
import { Link } from 'react-router-dom';

const initialState = {
    cpfCnpj: "",
    phoneNumber: ""
}

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }
    
    render() {
        return (
            <>
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
                            <Link to="/conta/criar-conta">
                                <button className="btn btn-outline-secondary">Crie sua conta!</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    render() {
        return (
            <>
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
                            <a href="/">
                                <button className="btn btn-outline-secondary" onClick={this.showLoginPage}>Voltar para tela inicial!</button>
                            </a>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}



export { Login, Register }