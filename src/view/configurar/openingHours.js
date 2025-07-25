import React from "react";
import { NavBar } from "../../components/navbar"
import { TimeInput } from "../../shared/utils";
import { getEstabelecimento, setHorarios, getHorarios } from "../../config/auth";
import { getOpeningHours, addOpeningHours, updateOpeningHours } from "../../store/collections/openingHoursWorker";
import { isEmpty } from "../../shared/utils";
import { isValidMinutes } from "../../services/appointment/appointmentService";

class OpeningHours extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            establishment: getEstabelecimento(),
            horariosId: "",
            horarios: [
                { dia: "Domingo", horarioInicio: "00:00", horarioFim: "00:00", status: "active", day: 0 },
                { dia: "Segunda-feira", horarioInicio: "00:00", horarioFim: "00:00", status: "active", day: 1 },
                { dia: "Terça-feira", horarioInicio: "00:00", horarioFim: "00:00", status: "active", day: 2 },
                { dia: "Quarta-feira", horarioInicio: "00:00", horarioFim: "00:00", status: "active", day: 3 },
                { dia: "Quinta-feira", horarioInicio: "00:00", horarioFim: "00:00", status: "active", day: 4 },
                { dia: "Sexta-feira", horarioInicio: "00:00", horarioFim: "00:00", status: "active", day: 5 },
                { dia: "Sabado", horarioInicio: "00:00", horarioFim: "00:00", status: "active", day: 6 },
            ],
        }
    }

    componentDidMount() {
        this.load()
    }

    load = async () => {
        var horarios = getHorarios()
        if (isEmpty(horarios)) {
            horarios = await getOpeningHours(this.state.establishment.id)
        }
        if (!isEmpty(horarios)) {
            this.setState({ horarios: horarios.horarios })
            this.setState({ horariosId: horarios.id })
        }
    }

    handleChangeHorario = (e, index, field) => {
        const value = e.target.value
        const horarios = this.state.horarios
        horarios[index][field] = value
        this.setState({ horarios: horarios })
    }

    handleChangeStatus = (index) => {
        const horarios = [...this.state.horarios];
        horarios[index].status = horarios[index].status == "active" ? "inactive" : "active";
        this.setState({ horarios: horarios })
    }

    getStatus = (index) => {
        return this.state.horarios[index]?.status == "active" ? true : false
    }

    save = async () => {
        const data = {
            estabelecimentoId: this.state.establishment.id,
            horarios: this.state.horarios,
            id: this.state.horariosId,
        }
        if (this.verifyFields(data)) {
            for (let i = 0; i < data.horarios.length; i++) {
                if (isEmpty(data.horarios[i].day)) {
                    data.horarios[i].day = i
                }
            }
            try {
                if (this.state.horariosId === "") {
                    console.log("adicionando")
                    await addOpeningHours(data)
                } else {
                    console.log("atualizando")
                    await updateOpeningHours(data)
                }
                setHorarios(data)
                alert("Horário de funcionamento salvo com sucesso!")
            } catch (error) {
                console.error("Erro ao cadastrar horário de funcionamento:", error.message)
            }
        }
    }

    verifyFields = (data) => {
        for (let i = 0; i < data.horarios.length; i++) {
            if (isEmpty((data.horarios[i].horarioInicio)) || isEmpty((data.horarios[i].horarioFim) && data.horarios[i].status === "active")) {
                alert("Preencha o horario de inicio e fim.")
                return false
            }
            if (data.horarios[i].horarioInicio > data.horarios[i].horarioFim) {
                alert("O horario de inicio deve ser menor que o horario de fim.")
                return false
            }
            if (!isValidMinutes(data.horarios[i].horarioInicio) || !isValidMinutes(data.horarios[i].horarioFim)) {
                return false
            }
            console.log(data.horarios[i])
        }
        return true
    }

    render() {
        return (
            <>
                <NavBar/>
                <div className="d-flex justify-content-center py-5">
                    <div className="card p-4 shadow bg-white rounded w-auto">
                        <h5 className="mb-4">Configurar horário de funcionamento</h5>
                        <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center mb-2">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="switch-segunda" checked={this.getStatus(0)} onChange={() => this.handleChangeStatus(0)}/>
                                </div>
                                <div className="text-start pe-3 text-nowrap fw-bold" style={{ width: "130px" }}>Domingo</div>
                                <div className="me-1 text-nowrap">Início:</div>
                                <TimeInput value={this.state.horarios[0].horarioInicio} disabled={!this.getStatus(0)}
                                    onChange={(e) => this.handleChangeHorario(e, 0, "horarioInicio")} />
                                <div className="ms-3 me-1 text-nowrap">Fim:</div>
                                <TimeInput value={this.state.horarios[0].horarioFim} disabled={!this.getStatus(0)}
                                    onChange={(e) => this.handleChangeHorario(e, 0, "horarioFim")} />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="switch-segunda" checked={this.getStatus(1)} onChange={() => this.handleChangeStatus(1)}/>
                                </div>
                                <div className="text-start pe-3 text-nowrap fw-bold" style={{ width: "130px" }}>Segunda-feira</div>
                                <div className="me-1 text-nowrap">Início:</div>
                                <TimeInput value={this.state.horarios[1].horarioInicio} disabled={!this.getStatus(1)}
                                    onChange={(e) => this.handleChangeHorario(e, 1, "horarioInicio")} />
                                <div className="ms-3 me-1 text-nowrap">Fim:</div>
                                <TimeInput value={this.state.horarios[1].horarioFim} disabled={!this.getStatus(1)}
                                    onChange={(e) => this.handleChangeHorario(e, 1, "horarioFim")} />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="switch-segunda" checked={this.getStatus(2)} onChange={() => this.handleChangeStatus(2)}/>
                                </div>
                                <div className="text-start pe-3 text-nowrap fw-bold" style={{ width: "130px" }}>Terça-feira</div>
                                <div className="me-1 text-nowrap">Início:</div>
                                <TimeInput value={this.state.horarios[2].horarioInicio} disabled={!this.getStatus(2)}
                                    onChange={(e) => this.handleChangeHorario(e, 2, "horarioInicio")} />
                                <div className="ms-3 me-1 text-nowrap">Fim:</div>
                                <TimeInput value={this.state.horarios[2].horarioFim} disabled={!this.getStatus(2)}
                                    onChange={(e) => this.handleChangeHorario(e, 2, "horarioFim")} />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="switch-segunda" checked={this.getStatus(3)} onChange={() => this.handleChangeStatus(3)}/>
                                </div>
                                <div className="text-start pe-3 text-nowrap fw-bold" style={{ width: "130px" }}>Quarta-feira</div>
                                <div className="me-1 text-nowrap">Início:</div>
                                <TimeInput value={this.state.horarios[3].horarioInicio} disabled={!this.getStatus(3)}
                                    onChange={(e) => this.handleChangeHorario(e, 3, "horarioInicio")} />
                                <div className="ms-3 me-1 text-nowrap">Fim:</div>
                                <TimeInput value={this.state.horarios[3].horarioFim} disabled={!this.getStatus(3)}
                                    onChange={(e) => this.handleChangeHorario(e, 3, "horarioFim")} />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="switch-segunda" checked={this.getStatus(4)} onChange={() => this.handleChangeStatus(4)}/>
                                </div>
                                <div className="text-start pe-3 text-nowrap fw-bold" style={{ width: "130px" }}>Quinta-feira</div>
                                <div className="me-1 text-nowrap">Início:</div>
                                <TimeInput value={this.state.horarios[4].horarioInicio} disabled={!this.getStatus(4)}
                                    onChange={(e) => this.handleChangeHorario(e, 4, "horarioInicio")} />
                                <div className="ms-3 me-1 text-nowrap">Fim:</div>
                                <TimeInput value={this.state.horarios[4].horarioFim} disabled={!this.getStatus(4)}
                                    onChange={(e) => this.handleChangeHorario(e, 4, "horarioFim")} />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="switch-segunda" checked={this.getStatus(5)} onChange={() => this.handleChangeStatus(5)}/>
                                </div>
                                <div className="text-start pe-3 text-nowrap fw-bold" style={{ width: "130px" }}>Sexta-feira</div>
                                <div className="me-1 text-nowrap">Início:</div>
                                <TimeInput value={this.state.horarios[5].horarioInicio} disabled={!this.getStatus(5)}
                                    onChange={(e) => this.handleChangeHorario(e, 5, "horarioInicio")} />
                                <div className="ms-3 me-1 text-nowrap">Fim:</div>
                                <TimeInput value={this.state.horarios[5].horarioFim} disabled={!this.getStatus(5)}
                                    onChange={(e) => this.handleChangeHorario(e, 5, "horarioFim")} />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="switch-segunda" checked={this.getStatus(6)} onChange={() => this.handleChangeStatus(6)}/>
                                </div>
                                <div className="text-start pe-3 text-nowrap fw-bold" style={{ width: "130px" }}>Sábado</div>
                                <div className="me-1 text-nowrap">Início:</div>
                                <TimeInput value={this.state.horarios[6].horarioInicio} disabled={!this.getStatus(6)}
                                    onChange={(e) => this.handleChangeHorario(e, 6, "horarioInicio")} />
                                <div className="ms-3 me-1 text-nowrap">Fim:</div>
                                <TimeInput value={this.state.horarios[6].horarioFim} disabled={!this.getStatus(6)}
                                    onChange={(e) => this.handleChangeHorario(e, 6, "horarioFim")} />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-primary" onClick={this.save}>Salvar</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export { OpeningHours }