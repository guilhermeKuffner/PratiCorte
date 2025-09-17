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
                    <div className="center-container">
                        <div className="modern-card p-5 animate-fade-in-up" style={{maxWidth: '450px', width: '100%'}}>
                            <div className="text-center mb-4">
                                <div className="mb-4">
                                    <i className="fas fa-cut text-primary" style={{fontSize: '3rem'}}></i>
                                </div>
                                <h1 className="fw-bold text-dark mb-3">Acesse sua conta!</h1>
                                <p className="text-muted">PratiCorte - Gestão rápida e fácil da sua barbearia.</p>
                            </div>
                            <form>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-dark mb-2" htmlFor="email">
                                        <i className="fas fa-envelope me-2 text-primary"></i>
                                        E-mail
                                    </label>
                                    <input className="form-control-modern" type="text" name="email" id="email" placeholder="exemplo@gmail.com"
                                    onChange={(e) => this.setState({ email: e.target.value })}/>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-dark mb-2" htmlFor="password">
                                        <i className="fas fa-lock me-2 text-primary"></i>
                                        Senha
                                    </label>
                                    <input className="form-control-modern" type="password" name="password" id="password" placeholder="***********"
                                    onChange={(e) => this.setState({ password: e.target.value })}/>
                                </div>
                            </form>
                            <Link to="/" className="d-block mb-4 text-decoration-none text-center text-primary fw-semibold">
                                <i className="fas fa-key me-2"></i>
                                Esqueceu sua senha?
                            </Link>
                            <button className="btn btn-modern w-100 mb-4" onClick={() => handleLogin(this.state.email, this.state.password, (isLoading) => this.setState({ isLoading }))}>
                                <i className="fas fa-sign-in-alt me-2"></i>
                                Fazer Login
                            </button>
                            <div className="text-center">
                                <p className="text-muted mb-3">Ainda não é cliente?</p>
                                <Link to="/criar-conta">
                                    <button className="btn btn-modern-secondary w-100">
                                        <i className="fas fa-user-plus me-2"></i>
                                        Crie sua conta!
                                    </button>
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
                if (error.message === "Firebase: Error (auth/invalid-email).") {
                    alert("E-mail inválido")
                }
                this.setState({ error: error.message })
            }
        }
    }

    render() {
        return (
            <>
                <div className="center-container">
                    <div className="modern-card p-5 animate-fade-in-up" style={{maxWidth: '500px', width: '100%'}}>
                        <div className="text-center mb-4">
                            <div className="mb-4">
                                <i className="fas fa-cut text-primary" style={{fontSize: '3rem'}}></i>
                            </div>
                            <h1 className="fw-bold text-dark mb-3">Crie sua conta!</h1>
                            <p className="text-muted">PratiCorte - Gestão rápida e fácil da sua barbearia.</p>
                        </div>
                        <form>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark mb-2" htmlFor="email">
                                    <i className="fas fa-envelope me-2 text-primary"></i>
                                    E-mail
                                </label>
                                <input className="form-control-modern" type="text" name="email" id="email" placeholder="exemplo@gmail.com"
                                onChange={(e) => this.setState({ email: e.target.value })}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark mb-2" htmlFor="name">
                                    <i className="fas fa-user me-2 text-primary"></i>
                                    Nome do responsável
                                </label>
                                <input className="form-control-modern" type="text" name="name" id="name" placeholder="Nome do responsável"
                                onChange={(e) => this.setState({ name: e.target.value })}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark mb-2" htmlFor="password">
                                    <i className="fas fa-lock me-2 text-primary"></i>
                                    Senha
                                </label>
                                <input className="form-control-modern" type="password" name="password" id="password" placeholder="***********" 
                                onChange={(e) => this.setState({ password: e.target.value })}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark mb-2" htmlFor="document">
                                    <i className="fas fa-id-card me-2 text-primary"></i>
                                    <Link to="https://www.4devs.com.br/gerador_de_cpf" target="_blank" className="text-primary text-decoration-none">Documento (CPF ou CNPJ)</Link>
                                </label>
                                <input className="form-control-modern" type="text" name="document" id="document" placeholder="CPF ou CNPJ"
                                onChange={(e) => this.setState({ document: e.target.value })}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark mb-2" htmlFor="phoneNumber">
                                    <i className="fas fa-phone me-2 text-primary"></i>
                                    Celular
                                </label>
                                <PhoneNumberInput value={this.state.phoneNumber} onChange={(e) => this.setState({ phoneNumber: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-dark mb-2" htmlFor="establishment">
                                    <i className="fas fa-store me-2 text-primary"></i>
                                    Nome do Estabelecimento
                                </label>
                                <input className="form-control-modern" type="text" name="establishment" id="establishment" placeholder="Barbearia PratiCorte"
                                onChange={(e) => this.setState({ establishment: e.target.value })} />
                            </div>
                        </form>
                        <Link to="/termos-de-uso" target="_blank" className="mb-4 d-block text-center">
                            <small className="text-muted">
                                <i className="fas fa-file-contract me-2"></i>
                                <b>Termo de uso e política de privacidade.</b>
                            </small>
                        </Link>
                        <button className="btn btn-modern w-100 mb-4" onClick={this.handleRegister}>
                            <i className="fas fa-user-plus me-2"></i>
                            Cadastre-se
                        </button>
                        <div className="text-center">
                            <p className="text-muted mb-3">Já é cliente?</p>
                            <Link to="/">
                                <button className="btn btn-modern-secondary w-100">
                                    <i className="fas fa-sign-in-alt me-2"></i>
                                    Acesse sua conta!
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}



export { Login, Register }