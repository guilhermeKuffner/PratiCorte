import React from "react";
import { NavBar } from "../../components/navbar"
import { TimeInput } from "../../shared/utils";

class OpeningHours extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            horarios: [
                { dia: "Domingo", horarioInicio: "00:00", horarioFim: "00:00" },
                { dia: "Segunda-feira", horarioInicio: "00:00", horarioFim: "00:00" },
                { dia: "Terça-feira", horarioInicio: "00:00", horarioFim: "00:00" },
                { dia: "Quarta-feira", horarioInicio: "00:00", horarioFim: "00:00" },
                { dia: "Quinta-feira", horarioInicio: "00:00", horarioFim: "00:00" },
                { dia: "Sexta-feira", horarioInicio: "00:00", horarioFim: "00:00" },
                { dia: "Sabado", horarioInicio: "00:00", horarioFim: "00:00" },
            ]
        }
    }

    handleChangeHorario = (e, index, field) => {
        const value = e.target.value
        const horarios = this.state.horarios
        horarios[index][field] = value
        this.setState({ horarios: horarios })
    }

    render() {
        return (
            <>
                <NavBar/>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-4 mb-4">
                            <div className="card p-3 shadow-lg bg-white rounded">
                                <h2>Configurar horario de funcionamento</h2>
                                <div>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="col-md-2">Dia</th>
                                                <th scope="col" className="col-md-3 justify-content-center">Horário de funcionamento</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Domingo</td>
                                                <td>
                                                    <div className="form-group row align-items-center">
                                                        <label className="col-auto col-form-label">Inicio</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioInicio} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioInicio")} />
                                                        </div>
                                                        <label className="col-auto col-form-label">Fim</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioFim} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioFim")} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Segunda-feira</td>
                                                <td>
                                                    <div className="form-group row align-items-center">
                                                        <label className="col-auto col-form-label">Inicio</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioInicio} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioInicio")} />
                                                        </div>
                                                        <label className="col-auto col-form-label">Fim</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioFim} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioFim")} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Terça-feira</td>
                                                <td>
                                                    <div className="form-group row align-items-center">
                                                        <label className="col-auto col-form-label">Inicio</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioInicio} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioInicio")} />
                                                        </div>
                                                        <label className="col-auto col-form-label">Fim</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioFim} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioFim")} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Quarta-feira</td>
                                                <td>
                                                    <div className="form-group row align-items-center">
                                                        <label className="col-auto col-form-label">Inicio</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioInicio} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioInicio")} />
                                                        </div>
                                                        <label className="col-auto col-form-label">Fim</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioFim} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioFim")} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Quinta-feira</td>
                                                <td>
                                                    <div className="form-group row align-items-center">
                                                        <label className="col-auto col-form-label">Inicio</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioInicio} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioInicio")} />
                                                        </div>
                                                        <label className="col-auto col-form-label">Fim</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioFim} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioFim")} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Sexta-feira</td>
                                                <td>
                                                    <div className="form-group row align-items-center">
                                                        <label className="col-auto col-form-label">Inicio</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioInicio} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioInicio")} />
                                                        </div>
                                                        <label className="col-auto col-form-label">Fim</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioFim} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioFim")} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Sabado</td>
                                                <td>
                                                    <div className="form-group row align-items-center">
                                                        <label className="col-auto col-form-label">Inicio</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioInicio} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioInicio")} />
                                                        </div>
                                                        <label className="col-auto col-form-label">Fim</label>
                                                        <div className="col-3">
                                                            <TimeInput value={this.state.horarios[0].horarioFim} 
                                                            onChange={(e) => this.handleChangeHorario(e, 0, "horarioFim")} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className="btn btn-primary mt-3 align-self-end ">Salvar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export { OpeningHours }