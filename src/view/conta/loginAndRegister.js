import React from "react";
import { isValidPhoneNumber, PhoneNumberInput } from "../../shared/utils";
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebase'
import { addEstablishment } from '../../store/collections/registerWorker'
import { addUser } from '../../store/collections/userWorker'
import { checkUser, handleLogin } from "../../config/auth";
import { isEmpty, removeSimbols, isValidDocument } from "../../shared/utils";

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
        checkUser();
    }
    render() {
        return (
            <> 
                {
                    <div className="container d-flex flex-column justify-content-center align-items-center">
                        <div className="card p-4 shadow-lg bg-light rounded">
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
            name: "",
            email: "",
            password: "",
            phoneNumber: "",
            establishment: "",
            error: null,
        } 
    }

    componentDidMount() {
        checkUser();
    }

    verifyFields = (data) => {
        if (isEmpty(data.email)) {
            alert("E-mail não informado")
            return false
        }
        if (isEmpty(data.name)) {
            alert("Nome não informado")
            return false
        }
        if (isEmpty(data.password)) {
            alert("Senha não informada")
            return false
        }
        if (!isValidDocument(data.document)) {
            alert("Informe um CPF ou CNPJ no documento válido")
            return false
        }
        if (!isValidPhoneNumber(data.phoneNumber)) {
            alert("Informe um celular válido")
            return false
        }
        if (isEmpty(data.establishment)) {
            alert("Nome do estabelecimento não informado")
            return false
        }
        return true
    }

    handleRegister = async () => {
        const data = {
            email: this.state.email,
            password: this.state.password,
            phoneNumber: removeSimbols(this.state.phoneNumber),
            establishment: this.state.establishment,
            name: this.state.name,
            document: this.state.document,
        }
        if (this.verifyFields(data)) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
                console.log("Usuário cadastrado:", userCredential.user)
                const establishmentData = {
                    email: data.email,
                    nomeEstabelecimento: data.establishment,
                    nomeResponsavel: data.name,
                    celular: data.phoneNumber,
                }
                const establishmentCreated = await addEstablishment(establishmentData)
                const userData = {
                    email: data.email,
                    nomeEstabelecimento: data.establishment,
                    nome: data.name,
                    celular: data.phoneNumber,
                    estabelecimentoId: establishmentCreated.id,
                }
                await addUser(userData)
                handleLogin(data.email, data.password, (isLoading) => this.setState({ isLoading }));
            } catch (error) {
                if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                    alert("E-mail já cadastrado")
                }
                console.error("Erro no cadastro:", error.message)
                this.setState({ error: error.message })
            }
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
                                <label className="form-label" htmlFor="name">Nome do responsável</label>
                                <input className="form-control" type="text" name="name" id="name" placeholder="Nome do responsável"
                                onChange={(e) => this.setState({ name: e.target.value })}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="password">Senha</label>
                                <input className="form-control" type="password" name="password" id="password" placeholder="***********" 
                                onChange={(e) => this.setState({ password: e.target.value })}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="document">
                                    <Link to="https://www.4devs.com.br/gerador_de_cpf" target="_blank" className="text-body text-decoration-none">Documento (CPF ou CPNJ)</Link>
                                </label>
                                <input className="form-control" type="text" name="document" id="document" placeholder="CPF ou CPNJ"
                                onChange={(e) => this.setState({ document: e.target.value })}/>
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
                        <Link to="/termos-de-uso" target="_blank" className="mb-3"><b>termo de uso e política de privacidade.</b></Link>
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