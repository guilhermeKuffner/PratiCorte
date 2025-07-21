import React from "react";
import { getAppointmentsByDate } from "../../store/collections/appointmentWorker";
import { getEstabelecimento, getSessao } from '../../config/auth';
import { AppointmentCard } from "../../components/AppointmentCard";


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
        const providers = [...new Map(appointments.map(a => [a.provider.id, a.provider])).values()]
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
                                                                {provider.nome}
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
                                            console.log(appointment, 1),
                                            <AppointmentCard 
                                                key={Math.random()}
                                                appointment={appointment}
                                                index={index}
                                            />
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