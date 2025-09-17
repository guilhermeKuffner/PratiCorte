import React from 'react';
import { secondsToDateString, hoursArrayToString } from "../shared/utils";
import { isPastDateTime } from "../services/appointment/appointmentService";
import { updateAppointment } from "../store/collections/appointmentWorker";
import { getSessao } from '../config/auth';

class AppointmentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointment: props.appointment,
            statusColor: this.handleStatusColor(props.appointment),
            status: this.handleStatus(props.appointment),
            sessao: getSessao(),
        }
    }

    handleStatus = (appointment) => {
        if (appointment.isCanceled === true) {
            return "Cancelado";
        }
        if (appointment.isFinished === true) {
            return "Finalizado";
        }
        if (isPastDateTime(appointment.dateInfo)) {
            return "Vencido";
        }
        return "Pendente";
    }

    handleStatusColor = (appointment) => {
        if (appointment.isCanceled === true) {
            return "text-bg-danger";
        }
        if (appointment.isFinished === true) {
            return "text-bg-success";
        }
        if (isPastDateTime(appointment.dateInfo)) {
            return "text-bg-secondary";
        }
        return "text-bg-primary";
    }

    handleFinalizeAppoitment = async () => {
        const data = {
            ...this.state.appointment,
            finishedBy: this.state.sessao.usuario.id,
            finishedAt: new Date(),
            isFinished: true,
        }
        try {
            await updateAppointment(data)
            this.setState({ status: "Finalizado", statusColor: "text-bg-success" })
        } catch (error) {
            console.error("Erro ao realizar agendamento:", error.message)
        }
    }

    handleEditAppointment = async () => {
        await this.props.showEditingAppointmentModal(this.state.appointment)
    }

    render() {
        const getStatusClass = () => {
            switch(this.state.status) {
                case "Pendente": return "status-pending";
                case "Finalizado": return "status-completed";
                case "Cancelado": return "status-cancelled";
                case "Vencido": return "status-expired";
                default: return "status-pending";
            }
        };

        return (
            <div className="appointment-card-modern mb-3 animate-fade-in-up">
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                                <span className={`status-badge ${getStatusClass()}`}>
                                    {this.state.status}
                                </span>
                            </div>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                                        <small className="text-muted">Data:</small>
                                    </div>
                                    <p className="mb-2 fw-semibold">{secondsToDateString(this.state.appointment.dateInfo?.date.seconds)}</p>
                                    
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fas fa-clock me-2 text-primary"></i>
                                        <small className="text-muted">Horário:</small>
                                    </div>
                                    <p className="mb-0 fw-semibold">{hoursArrayToString(this.state.appointment.dateInfo?.hour)}</p>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fas fa-user-tie me-2 text-primary"></i>
                                        <small className="text-muted">Prestador:</small>
                                    </div>
                                    <p className="mb-2 fw-semibold">{this.state.appointment.provider?.nome}</p>
                                    
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fas fa-scissors me-2 text-primary"></i>
                                        <small className="text-muted">Serviço:</small>
                                    </div>
                                    <p className="mb-0 fw-semibold">{this.state.appointment.service?.nome}</p>
                                </div>
                            </div>
                            <hr className="my-3" />
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fas fa-user me-2 text-primary"></i>
                                        <small className="text-muted">Cliente:</small>
                                    </div>
                                    <p className="mb-0 fw-semibold">{this.state.appointment.cliente?.nome}</p>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fas fa-phone me-2 text-primary"></i>
                                        <small className="text-muted">Celular:</small>
                                    </div>
                                    <p className="mb-0 fw-semibold">{this.state.appointment.cliente?.celular}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-2 ms-3">
                            {
                                this.state.status !== "Finalizado" && this.state.status !== "Cancelado" && 
                                <button className="btn btn-success btn-sm" onClick={this.handleFinalizeAppoitment} title="Finalizar">
                                    <i className="fas fa-check" />
                                </button>
                            }
                            {
                                this.state.status !== "Cancelado" && 
                                <button className="btn btn-primary btn-sm" onClick={this.handleEditAppointment} title="Editar">
                                    <i className="fas fa-edit" />
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export { AppointmentCard };