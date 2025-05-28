import React from "react";
import { NavBar } from "../../components/navbar"
import { isEmpty } from "../../shared/utils";
import { addUser, getUsers } from "../../store/collections/userWorker";
import { getEstabelecimento } from "../../config/auth";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: getEstabelecimento(),
            newUserStatus: "Ativo",
            newUserNome: "",
            newUserCelular: "",
            newUserEmail: "",
            newUserSenha: "",
            users : [],

            newUserNomeAlert: "",
            newUserCelularAlert: "",
            newUserEmailAlert: "",
            newUserSenhaAlert: "",

            editingUserModalOpen: false,
            editingUser: null,
        }
    }

    componentDidMount() {
        this.load()
    }

    load = async () => {
        console.log(this.state.users)
        const users = await getUsers(this.state.establishment.id)
        console.log(users)
        this.setState({ users: users })
    }

    handleNewUser = async () => {
        const data = {
            status: this.state.newUserStatus,
            nome: this.state.newUserNome,
            celular: this.state.newUserCelular,
            email: this.state.newUserEmail,
            senha: this.state.newUserSenha,
        }
        if (this.verifyFields(data)) {
            try {
                await addUser(data)
                alert("Usuário cadastrado com sucesso!")
                this.load()
                this.cleanFields()
            } catch (error) {
                console.error("Erro ao cadastrar serviço:", error.message)
            }
        }
    }

    cleanFields = () => {
        this.setState({ newUserStatus: "Ativo", newUserNome: "", newUserCelular: "", newUserEmail: "", newUserSenha: "" })
    }

    verifyFields = (data) => {
        var isValid = true
        var invalidAlert = ""
        if (isEmpty(data.nome)) {
            invalidAlert = isEmpty(invalidAlert) ? "Informe o nome" : invalidAlert
            this.setState({ newServiceNomeAlert: "is-invalid" })
            isValid = false
        }
        if (isEmpty(data.celular)) {
            invalidAlert = isEmpty(invalidAlert) ? "Informe o celular" : invalidAlert
            this.setState({ newServicePrecoAlert: "is-invalid" })
            isValid = false
        }
        if (isEmpty(data.email)) {
            invalidAlert = isEmpty(invalidAlert) ? "Informe o email" : invalidAlert
            this.setState({ newServiceDuracaoAlert: "is-invalid" })
            isValid = false
        }
        if (isEmpty(data.senha)) {
            invalidAlert = isEmpty(invalidAlert) ? "Informe a senha" : invalidAlert
            this.setState({ newServiceDuracaoAlert: "is-invalid" })
            isValid = false
        }
        if (!isValid) {
            alert(invalidAlert)
        }
        return isValid
    }

    render() {
        return (
            <>
                <NavBar />
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-4 mb-4">
                            <div className="card p-3 shadow-lg bg-white rounded">
                                <h2>Cadastrar usuário</h2>
                                <label>Status</label>
                                <select name="status" id="status" className="form-control" onChange={(e) => this.setState({ newUserStatus: e.target.value })}>
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
                                </select>
                                <label>Nome</label>
                                <input type="text" name="nome" id="nome" placeholder="Nome do serviço" className={`form-control ${this.state.newUserNomeAlert}`}
                                    value={this.state.newUserNome} onChange={(e) => this.setState({ newUserNome: e.target.value, newUserNomeAlert: "" })} />
                                <label>Celular</label>
                                <input type="text" name="celular" id="celular" placeholder="Celular" className={`form-control ${this.state.newUserCelularAlert}`}
                                    value={this.state.newUserCelular} onChange={(e) => this.setState({ newUserCelular: e.target.value, newUserCelularAlert: "" })} />
                                <label>Email</label>
                                <input type="text" name="email" id="email" placeholder="Email" className={`form-control ${this.state.newUserEmailAlert}`}
                                    value={this.state.newUserEmail} onChange={(e) => this.setState({ newUserEmail: e.target.value, newUserEmailAlert: "" })} />
                                <label>Senha</label>
                                <input type="text" name="senha" id="senha" placeholder="Senha" className={`form-control ${this.state.newUserSenhaAlert}`}
                                    value={this.state.newUserSenha} onChange={(e) => this.setState({ newUserSenha: e.target.value, newUserSenhaAlert: "" })} />
                                <button className="btn btn-primary mt-3" onClick={this.handleNewUser}>Cadastrar</button>

                            </div>
                        </div>
                        <div className="col-12 col-md-8 mb-4">
                            <div className="card p-4 shadow-lg bg-white rounded mb-3">
                                <h2>Usuários cadastrados</h2>
                                {
                                    this.state.users.length > 0 &&
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="col-md-3">Nome</th>
                                                <th scope="col" className="d-none d-md-table-cell col-md-4">email</th>
                                                <th scope="col" className="text-center col-md-2">celular</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.users.map((user, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="text-start">{user.nome}</td>
                                                            <td className="text-start">{user.email}</td>
                                                            <td className="text-start">{user.celular}</td>
                                                            <td className="align-middle">
                                                                <div className="d-flex flex-nowrap gap-2 justify-content-center">
                                                                    <button className="btn btn-secondary" onClick={""}>
                                                                        <i className="fas fa-edit" />
                                                                    </button>
                                                                    <button className="btn btn-danger" onClick={() => this.handleDeleteUser(user)}>
                                                                        <i className="fas fa-trash" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog onClose={this.hideEditingUserModal} fullWidth maxWidth={"xs"} open={this.state.editingUserModalOpen}>
                    {
                        this.state.editingUserModalOpen &&
                        <DialogContent>
                            <div className="card p-4 shadow-lg bg-white rounded">
                                <h2>Editar usuário</h2>
                                <label>Nome</label>
                                <input type="text" name="nome" id="nome" placeholder="Nome do serviço" className={`form-control ${this.state.newUserNomeAlert}`}
                                    value={this.state.newUserNome} onChange={(e) => this.setState({ newUserNome: e.target.value, newUserNomeAlert: "" })} />
                                <label>Celular</label>
                                <input type="text" name="celular" id="celular" placeholder="Celular" className={`form-control ${this.state.newUserCelularAlert}`}
                                    value={this.state.newUserCelular} onChange={(e) => this.setState({ newUserCelular: e.target.value, newUserCelularAlert: "" })} />
                                <label>Email</label>
                                <input type="text" name="email" id="email" placeholder="Email" className={`form-control ${this.state.newUserEmailAlert}`}
                                    value={this.state.newUserEmail} onChange={(e) => this.setState({ newUserEmail: e.target.value, newUserEmailAlert: "" })} />
                                <label>Senha</label>
                                <input type="text" name="senha" id="senha" placeholder="Senha" className={`form-control ${this.state.newUserSenhaAlert}`}
                                    value={this.state.newUserSenha} onChange={(e) => this.setState({ newUserSenha: e.target.value, newUserSenhaAlert: "" })} />
                            </div>
                        </DialogContent>
                    }
                </Dialog>
            </>
        )
    }
}

export { Users }