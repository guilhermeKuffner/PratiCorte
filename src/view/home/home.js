import React from "react";
import { getSessao, getEstabelecimento } from "../../config/auth";
import { NavBar } from "../../components/navbar";
import { getAppointmentsByDate } from "../../store/collections/appointmentWorker";
import { getActiveUsersAppointmentAllowed } from '../../store/collections/userWorker';
import { Appointment } from "./appointment";
import { History } from "./history";
import { groupAgendamentosByDayOfWeek, completeAvailableHours } from "../../services/appointment/appointmentService";


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: getEstabelecimento(),
            sessao: getSessao(),
            appointments: [],
        }
    }

    async componentDidMount() {
        this.load()
    }

    load = async () => {
        const today = new Date()
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
        const appointments = await getAppointmentsByDate(this.state.establishment.id, today, endDate)
        const groupedAppointments = groupAgendamentosByDayOfWeek(appointments)

        const providers = await getActiveUsersAppointmentAllowed(this.state.establishment.id)
        const horarios = this.state.sessao.horarios
        const completedAvailableHours = completeAvailableHours(horarios)
        
        const appoitmentData = {
            horarios: completedAvailableHours,
            providers: providers,
            appointmentTitle: 'Realize um agendamento',
        }
        this.setState({
            appointments: groupedAppointments, 
            appoitmentData: appoitmentData
        })
    }

    render() {
        return (
            <>
                <NavBar />
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-start">
                    <Appointment onAddAppointment={this.load} appoitmentData={this.state.appoitmentData}/>
                    <History appointments={this.state.appointments} load={this.load} appoitmentData={this.state.appoitmentData}/>
                </div>
            </>
        );
    }
}

export { Home };
