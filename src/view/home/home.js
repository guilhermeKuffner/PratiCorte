import React from "react";
import { getSessao, getEstabelecimento } from "../../config/auth";
import { NavBar } from "../../components/navbar";
import { getAppointmentsByDate } from "../../store/collections/appointmentWorker";
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
        }
    }

    async componentDidMount() {
        const today = new Date()
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
        const appointments = await getAppointmentsByDate(this.state.establishment.id, today, endDate)
        const groupedAppointments = groupAgendamentosByDayOfWeek(appointments)
        this.setState({ appointments: groupedAppointments })
    }

    onAddAppointment = async (data) => {
        this.setState(prevState => ({
            appointments: [...prevState.appointments, data]
        }))
    }

    showEditingAppointmentModal = (appointment) => {
        return () => {
            this.setState({ editingAppointmentModalOpen: true, editingAppointment: {...appointment}
            })
        }
    }

    hideEditingAppointment = () => {
        this.setState({ editingAppointmentModalOpen: false, editingAppointment: null })
    }

    handleEditAppointment = async () => {
        this.hideEditingAppointment()
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
                                    <h5>Editando Agendamento</h5>
                                    <h6>Data: {secondsToDateString(this.state.editingAppointment.dateInfo.date.seconds)}</h6>
                                    <h6>Horário: {this.state.editingAppointment.dateInfo.hour}</h6>
                                    <h6>Prestador: {this.state.editingAppointment.provider.nome}</h6>
                                    <h6>Serviço: {this.state.editingAppointment.service.nome}</h6>
                                    <h6>Cliente: {this.state.editingAppointment.cliente.nome}</h6>
                                    <h6>Telefone: {this.state.editingAppointment.cliente.celular}</h6>
                                    <button className="btn btn-primary" onClick={this.handleEditAppointment}>Salvar</button>
                                    <button className="btn btn-secondary" onClick={this.hideEditingAppointment}>Cancelar</button>
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
