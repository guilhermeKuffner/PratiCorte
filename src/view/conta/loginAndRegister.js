import React from "react";
import { PhoneNumberInput } from "../../shared/utils";
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebase'
import { v7 as uuidv7 } from 'uuid'
import { addEstablishment } from '../../store/collections/registerWorker'
import { addUser } from '../../store/collections/userWorker'
import { handleLogin } from "../../config/auth";


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: null,
            isLoading: true
        }
    }

    componentDidMount() {
        const checkUser = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const user = auth.currentUser
            if (user) {
                window.location.href = "/home"
            } else {
                this.setState({ isLoading: false })
            }
        }
        checkUser()
    }
    
    render() {
        return (
            <> 
                {
                    this.state.isLoading == false ?
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
                                    <input className="form-control" type="text" name="email" id="email" placeholder="exemplo@gmail.com"
                                    onChange={(e) => this.setState({ email: e.target.value })}/>
                                </div>
                                <div>
                                    <label className="form-label" htmlFor="password">Senha</label>
                                    <input className="form-control" type="password" name="password" id="password" placeholder="***********"
                                    onChange={(e) => this.setState({ password: e.target.value })}/>
                                </div>
                            </form>
                            <Link to="/" className="d-block mb-3 text-decoration-none text-center">Esqueceu sua senha?</Link>
                            <button className="btn btn-primary mb-3" onClick={() => handleLogin(this.state.email, this.state.password, (isLoading) => this.setState({ isLoading }))}>
                                Fazer Login
                            </button>
                            <div className="text-center">
                                <span className="d-block mb-2">Ainda não é cliente?</span>
                                <Link to="/criar-conta">
                                    <button className="btn btn-outline-secondary">Crie sua conta!</button>
                                </Link>
                            </div>
                        </div>
                    </div> : 
                    <div>
                    </div>
                }

            </>
        )
    }
}

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            phoneNumber: "",
            establishment: "",
            error: null,
        } 
    }

    componentDidMount() {
        const user = auth.currentUser;
        if (user) {
            window.location.href = "/home";
        }
    }

    handleRegister = async () => {
        const { email, password, phoneNumber, establishment } = this.state;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            console.log("Usuário cadastrado:", userCredential.user)
            const estabelecimentoId = uuidv7();
            const establishmentData = {
                estabelecimentoId: estabelecimentoId,
                email: email,
                nomeEstabelecimento: establishment,
                celular: phoneNumber,
            }
            const userData = {
                id: userCredential.user.uid, 
                email: email,
                nomeEstabelecimento: establishment,
                celular: phoneNumber,
                estabelecimentoId: estabelecimentoId,
            }
            await addEstablishment(establishmentData)
            await addUser(userData)
            handleLogin(email, password, (isLoading) => this.setState({ isLoading }));
        } catch (error) {
            console.error("Erro no cadastro:", error.message)
            this.setState({ error: error.message })
        }
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
                                <input className="form-control" type="text" name="email" id="email" placeholder="exemplo@gmail.com"
                                onChange={(e) => this.setState({ email: e.target.value })}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="password">Senha</label>
                                <input className="form-control" type="password" name="password" id="password" placeholder="***********" 
                                onChange={(e) => this.setState({ password: e.target.value })}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="phoneNumber">Celular</label>
                                <PhoneNumberInput value={this.state.phoneNumber} onChange={(e) => this.setState({ phoneNumber: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="establishment">Nome do Estabelecimento</label>
                                <input className="form-control" type="text" name="establishment" id="establishment" placeholder="Barbearia PratiCorte"
                                onChange={(e) => this.setState({ establishment: e.target.value })} />
                            </div>
                        </form>
                        <Link to="/" className="mb-3"><b>termo de uso e política de privacidade.</b></Link>
                        <button className="btn btn-primary mb-3" onClick={this.handleRegister}>Cadastre-se</button>
                        <div className="text-center">
                            <span className="d-block mb-2">Já é cliente?</span>
                            <Link to="/">
                                <button className="btn btn-outline-secondary">Acesse sua conta!</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}



export { Login, Register }