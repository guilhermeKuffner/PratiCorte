import React from "react";
import { updateAppointment } from "../../store/collections/appointmentWorker";
import { getEstabelecimento, getSessao } from '../../config/auth';
import { AppointmentCard } from "../../components/AppointmentCard";
import Dialog from '@mui/material/Dialog';
import { completeAvailableHours } from '../../services/appointment/appointmentService'
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
                <div className="modern-card p-4 animate-slide-in-right" style={{maxWidth: '500px', width: '100%'}}>
                    <div className="text-center mb-4">
                        <h4 className="fw-bold text-dark mb-2">
                            <i className="fas fa-calendar-alt me-2 text-primary"></i>
                            Próximos Agendamentos
                        </h4>
                        <p className="text-muted">Visualize e gerencie seus agendamentos</p>
                    </div>
                    {
                        this.state.appointments.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="mb-4">
                                    <div className="empty-state-icon">
                                        <i className="fas fa-calendar-times text-primary mb-3" style={{fontSize: '4rem'}}></i>
                                    </div>
                                </div>
                                <h5 className="fw-bold text-dark mb-2">Nenhum agendamento encontrado</h5>
                                <p className="text-muted mb-4">nos próximos 7 dias.</p>
                                <div className="empty-state-actions">
                                    <button className="btn btn-modern-secondary btn-sm">
                                        <i className="fas fa-plus me-2"></i>
                                        Criar Primeiro Agendamento
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {
                                    this.state.providers.length > 0 && (
                                        <div className="mb-4">
                                            <div className="filter-section">
                                                <h6 className="fw-semibold text-dark mb-3">
                                                    <i className="fas fa-filter me-2 text-primary"></i>
                                                    Filtrar por Profissional
                                                </h6>
                                                <div className="filter-buttons">
                                                    <button className="btn btn-modern-secondary btn-sm filter-btn" onClick={this.selectProvider()}>
                                                        <i className="fas fa-users me-2"></i>
                                                        Todos
                                                    </button>
                                                    {
                                                        this.state.providers.map((provider, index) => (
                                                            <button key={index} className="btn btn-modern-secondary btn-sm filter-btn" onClick={this.selectProvider(provider)}>
                                                                <i className="fas fa-user-tie me-2"></i>
                                                                {provider.nome}
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="appointments-list">
                                    {
                                        this.state.appointments.map((appointment, index) => (
                                            <div key={index} className="day-section mb-4">
                                                <div className="day-header">
                                                    <div className="d-flex align-items-center">
                                                        <div className="day-icon">
                                                            <i className="fas fa-calendar-day text-primary"></i>
                                                        </div>
                                                        <div className="day-info">
                                                            <h5 className="fw-bold text-dark mb-0">
                                                                {appointment.day}
                                                            </h5>
                                                            {this.verifyIfToday(appointment.indexDayOfWeek) && (
                                                                <span className="badge bg-primary ms-2 today-badge">
                                                                    <i className="fas fa-star me-1"></i>
                                                                    Hoje
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="appointment-count">
                                                        <span className="badge bg-light text-dark">
                                                            {this.state.appointments[index].agendamentos.length} agendamento(s)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="appointments-grid">
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
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                        )
                    }
                </div>
                <Dialog onClose={this.hideEditingAppointment} fullWidth={false} maxWidth={false} open={this.state.editingAppointmentModalOpen}>
                    {
                        this.state.editingAppointmentModalOpen && (
                            <div className="container d-flex flex-column align-items-center p-4">
                                <div className="text-center mb-4">
                                    <h4 className="fw-bold text-dark mb-2">
                                        <i className="fas fa-edit me-2 text-primary"></i>
                                        Editando Agendamento
                                    </h4>
                                    <p className="text-muted">Modifique os dados do agendamento</p>
                                </div>
                                <Appointment isEditingAppointment={true} reload={this.reload} appoitmentData={this.state.appoitmentData} hideEditingAppointment={this.hideEditingAppointment}/>
                                <button className="btn btn-danger mt-3" onClick={this.handleCancelAppointment}>
                                    <i className="fas fa-times me-2"></i>
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