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
            appointmentsOriginal: props.appointments || [],
            appointments: props.appointments || [],
            TodaysDayOfWeek: new Date().getDay()
        }
    }

    componentDidMount() {
        this.load()
    }

    componentDidUpdate(prevProps) {
            if (prevProps.appointments !== this.props.appointments) {
            this.setState({
                appointmentsOriginal: this.props.appointments || [],
                appointments: this.props.appointments || []
                }, () => {
                this.load()
            })
        }
    }

  load = () => {
        const appointments = this.state.appointmentsOriginal
        const providers = [...new Map(appointments.flatMap(d => d.agendamentos).map(a => [a.provider.id, a.provider])).values()]
        this.setState({ providers: providers })
    }

    selectProvider = (provider) => () => {
        if (!provider) {
            this.setState({ 
                appointments: this.state.appointmentsOriginal,
            })
            return
        }

        const filteredAppointments = this.state.appointmentsOriginal.map(day => ({
            day: day.day,
            indexDayOfWeek: day.indexDayOfWeek,
            agendamentos: day.agendamentos.filter(appointment => appointment.provider.id === provider.id)
        })).filter(day => day.agendamentos.length > 0)
        this.setState({ 
            appointments: filteredAppointments,
        })
    }

    verifyIfToday = (indexDayOfWeek) => {
        if (indexDayOfWeek === this.state.TodaysDayOfWeek) {
            return "  (Hoje)"
        }
        return ""
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
                                                <input type="radio" className="btn-check" name="btnradio" id={`btnradio`} />
                                                <label className="btn btn-outline-primary rounded" htmlFor={`btnradio`} key={"btnradio"} onClick={this.selectProvider()}>
                                                    Todos
                                                </label>
                                                {
                                                    this.state.providers.map((provider, index) => (
                                                        <>
                                                            <input type="radio" className="btn-check" name="btnradio" id={`btnradio${index}`} />
                                                            <label className="btn btn-outline-primary rounded" htmlFor={`btnradio${index}`} key={index} onClick={this.selectProvider(provider)}>
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
                                            <>
                                                <h5 className="mt-2 text-center">{appointment.day}{this.verifyIfToday(appointment.indexDayOfWeek)}</h5>
                                                {
                                                    this.state.appointments[index].agendamentos.map((agendamento) => (
                                                        <AppointmentCard 
                                                            key={Math.random()}
                                                            appointment={agendamento}
                                                            establishment={this.state.establishment}
                                                        />
                                                    ))
                                                }
                                            </>
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