import React from "react";
import { getAppointmentsByDate } from "../../store/collections/appointmentWorker";
import { getEstabelecimento, getSessao } from '../../config/auth';
import { secondsToDateString } from "../../shared/utils";


class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: getEstabelecimento(),
            providers: [],
            appointmentsOriginal: [],
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
        const providers = appointments.map(appointment => {
            return {
                id: appointment.provider.id,
                name: appointment.provider.nome
            }
        })
        this.setState({ 
            appointmentsOriginal: appointments,
            appointments: appointments,
            providers: providers
        })
    }

    selectProvider = (provider) => () => {
        if (!provider) {
            this.setState({ 
                appointments: this.state.appointmentsOriginal,
            })
            return
        }

        const filteredAppointments = this.state.appointmentsOriginal.filter(appointment => appointment.provider.id === provider.id)
        this.setState({ 
            appointments: filteredAppointments,
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
                            <>
                                {
                                    this.state.providers.length > 0 && (
                                        <div className="mb-3">
                                            <strong>Profissionais:</strong>
                                            <div className="d-flex flex-column gap-2 btn-group">
                                                <input type="radio" class="btn-check" name="btnradio" id={`btnradio`} autocomplete="off"/>
                                                <label class="btn btn-outline-primary rounded" for={`btnradio`} onClick={this.selectProvider()}>
                                                    Todos
                                                </label>
                                                {
                                                    this.state.providers.map((provider, index) => (
                                                        <>
                                                            <input type="radio" class="btn-check" name="btnradio" id={`btnradio${index}`} autocomplete="off" />
                                                            <label class="btn btn-outline-primary rounded" for={`btnradio${index}`} key={index} onClick={this.selectProvider(provider)}>
                                                                {provider.name}
                                                            </label>
                                                        </>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                <ul className="list-group">
                                    {
                                        this.state.appointments.map((appointment, index) => (
                                            console.log(appointment),
                                            <li key={index} className="list-group-item">
                                                <div>
                                                    <strong>Data:</strong> {secondsToDateString(appointment.dateInfo.date.seconds)}<br />
                                                    <strong>Horário:</strong> {appointment.dateInfo?.hour}<br />
                                                    <strong>Serviço:</strong> {appointment.service?.nome}<br />
                                                    <strong>Cliente:</strong> {appointment.cliente?.nome}
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </>
                        )
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export { History }