import React from "react";
import { updateAppointment } from "../../store/collections/appointmentWorker";
import { getEstabelecimento, getSessao } from '../../config/auth';
import { AppointmentCard } from "../../components/AppointmentCard";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { hoursArrayToString, dateToString } from "../../shared/utils";
import { completeAvailableHours, setAvailableHours } from '../../services/appointment/appointmentService'
import { Appointment } from "./appointment";

class History extends React.Component {
    constructor(props) {
        super(props);
            this.state = {
            establishment: getEstabelecimento(),
            providers: props.appoitmentData?.providers || [],
            horarios: props.appoitmentData?.horarios || [],
            appointmentsOriginal: props.appointments || [],
            appointments: props.appointments || [],
            TodaysDayOfWeek: new Date().getDay(),
            sessao: getSessao(),
            editingAppointmentModalOpen: false,
            editingAppointment: null,
            editingAppointmentDate: null,
            editingAppointmentHour: null,
            editingAppointmentProvider: null,
            editingAppointmentService: null,
            editingAppointmentClientName: null,
            editingAppointmentClientPhone: null,
            editingAppointmentDates: [],
            editingAppoitmentAvailableHours: [],
            edditingAppointmentHourSelected: [],
            edditingAppointmentHourSelectedOriginal: []
        }
    }

    componentDidMount() {
        this.load()
    }

    componentDidUpdate(prevProps) {
            if (prevProps.appointments !== this.props.appointments) {
            this.setState({
                appointmentsOriginal: this.props.appointments || [],
                appointments: this.props.appointments || [],
                providers: this.props.appoitmentData.providers,
                horarios: this.props.appoitmentData.horarios
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

    showEditingAppointmentModal = async (appointment) => {
        const horarios = this.state.sessao.horarios
        const completedAvailableHours = completeAvailableHours(horarios)
        const appoitmentData = {
            appointment: appointment,
            horarios: completedAvailableHours,
            providers: [appointment.provider],
            appointmentTitle: 'Selecione um horário',
            mininumStep: 2,
            originalHourSelected: appointment.dateInfo.hour,
        }
        this.setState({
            editingAppointmentModalOpen: true, 
            appoitmentData: appoitmentData,
            editingAppointment: { ...appointment }
        })
    }

    hideEditingAppointment = () => {
        this.setState({ editingAppointmentModalOpen: false, editingAppointment: null })
    }

    handleEditAppointment = async () => {
        this.hideEditingAppointment()
    }

    handleEditDate = (day) => {
        const selectedDate = day.target.value
        this.setState({ editingAppointmentDate: selectedDate });
    }

    reload = () => {
        this.hideEditingAppointment()
        this.props.reload()
    }

    handleCancelAppointment = async () => {
        const data = {
            ...this.state.editingAppointment,
            canceledAt: new Date(),
            canceledBy: this.state.sessao.usuario.id,
            isCanceled: true,
        }
        try {
            await updateAppointment(data)
            this.reload()
        } catch (error) {
            console.error("Erro ao realizar agendamento:", error.message)
        }
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
                                                            showEditingAppointmentModal={() => this.showEditingAppointmentModal(agendamento)}
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
                    <Dialog onClose={this.hideEditingAppointment} fullWidth={false} maxWidth={false} open={this.state.editingAppointmentModalOpen}>
                        {
                            this.state.editingAppointmentModalOpen && (
                                <div className="container d-flex flex-column align-items-center">
                                    <h5 className="text-center mt-3">Editando Agendamento</h5>
                                    <Appointment isEditingAppointment={true} reload={this.reload} appoitmentData={this.state.appoitmentData} hideEditingAppointment={this.hideEditingAppointment}/>
                                        <button className="btn btn-danger mb-3" onClick={this.handleCancelAppointment}>
                                            Cancelar Agendamento
                                        </button>
                                </div>
                            )
                        }
                    </Dialog>
            </div>
        );
    }
}

export { History }