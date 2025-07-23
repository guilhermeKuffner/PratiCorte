import React from "react";
import { getSessao, getEstabelecimento } from "../../config/auth";
import { NavBar } from "../../components/navbar";
import { getAppointmentsByDate, updateAppointment } from "../../store/collections/appointmentWorker";
import { Appointment } from "./appointment";
import { History } from "./history";
import { groupAgendamentosByDayOfWeek } from "../../shared/utils";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { secondsToDateString } from "../../shared/utils";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: getEstabelecimento(),
            sessao: getSessao(),
            appointments: [],
            editingAppointmentModalOpen: false,
            editingAppointment: null,
            editingAppointmentDate: null,
            editingAppointmentHour: null,
            editingAppointmentProvider: null,
            editingAppointmentService: null,
            editingAppointmentClientName: null,
            editingAppointmentClientPhone: null,
        }
    }

    async componentDidMount() {
        this.load()
    }

    onAddAppointment = async (data) => {
        this.setState(prevState => ({
            appointments: [...prevState.appointments, data]
        }))
    }

    load = async () => {
        const today = new Date()
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
        const appointments = await getAppointmentsByDate(this.state.establishment.id, today, endDate)
        const groupedAppointments = groupAgendamentosByDayOfWeek(appointments)
        this.setState({ appointments: groupedAppointments })
        console.log(this.state)
    }

    showEditingAppointmentModal = (appointment) => {
        console.log("Editando agendamento:", appointment)
        return () => {
                this.setState({ editingAppointmentModalOpen: true, 
                    editingAppointment: {...appointment},
                    editingAppointmentDate: appointment.dateInfo.date,
                    editingAppointmentHour: appointment.dateInfo.hour,
                    editingAppointmentService: appointment.service,
                    editingAppointmentClientName: appointment.cliente.nome,
                    editingAppointmentClientPhone: appointment.cliente.celular
            })
        }
    }

    hideEditingAppointment = () => {
        this.setState({ editingAppointmentModalOpen: false, editingAppointment: null })
    }

    handleEditAppointment = async () => {
        this.hideEditingAppointment()
    }

    handleCancelAppointment = async () => {
        const data = {
            ...this.state.editingAppointment,
            canceledAt: new Date(),
            canceledBy: this.state.sessao.usuario.id,
            isCanceled: true,
        }
        try {
            console.log("Cancelando agendamento:", data)
            await updateAppointment(data)
            this.load()
            this.hideEditingAppointment()
        } catch (error) {
            console.error("Erro ao realizar agendamento:", error.message)
        }
    }

    render() {
        return (
            <>
                <NavBar />
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-start">
                    <Appointment onAddAppointment={this.onAddAppointment} />
                    <History appointments={this.state.appointments} showEditingAppointmentModal={this.showEditingAppointmentModal} />
                    <Dialog onClose={this.hideEditingAppointment} fullWidth maxWidth={"xs"} open={this.state.editingAppointmentModalOpen}>
                        {
                            this.state.editingAppointmentModalOpen && (
                                <DialogContent>
                                    <div>
                                        <h5>Editando Agendamento</h5>
                                        <h6>Prestador: {this.state.editingAppointment.provider.nome}</h6>

                                        <label>Data do agendamento</label>
                                        <select name="editingDate" id="editingDate" className="form-control" onChange={(e) => this.setState({ editingAppointmentDate: e.target.value })}>
                                            <option value="true">{secondsToDateString(this.state.editingAppointmentDate.seconds)}</option>
                                        </select>

                                        <label>Horário do agendamento</label>
                                        <select name="editingDate" id="editingDate" className="form-control" onChange={(e) => this.setState({ editingAppointmentHour: e.target.value })}>
                                            <option value="true">{this.state.editingAppointmentHour}</option>
                                        </select>    

                                        <label>Serviço selecionado</label>
                                        <select name="editingDate" id="editingDate" className="form-control" onChange={(e) => this.setState({ editingAppointmentService: e.target.value })}>
                                            <option value="true">{this.state.editingAppointmentService.nome}</option>
                                        </select>

                                        <label>Cliente</label>
                                        <input type="text" name="nome" id="nome" placeholder="Nome do serviço" className={`form-control ${this.state.newUserNomeAlert}`}
                                            value={this.state.editingAppointmentClientName} onChange={(e) => this.setState({ editingAppointmentClientName: e.target.value })} />

                                        <label>Celular</label>
                                        <input type="text" name="nome" id="nome" placeholder="Nome do serviço" className={`form-control ${this.state.newUserNomeAlert}`}
                                            value={this.state.editingAppointmentClientPhone} onChange={(e) => this.setState({ editingAppointmentClientPhone: e.target.value })} />
                                    </div>
                                    <div className="d-flex justify-content-between gap-2 mt-3">
                                        <button className="btn btn-primary" onClick={this.handleEditAppointment}>Salvar</button>
                                        <button className="btn btn-danger" onClick={this.handleCancelAppointment}>CANCELAR</button>
                                        <button className="btn btn-secondary" onClick={this.hideEditingAppointment}>Fechar</button>
                                    </div>

                                </DialogContent>
                            )
                        }
                    </Dialog>
                </div>
            </>
        );
    }
}

export { Home };
