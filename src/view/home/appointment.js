import react from 'react';
import { getEstabelecimento, getSessao } from '../../config/auth';
import { isEmpty, PhoneNumberFormat, completeAvailableHours, dateToString, getNext7Days } from '../../shared/utils';
import { getActiveUsersAppointmentAllowed } from '../../store/collections/userWorker';
import { getDay } from "date-fns";

class Appointment extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessao: getSessao(),
            appointmentTitle: '',
            appointmentsStep: 1,
            selectedProvider: null,
            establishment: getEstabelecimento(),
            providers: [],
            appointments: [],
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
        console.log("teste")
        this.setState({ selectedProvider: provider })
        this.handleNextStep()
    }

    handleSelectedDay = (day) => {
        this.setState({ selectedDay: day })
        this.handleNextStep()
    }

    handleNextStep = () => {
        if (this.state.appointmentsStep <= 4) {
            this.setState({ appointmentsStep: this.state.appointmentsStep + 1 })
            this.handleStepTitle()
        }
    }

    handleLastStep = () => {
        if (this.state.appointmentsStep > 1) {
            this.setState({ appointmentsStep: this.state.appointmentsStep - 1 })
            this.handleStepTitle()
        }
    }

    handleStepTitle = () => {
        if (this.state.appointmentsStep === 1) {
            this.setState({ appointmentTitle: 'Selecione uma data' })
        }
        if (this.state.appointmentsStep === 2) {
            this.setState({ appointmentTitle: 'Selecione um horário' })
        }
        if (this.state.appointmentsStep === 3) {
            this.setState({ appointmentTitle: 'Selecione um serviço' })
        }
    }

    finishAppointment = () => {
        this.setState({ appointmentsStep: 1, selectedProvider: null })
        console.log("Agendamento finalizado com sucesso!")
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
                            this.state.appointmentsStep === 2 && 
                                <>
                                    {
                                        this.state.horarios.map((day, index) => {
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
                                </>
                        }
                        {
                            this.state.appointmentsStep === 3 && 
                                <>
                                    <button className="btn btn-outline-primary" onClick={this.handleNextStep}>
                                        <h6>ir para etapa 4</h6>
                                    </button>
                                </>
                        }
                        {
                            this.state.appointmentsStep === 4 && 
                                <>
                                    <button className="btn btn-outline-primary" onClick={this.finishAppointment}>
                                        <h6>finalizar agendamento</h6>
                                    </button>
                                </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export { Appointment };