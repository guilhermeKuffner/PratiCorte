import React from "react";
import { getSessao, getEstabelecimento } from "../../config/auth";
import { NavBar } from "../../components/navbar";
import { getAppointmentsByDate } from "../../store/collections/appointmentWorker";
import { Appointment } from "./appointment";
import { History } from "./history";
import { groupAgendamentosByDayOfWeek } from "../../services/appointment/appointmentService";


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
    }

    render() {
        return (
            <>
                <NavBar />
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-start">
                    <Appointment onAddAppointment={this.onAddAppointment} />
                    <History appointments={this.state.appointments} load={this.load} />
                </div>
            </>
        );
    }
}

export { Home };
