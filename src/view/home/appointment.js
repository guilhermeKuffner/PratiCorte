import react from 'react';
import { getEstabelecimento, getSessao } from '../../config/auth';
import { isEmpty, PhoneNumberFormat, completeAvailableHours, dateToString, PriceFormat, PhoneNumberInput, removeSimbols, setAvailableHours } from '../../shared/utils';
import { getActiveUsersAppointmentAllowed } from '../../store/collections/userWorker';
import { getDay } from "date-fns";
import { addAppointment, getAppointmentByProviderAndDate } from '../../store/collections/appointmentWorker';

class Appointment extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessao: getSessao(),
            appointmentTitle: '',
            appoitmentSubTitle:'',
            appointmentsStep: 1,
            establishment: getEstabelecimento(),
            availableHours: [],
            providers: [],
            appointments: [],
            selectedProvider: null,
            selectedDay: null,
            selectedHour: null,
            selectedService: null,
            appointmentCliente: '',
            appointmentCelular: '',
        }
    }

    componentDidMount() {
        this.load()
    }

    load = async () => {
        const providers = await getActiveUsersAppointmentAllowed(this.state.establishment.id)
        const horarios = this.state.sessao.horarios
        const completedAvailableHours = completeAvailableHours(horarios)
        this.setState({ 
            providers: providers,
            appointmentTitle: 'Realize um agendamento',
            horarios: completedAvailableHours,
        })
    }

    handleSelectedProvider = (provider) => {
        this.setState({ selectedProvider: provider })
        this.handleNextStep()
    }

    handleSelectedDay = async (day) => {
        console.log(day)
        this.setState({ selectedDay: day, isloading: true });
        try {
            await this.setAvailableHours(day)
            this.handleNextStep()
        } catch (error) {
            alert("Erro ao buscar horários disponíveis:", error)
        } finally {
            this.setState({ isloading: false })
        }
    }

    setAvailableHours = async (day) => {
        const availableHours = await setAvailableHours(this.state.selectedProvider.id, day);
        this.setState({ availableHours: availableHours })
    }

    handleSelectedHour = (hour) => {
        this.setState({ 
            selectedHour: hour,
            isloading: true
         }, () => {
            this.handleNextStep()
        })
    }

    handleServiceSelected = (service) => {
        this.setState({ 
            selectedService: service,
            isloading: true
        }, () => {
            this.handleNextStep()
        })
    }

    handleNextStep = () => {
        if (this.state.appointmentsStep <= 5) {
            this.setState({ appointmentsStep: this.state.appointmentsStep + 1 }, () => {
            this.handleStepTitle()
            })
        }
    }

    handleLastStep = () => {
        if (this.state.appointmentsStep > 1) {
            this.setState({ appointmentsStep: this.state.appointmentsStep - 1 }, () => {
            this.handleStepTitle()
            })
        }
    }

    handleStepTitle = () => {
        if (this.state.appointmentsStep === 1) {
            this.setState({ 
                appointmentTitle: 'Realize um agendamento',
                appoitmentSubTitle: '',
                selectedProvider: null
            })
        }
        if (this.state.appointmentsStep === 2) {
            this.setState({ 
                appointmentTitle: 'Selecione uma data', 
                appoitmentSubTitle: '',
                selectedDay: null 
            })
        }
        if (this.state.appointmentsStep === 3) {
            this.setState({ 
                appointmentTitle: 'Selecione um horário',
                appoitmentSubTitle: this.state.selectedDay.dia,
                selectedHour: null 
            })
        }
        if (this.state.appointmentsStep === 4) {
            this.setState({ 
                appointmentTitle: 'Selecione um serviço',
                appoitmentSubTitle: `${this.state.selectedDay.dia} - ${this.state.selectedHour}`,
                selectedService: null

            })
        }
        if (this.state.appointmentsStep === 5) {
            this.setState({
                appointmentTitle: 'Resumo do Agendamento',
                appoitmentSubTitle: ''
            })
        }
        this.setState({ isloading: false })
    }

     finishAppointment = async () => {
        const data = {
            provider: this.state.selectedProvider,
            dateInfo: {
                date: this.state.selectedDay.date,
                hour: this.state.selectedHour,
                indexDayOfWeek:this.state.selectedDay.dayOfWeek,
                titleDayOfWeek: this.state.selectedDay.dia,
            },
            service: this.state.selectedService,
            establishment: this.state.establishment,
            establishmentId: this.state.establishment.id,
            cliente: {
                nome: this.state.appointmentCliente ?? "",
                celular: removeSimbols(this.state.appointmentCelular) ?? "",
                observacao: this.state.appointmentObservation ?? ""
            },
        }
        if (this.verifyFields(data) && this.verifyAppointmentStillAvailable) {
            try {
                await addAppointment(data)
                alert("Agendamento feito com sucesso!")
                this.cleanFields()
            } catch (error) {
                console.error("Erro ao realizar agendamento:", error.message)
            }
            this.props.onAddAppointment(data)
        }
        this.setState({ appointmentsStep: 1, selectedProvider: null }, () => {
            this.handleStepTitle()
        })
        console.log("Agendamento finalizado com sucesso!")
    }

    verifyAppointmentStillAvailable = () => {

    }

    verifyFields = (data) => {
        return true
    }

    cleanFields = () => {
        return
    }

    render() {
        return (
            <div className={`d-flex justify-content-center py-5 ${this.state.providers.length > 0 ? 'd-block' : 'd-none'}`}>
                <div className="card p-4 shadow bg-white rounded w-auto">
                    <h5 className="mb-3 text-center">{this.state.appointmentTitle}</h5>
                    <h6 className="mb-3 text-center">{this.state.appoitmentSubTitle}</h6>
                    <div className="d-flex flex-column gap-2" >
                        {
                            this.state.isloading && (
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            this.state.appointmentsStep === 1 && !this.state.isloading && this.state.providers.map((provider, index) => {
                                //Realize um agendamento
                                return (
                                    <button key={index} className="btn btn-outline-primary text-start" onClick={() => this.handleSelectedProvider(provider)}>
                                        <h6 className="mb-1">{provider?.nome}</h6>
                                        <div> Celular: {!isEmpty(provider?.celular) ? (<PhoneNumberFormat value={provider?.celular} />) : ("Não informado")}</div>
                                    </button>
                                )
                            })
                        }
                        {
                            this.state.appointmentsStep === 2 && !this.state.isloading && this.state.horarios.map((day, index) => {
                                //Selecione uma data
                                if (day.isDayAllowed === false) {
                                    return (
                                        <button key={index} className="btn btn-outline-secondary text-start" disabled>
                                            <h6 className="mb-1">{day.dia} - {dateToString(day.date)}</h6>
                                        </button>
                                    )
                                }
                                return (
                                    <button key={index} className="btn btn-outline-primary text-start" onClick={() => this.handleSelectedDay(day)}>
                                        <h6 className="mb-1">{day.dia} - {dateToString(day.date)}</h6>
                                    </button>
                                )
                            })
                        }
                        {
                            this.state.appointmentsStep === 3 && !this.state.isloading && (this.state.availableHours?.length > 0 ? (
                                //Selecione um horário
                                this.state.availableHours.map((hour, index) => {
                                    if (!hour.available) {
                                        return (
                                            <button key={index} className="btn btn-outline-secondary text-start" disabled>
                                                <h6 className="mb-1">{hour.hour}</h6>
                                            </button>
                                        )
                                    }
                                    return (
                                        <button key={index} className="btn btn-outline-primary text-start" onClick={() => this.handleSelectedHour(hour.hour)}>
                                            <h6 className="mb-1">{hour.hour}</h6>
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="alert alert-warning" role="alert">
                                    "Nenhum horário configurado para este dia da semana."
                                </div>
                            ))
                        }
                        {
                            this.state.appointmentsStep === 4 && !this.state.isloading && (!isEmpty(this.state.selectedProvider?.services) ? (
                                //Selecione um serviço
                                this.state.selectedProvider.services.map((service, index) => {
                                    return (
                                        <button key={index} className="btn btn-outline-primary text-start" onClick={() => this.handleServiceSelected(service)}>
                                            <h6 className="mb-1">{service.nome} - <PriceFormat value={service.preco}/></h6>
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="alert alert-warning" role="alert">
                                    {this.state.selectedProvider ? "Nenhum serviço disponível para este prestador." : "Selecione um prestador primeiro."}
                                </div>
                            ))
                        }
                        {
                            this.state.appointmentsStep === 5 && !this.state.isloading &&
                            //Resumo do Agendamento
                            <>
                                <div className="card p-3">
                                    <p><strong>Prestador:</strong> {this.state.selectedProvider?.nome}</p>
                                    <p><strong>Data:</strong> {this.state.selectedDay ? `${this.state.selectedDay.dia} - ${dateToString(this.state.selectedDay.date)}` : "Não selecionada"}</p>
                                    <p><strong>Horário:</strong> {this.state.selectedHour || "Não selecionado"}</p>
                                    <p><strong>Serviço:</strong> {this.state.selectedService?.nome || "Não selecionado"} - <PriceFormat value={this.state.selectedService?.preco}/></p>
                                </div>
                                <div className="card p-3">
                                    <label>Cliente Nome</label>
                                    <input type="text" name="nome" id="nome" placeholder="Nome do cliente" className={`form-control`}
                                        value={this.state.appointmentCliente} onChange={(e) => this.setState({ appointmentCliente: e.target.value })} />
                                    <label className="form-label" htmlFor="celular">Cliente Celular</label>
                                        <PhoneNumberInput value={this.state.appointmentCelular} onChange={(e) => this.setState({ appointmentCelular: e.target.value })} />
                                    <label className="form-label" htmlFor="celular">Observação</label>
                                    <textarea name="observação" id="observação" placeholder="Observação" className={`form-control`}
                                        value={this.state.appointmentObservation} onChange={(e) => this.setState({ appointmentObservation: e.target.value })} />
                                </div>
                                <button className="btn btn-success" onClick={() => this.finishAppointment()}>
                                    <h6 className="mb-1">Finalizar</h6>
                                </button>
                            </>
                        }
                    </div>
                    {
                        this.state.appointmentsStep !== 1 &&
                        <div className="d-flex justify-content-start mt-3">
                            <button className="btn btn-primary w-auto" onClick={this.handleLastStep}>
                                Voltar
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export { Appointment };