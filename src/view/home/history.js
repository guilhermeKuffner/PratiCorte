import React from "react";
import { updateAppointment } from "../../store/collections/appointmentWorker";
import { getEstabelecimento, getSessao } from '../../config/auth';
import { AppointmentCard } from "../../components/AppointmentCard";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { hoursArrayToString, dateToString } from "../../shared/utils";
import { completeAvailableHours, setAvailableHours } from '../../services/appointment/appointmentService'

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
        console.log(appointment)
        let availableHours = [appointment.dateInfo.hour[0]];
        console.log(availableHours)
        try {
            availableHours = await setAvailableHours(appointment.provider.id, appointment.dateInfo.date)
            
        } catch (error) {
            // alert("Erro ao buscar horários disponíveis:", error)
        }
        console.log(availableHours)
        this.setState({ 
            editingAppointmentModalOpen: true, 
            editingAppointment: { ...appointment },
            editingAppointmentDate: appointment.dateInfo.date,
            editingAvailableHours: availableHours,
            editingAppointmentService: appointment.service,
            editingAppointmentClientName: appointment.cliente.nome,
            editingAppointmentClientPhone: appointment.cliente.celular
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

    handleCancelAppointment = async () => {
        const data = {
            ...this.state.editingAppointment,
            canceledAt: new Date(),
            canceledBy: this.state.sessao.usuario.id,
            isCanceled: true,
        }
        try {
            await updateAppointment(data)
            this.props.load()
            this.hideEditingAppointment()
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
                    <Dialog onClose={this.hideEditingAppointment} fullWidth maxWidth={"xs"} open={this.state.editingAppointmentModalOpen}>
                        {
                            this.state.editingAppointmentModalOpen && (
                                <DialogContent>
                                    <div>
                                        <p>id: {this.state.editingAppointment.id}</p>
                                        <h5>Editando Agendamento</h5>
                                        <h6>Prestador: {this.state.editingAppointment.provider.nome}</h6>

                                        <label>Data do agendamento</label>
                                        <select name="editingDate" id="editingDate" className="form-control" onChange={this.handleEditDate}>
                                            {
                                                this.state.horarios.map((day, index) => {
                                                    if (day.isDayAllowed == true) {
                                                        return (
                                                            <option value={day}>{day.dia} - {dateToString(day.date)}</option>
                                                        )
                                                    }
                                                })
                                            }
                                        </select>

                                        <label>Horário do agendamento</label>
                                        <select name="editingDate" id="editingDate" className="form-control" onChange={(e) => this.setState({ editingAppointmentHour: e.target.value })}>
                                            {
                                                this.state.editingAvailableHours.map((hour, index) => {
                                                    if (!hour?.available) {
                                                        return (
                                                            <option value={hour?.hour}>{hour?.hour ?? hour}</option>
                                                        )
                                                    }
                                                })
                                            }
                                        </select>    

                                        <label>Serviço selecionado</label>
                                        <select name="editingDate" id="editingDate" className="form-control" onChange={(e) => this.setState({ editingAppointmentService: e.target.value })}>
                                            <option value="true">{this.state.editingAppointmentService.nome}</option>
                                        </select>

                                        <label>Cliente</label>
                                        <input type="text" name="nome" id="nome" placeholder="Nome do serviço" className={`form-control ${this.state.newUserNomeAlert}`}
                                            value={this.state.editingAppointmentClientName} onChange={(e) => this.setState({ editingAppointmentClientName: e.target.value })} />

                                        <label>Celular</label>
                                        <input type="text" name="nome" id="nome" placeholder="Nome do serviço" className={`form-control ${this.state.newUserNomeAlert}`}
                                            value={this.state.editingAppointmentClientPhone} onChange={(e) => this.setState({ editingAppointmentClientPhone: e.target.value })} />
                                    </div>
                                    <div className="d-flex justify-content-between gap-2 mt-3">
                                        <button className="btn btn-primary" onClick={this.handleEditAppointment}>Salvar</button>
                                        <button className="btn btn-danger" onClick={this.handleCancelAppointment}>CANCELAR</button>
                                        <button className="btn btn-secondary" onClick={this.hideEditingAppointment}>Fechar</button>
                                    </div>
                                </DialogContent>
                            )
                        }
                    </Dialog>
            </div>
        );
    }
}

export { History }