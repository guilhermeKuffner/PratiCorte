import React from 'react';
import { secondsToDateString, isPastDateTime } from "../shared/utils";

class AppointmentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointment: props.appointment,
            status: this.handleStatus(props.appointment)
        }
    }

    handleStatus = (appointment) => {
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
            <div className={`card ${this.state.status} mb-2`}>
                <div className="card-header">
                    <strong>Data:</strong> {secondsToDateString(this.state.appointment.dateInfo?.date.seconds)}<br />
                    <strong>Horário:</strong> {this.state.appointment.dateInfo?.hour}
                </div>
                <div className="card-body">
                    <strong>Prestador:</strong> {this.state.appointment.provider?.nome}<br />
                    <strong>Serviço:</strong> {this.state.appointment.service?.nome}<br />
                    <strong>Cliente:</strong> {this.state.appointment.cliente?.nome}<br />
                    <strong>Telefone:</strong> {this.state.appointment.cliente?.telefone}<br />
                </div>
            </div>
        );
    }
}
export { AppointmentCard };