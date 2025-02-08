import React from "react";
import { PhoneNumberInput } from "../../shared/utils";
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebase'
import { v7 as uuidv7 } from 'uuid'
import { addEstablishment } from '../../store/collections/registerWorker'
import { addUser } from '../../store/collections/userWorker'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: null,
            isLoading: false
        }
    }

    componentDidMount() {
        const user = auth.currentUser;
        if (user) {
            window.location.href = "/home";
        }
    }
    

    handleLogin = async () => {
        const { email, password } = this.state
        this.setState({ isLoading: true })
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            console.log("Usuário logado:", userCredential.user)
            alert("Login realizado com sucesso!")
        } catch (error) {
            if (error.message == "Firebase: Error (auth/invalid-credential)."){
                error.message = "Email ou senha inválidos, tente novamente"
            }
            this.setState({ isLoading: false })
            alert(`Erro no login: ${error.message}`)
        } finally {
            window.location.href = "/home"
        }
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
                            <button className="btn btn-primary mb-3" onClick={this.handleLogin}>Fazer Login</button>
                            <div className="text-center">
                                <span className="d-block mb-2">Ainda não é cliente?</span>
                                <Link to="/criar-conta">
                                    <button className="btn btn-outline-secondary">Crie sua conta!</button>
                                </Link>
                            </div>
                        </div>
                    </div> : 
                    <div>
                        <h1>loading</h1>
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
          const data = {
            estabelecimentoId: uuidv7(),
            email: email,
            nomeEstabelecimento: establishment,
            celular: phoneNumber,
          }
          await addEstablishment({ data })
          await addUser({ data })

          alert("Cadastro realizado com sucesso!")
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