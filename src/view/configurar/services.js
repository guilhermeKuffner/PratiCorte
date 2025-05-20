import React from "react";
import { NavBar } from "../../components/navbar"
import { TimeInput, isEmpty, removeSimbols, convertTimeToMinutes } from "../../shared/utils";
import CurrencyInput from "../../components/CurrencyInput";
import { addService } from "../../store/collections/servicesWorker";

class Services extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newServiceStatus: "Ativo",
            newServiceNome: "",
            newServiceDescricao: "",
            newServicePreco: "",
            newServiceDuracao: "",
            services: [],

            newServiceNomeAlert: "",
            newServiceDescricaoAlert: "",
            newServicePrecoAlert: "",
            newServiceDuracaoAlert: "",
        }
    }

    handleNewService = async () => {
        const data = {
            status : this.state.newServiceStatus,
            nome : this.state.newServiceNome,
            descricao : this.state.newServiceDescricao,
            preco : this.state.newServicePreco,
            duracao : convertTimeToMinutes(this.state.newServiceDuracao),
        }
        if (this.verifyFields(data)) {
            try {
                await addService(data)
                alert("Serviço cadastrado com sucesso!")
                this.updateList()
                this.cleanFields()
            } catch (error) {
                console.error("Erro ao cadastrar serviço:", error.message)
            }
        }
    }

    updateList = async () => {
        // TO DO - buscar lista por id e atualizar ou só pegar a lista que ja tinha e adicionar
    }

    cleanFields = () => {
        this.setState({ newServiceStatus: "Ativo", newServiceNome: "", newServiceDescricao: "", newServicePreco: "", newServiceDuracao: "" })
    }

    verifyFields = (data) => {
        var isValid = true
        var invalidAlert = ""
        if (isEmpty(data.nome)) {
            invalidAlert = isEmpty(invalidAlert) ? "Nome do serviço não informado" : invalidAlert
            this.setState({ newServiceNomeAlert: "is-invalid" })
            isValid = false
        }
        if (isEmpty(data.preco) || parseInt(data.preco) <= 0) {
            invalidAlert = isEmpty(invalidAlert) ? "Preço do serviço não informado" : invalidAlert
            this.setState({ newServicePrecoAlert: "is-invalid" })
            isValid = false
        }
        console.log(data.duracao)
        if (data.duracao <= 0) {
            invalidAlert = isEmpty(invalidAlert) ? "Duração do serviço inválida" : invalidAlert
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
                <NavBar/>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-4 mb-4">
                            <div className="card p-3 shadow-lg bg-white rounded">
                                <h2>Cadastrar serviços</h2>
                                <label>Status</label>
                                <select name="status" id="status" className="form-control" onChange={(e) => this.setState({ newServiceStatus: e.target.value })}>
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
                                </select>
                                <label>Nome do serviço</label>
                                <input type="text" name="nome" id="nome" placeholder="Nome do serviço" className={`form-control ${this.state.newServiceNomeAlert}`}
                                    onChange={(e) => this.setState({ newServiceNome: e.target.value, newServiceNomeAlert: "" })}/>
                                <label>Descrição</label>
                                <textarea name="descricao" id="descricao" placeholder="Descrição" className={`form-control ${this.state.newServiceDescricaoAlert}`} rows="4"
                                    onChange={(e) => this.setState({ newServiceDescricao: e.target.value, newServiceDescricaoAlert: "" })}/>
                                <label>Preço</label>
                                <CurrencyInput prefix="R$" value={this.state.newServicePreco} className={`form-control ${this.state.newServicePrecoAlert}`} 
                                    onChangeEvent={(event, maskedvalue, value) => { this.setState({ newServicePreco: value, newServicePrecoAlert: "" }) }} />
                                <label>Duração</label>
                                <TimeInput value={this.state.newServiceDuracao} className={this.state.newServiceDuracaoAlert}
                                   onChange={(e) => this.setState({ newServiceDuracao: e.target.value, newServiceDuracaoAlert: "" })}/>
                                <button className="btn btn-primary mt-3" onClick={this.handleNewService}>Cadastrar</button>
                            </div>
                        </div>
                        <div className="col-12 col-md-8 mb-4">
                            <div className="card p-4 shadow-lg bg-white rounded mb-3">
                                <h2>Serviços cadastrados</h2>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-md-3">Nome</th>
                                            <th scope="col" className="d-none d-md-table-cell col-md-4">Descrição</th>
                                            <th scope="col" className="text-center col-md-2">Preço</th>
                                            <th scope="col" className="text-center col-md-2">Duração</th>
                                            <th scope="col" className="text-center col-md-2">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Serviço 1</td>
                                            <td className="d-none d-md-table-cell">Descrição 1</td>
                                            <td className="text-center">R$100,00</td>
                                            <td className="text-center">01:00</td>
                                            <td className="d-flex flex-nowrap gap-2 justify-content-center">
                                                <button className="btn btn-secondary">
                                                    <i className="fas fa-edit" />
                                                </button>
                                                <button className="btn btn-danger">
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Serviço 2</td>
                                            <td className="d-none d-md-table-cell">Descrição 2</td>
                                            <td className="text-center">R$200,00</td>
                                            <td className="text-center">01:00</td>
                                            <td className="d-flex flex-nowrap gap-2 justify-content-center">
                                                <button className="btn btn-secondary">
                                                    <i className="fas fa-edit" />
                                                </button>
                                                <button className="btn btn-danger">
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export { Services }