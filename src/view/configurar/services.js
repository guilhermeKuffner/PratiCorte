import React from "react";
import { NavBar } from "../../components/navbar"

class Services extends React.Component {
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
                                <select name="status" id="status" className="form-control">
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
                                </select>
                                <label>Nome do serviço</label>
                                <input type="text" name="nome" id="nome" placeholder="Nome do serviço" className="form-control"/>
                                <label>Descrição</label>
                                <textarea name="descricao" id="descricao" placeholder="Descrição" className="form-control" rows="4"/>
                                <label>Preço</label>
                                <input type="text" name="preco" id="preco" placeholder="Preço" className="form-control"/>
                                <label>Duração</label>
                                <input type="text" name="duracao" id="duracao" placeholder="Duração" className="form-control"/>
                                <button className="btn btn-primary mt-3">Cadastrar</button>
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