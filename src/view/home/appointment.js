import react from 'react';
import { getEstabelecimento, getSessao } from '../../config/auth';
import { isEmpty, PhoneNumberFormat, completeAvailableHours, dateToString, PriceFormat } from '../../shared/utils';
import { getActiveUsersAppointmentAllowed } from '../../store/collections/userWorker';
import { getDay } from "date-fns";
import { addAppointment, getAppointmentByProviderAndDate } from '../../store/collections/appointmentWorker';

class Appointment extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessao: getSessao(),
            appointmentTitle: '',
            appointmentsStep: 1,
            establishment: getEstabelecimento(),
            providers: [],
            appointments: [],
            selectedProvider: null,
            selectedDay: null,
            selectedHour: null,
            selectedService: null,
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
        this.setState({ selectedDay: day })
        var appointmentsByProviderAndDate = await getAppointmentByProviderAndDate(this.state.selectedProvider.id, day.date)
        console.log(appointmentsByProviderAndDate)
        //agora que pegamos todos os agendamentos dos dias, vamos bloquear os horários que já estão ocupados
        this.handleNextStep()
    }

    handleSelectedHour = (hour) => {
        this.setState({ selectedHour: hour })
        this.handleNextStep()
    }

    handleServiceSelected = (service) => {
        this.setState({ selectedService: service })
        this.handleNextStep()
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
            this.setState({ appointmentTitle: 'Realize um agendamento' })
            this.setState({ selectedProvider: null })
        }
        if (this.state.appointmentsStep === 2) {
            this.setState({ appointmentTitle: 'Selecione uma data' })
            this.setState({ selectedDay: null })
        }
        if (this.state.appointmentsStep === 3) {
            this.setState({ appointmentTitle: 'Selecione um horário' })
            this.setState({ selectedHour: null })
        }
        if (this.state.appointmentsStep === 4) {
            this.setState({ appointmentTitle: 'Selecione um serviço' })
            this.setState({ selectedService: null })
        }
        if (this.state.appointmentsStep === 5) {
            this.setState({ appointmentTitle: 'Confirme os dados' })
        }
    }

     finishAppointment = async () => {
        const data = {
            provider: this.state.selectedProvider,
            providerId: this.state.selectedProvider.id,
            appointmentDate: this.state.selectedDay.date,
            appointmentHour: this.state.selectedHour,
            appoitmentIndexDayOfWeek:this.state.selectedDay.dayOfWeek,
            appoitmentTitleDayOfWeek: this.state.selectedDay.dia,
            service: this.state.selectedService,
            serviceId: this.state.selectedService.id,
            establishment: this.state.establishment,
            establishmentId: this.state.establishment.id,
        }
        if (this.verifyFields(data)) {
            try {
                await addAppointment(data)
                alert("Agendamento feito com sucesso!")
                this.cleanFields()
            } catch (error) {
                console.error("Erro ao realizar agendamento:", error.message)
            }
        }
        this.setState({ appointmentsStep: 1, selectedProvider: null }, () => {
            this.handleStepTitle()
        })
        console.log("Agendamento finalizado com sucesso!")
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
                    <h5 className="mb-4">{this.state.appointmentTitle}</h5>
                    <div className="d-flex flex-column gap-2" >
                        {
                            this.state.appointmentsStep === 1 && this.state.providers.map((provider, index) => {
                                return (
                                    <button key={index} className="btn btn-outline-primary text-start" onClick={() => this.handleSelectedProvider(provider)}>
                                        <h6 className="mb-1">{provider?.nome}</h6>
                                        <div> Celular: {!isEmpty(provider?.celular) ? (<PhoneNumberFormat value={provider?.celular} />) : ("Não informado")}</div>
                                    </button>
                                )
                            })
                        }
                        {
                            this.state.appointmentsStep === 2 && this.state.horarios.map((day, index) => {
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
                            this.state.appointmentsStep === 3 && this.state.selectedDay.availableHours.map((hour, index) => {
                                return (
                                    <button key={index} className="btn btn-outline-primary text-start" onClick={() => this.handleSelectedHour(hour)}>
                                        <h6 className="mb-1">{hour}</h6>
                                    </button>
                                )
                            })
                        }
                        {
                            this.state.appointmentsStep === 4 && (!isEmpty(this.state.selectedProvider?.services) ? (
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
                            this.state.appointmentsStep === 5 && 
                            <button className="btn btn-success" onClick={this.finishAppointment}>
                                <h6 className="mb-1">Finalizar</h6>
                            </button>
                        }
                    </div>
                    {
                        this.state.appointmentsStep !== 1 &&
                        <button className="btn btn-primary mt-3 w-50" onClick={this.handleLastStep}>
                            Voltar
                        </button>
                    }
                </div>
            </div>
        )
    }
}

export { Appointment };