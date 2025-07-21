import React from "react";
import { getAppointmentsByDate } from "../../store/collections/appointmentWorker";
import { getEstabelecimento, getSessao } from '../../config/auth';
import { secondsToDateString } from "../../shared/utils";


class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: getEstabelecimento(),
            appointments: []
        }
    }

    componentDidMount() {
        this.load()
    }

    load = async () => {
        const today = new Date()
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
        const appointments = await getAppointmentsByDate(this.state.establishment.id, today, endDate)
        this.setState({ 
            appointments: appointments,
        })
    }


    render() {
        return (
            <div className="history">
                <div className={"d-flex justify-content-center py-5"}>
                    <div className="card p-4 shadow bg-white rounded w-auto">
                    <h5 className="mb-3 text-center">Proximos agendamentos</h5>
                    {
                        this.state.appointments.length === 0 ? (
                            <p className="text-center">Nenhum agendamento encontrado nos proximos 7 dias.</p>
                        ) : (
                            <ul className="list-group">
                                {this.state.appointments.map((appointment, index) => (
                                    console.log(appointment),
                                    <li key={index} className="list-group-item">
                                        <div>
                                            <strong>Data:</strong> {secondsToDateString(appointment.dateInfo.date.seconds)}<br />
                                            <strong>Horário:</strong> {appointment.dateInfo?.hour}<br />
                                            <strong>Serviço:</strong> {appointment.service?.nome}<br />
                                            <strong>Cliente:</strong> {appointment.client?.name}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export { History }