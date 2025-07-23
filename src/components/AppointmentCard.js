import React from 'react';
import { secondsToDateString, isPastDateTime } from "../shared/utils";

class AppointmentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointment: props.appointment,
            statusColor: this.handleStatusColor(props.appointment),
            status: this.handleStatus(props.appointment)
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


    render() {
        return (
            <div className={`card ${this.state.statusColor} mb-2`}>
                <div className="card-header">
                    <strong>Data:</strong> {secondsToDateString(this.state.appointment.dateInfo?.date.seconds)}<br />
                    <strong>Horário:</strong> {this.state.appointment.dateInfo?.hour}
                    </div>
                        <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="me-3">
                            <strong>Prestador:</strong> {this.state.appointment.provider?.nome}<br />
                            <strong>Serviço:</strong> {this.state.appointment.service?.nome}<br />
                            <strong>Cliente:</strong> {this.state.appointment.cliente?.nome}<br />
                            <strong>Telefone:</strong> {this.state.appointment.cliente?.telefone}<br />
                        </div>
                        <div className="d-flex flex-column gap-2">
                            {
                                this.state.status !== "Finalizado" && this.state.status !== "Cancelado" && 
                                <button className="btn btn-success border border-white" onClick={this.handleFinalize}>
                                    <i className="fas fa-check" />
                                </button>
                            }
                            {
                                this.state.status !== "Cancelado" && 
                                <button className="btn btn-danger border border-white" onClick={this.handleCancel}>
                                    <i className="fas fa-times" />
                                </button>
                            }
                        </div>
                    </div>
            </div>
        );
    }
}
export { AppointmentCard };