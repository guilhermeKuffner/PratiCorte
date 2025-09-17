import react from 'react';
import { getEstabelecimento, getSessao } from '../../config/auth';
import { isEmpty, PhoneNumberFormat, dateToString, PriceFormat, PhoneNumberInput, removeSimbols, hoursArrayToString } from '../../shared/utils';
import { setAvailableHours } from '../../services/appointment/appointmentService';
import { addAppointment, updateAppointment } from '../../store/collections/appointmentWorker';
import { hourStillAvailable, verifyServiceTimeInBlocks } from '../../services/appointment/appointmentService';

class Appointment extends react.Component {
    constructor(props) {
        super(props);
        console.log(props.appoitmentData)
        this.state = {
            sessao: getSessao(),
            editingAppointment: props.appoitmentData?.appointment || null,
            providers: props.appoitmentData?.providers || [],
            horarios: props.appoitmentData?.horarios || [],
            appointmentTitle: 'Realize um agendamento',
            appoitmentSubTitle:'',
            appointmentsStep: props.appoitmentData?.mininumStep || 1,
            mininumStep: props.appoitmentData?.mininumStep || 1,
            establishment: getEstabelecimento(),
            availableHours: [],
            appointments: [],
            selectedProvider:  props.appoitmentData?.providers[0] || null,
            selectedDay: null,
            selectedHour: [],
            originalHourSelected: props.appoitmentData?.originalHourSelected || [],
            selectedService: null,
            appointmentCliente:  props.appoitmentData?.appointment?.cliente?.nome || "",
            appointmentCelular: props.appoitmentData?.appointment?.cliente?.celular || "",
            appointmentObservation: props.appoitmentData?.appointment?.cliente?.observacao || ""
        }
    }

    componentDidMount() {
        this.setState({ 
            providers: this.props.appoitmentData.providers,
            appointmentTitle: this.props.appoitmentData.appointmentTitle,
            horarios: this.props.appoitmentData.horarios
        })
    }

    handleSelectedProvider = (provider) => {
        this.setState({ selectedProvider: provider })
        this.handleNextStep()
    }

    handleSelectedDay = async (day) => {
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
        const availableHours = await setAvailableHours(this.state.selectedProvider.id, day, this.state.originalHourSelected)
        this.setState({ availableHours: availableHours })
    }

    handleSelectedHour = async (hour) => {
        this.setState({ isloading: true })
        const availableHours = await setAvailableHours(this.state.selectedProvider.id, this.state.selectedDay, this.state.originalHourSelected)
        if (!await hourStillAvailable(availableHours, [hour])) {
            this.setAvailableHours(this.state.selectedDay)
            this.setState({ isloading: false })
            return alert("Horário não está mais disponível, selecione outro horário.");
        }
        this.setState({ 
            selectedHour: [hour],
            isloading: true
         }, () => {
            this.handleNextStep()
        })
    }

    handleServiceSelected = async (service) => {
        var blocks = verifyServiceTimeInBlocks(service)
        if (blocks > 1) {
            this.setState({ isloading: true })
            var availableHours = await setAvailableHours(this.state.selectedProvider.id, this.state.selectedDay, this.state.originalHourSelected);
            var startCheck = availableHours.findIndex(item => item.hour === this.state.selectedHour?.[0])
            var endCheck = startCheck + blocks
            var newSelectedHours = []
            for (var i = startCheck; i < endCheck; i++){
                if (availableHours[i]?.available !== true && !availableHours[i]?.isEditing) {
                    alert(`Esse serviço leva ${blocks} horarios e o horario das ${availableHours[i]?.hour} está indisponivel`)
                    this.setState({ isloading: false })
                    return
                } else {
                    newSelectedHours.push(availableHours[i].hour)
                }
            }
            this.setState({ selectedHour: newSelectedHours })
        }
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
                selectedDay: this.state.selectedDay
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
        this.setState({ isloading: true });
        const availableHours = await setAvailableHours(this.state.selectedProvider.id, this.state.selectedDay, this.state.originalHourSelected)
        if (!await hourStillAvailable(availableHours, this.state.selectedHour)) {
            this.setState({ isloading: false })
            return alert("Horário não está mais disponível, selecione outro horário.");
        }
        if (this.verifyFields(data) && this.verifyAppointmentStillAvailable) {
            try {
                await addAppointment(data)
                alert("Agendamento feito com sucesso!")
                this.cleanFields()
            } catch (error) {
                console.error("Erro ao realizar agendamento:", error.message)
            }
            this.props.reload(data)
        }
        this.setState({ appointmentsStep: 1, selectedProvider: null }, () => {
            this.handleStepTitle()
        })
        console.log("Agendamento finalizado com sucesso!")
    }

    updateAppointment = async () => {
        console.log("Atualizar Agendamento")
        console.log(this.state.editingAppointment)
        const data = {
            id: this.state.editingAppointment.id,
            oldAppointment: this.state.editingAppointment,
            dateInfo: {
                date: this.state.selectedDay.date,
                hour: this.state.selectedHour,
                indexDayOfWeek:this.state.selectedDay.dayOfWeek,
                titleDayOfWeek: this.state.selectedDay.dia,
                selectedDay: this.state.selectedDay
            },
            service: this.state.selectedService,
            cliente: {
                nome: this.state.appointmentCliente ?? "",
                celular: removeSimbols(this.state.appointmentCelular) ?? "",
                observacao: this.state.appointmentObservation ?? ""
            },
        }
        this.setState({ isloading: true });
        const availableHours = await setAvailableHours(this.state.selectedProvider.id, this.state.selectedDay, this.state.originalHourSelected)
        if (!await hourStillAvailable(availableHours, this.state.selectedHour)) {
            this.setState({ isloading: false })
            return alert("Horário não está mais disponível, selecione outro horário.");
        }
        if (this.verifyFields(data) && this.verifyAppointmentStillAvailable) {
            try {
                await updateAppointment(data)
                alert("Agendamento atualizado com sucesso!")
                this.cleanFields()
            } catch (error) {
                console.error("Erro ao atualizar agendamento:", error.message)
            }
            this.props.hideEditingAppointment()
            this.props.reload(data)
        }
        console.log("Agendamento atualizado com sucesso!")
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
            <div className={`appointment-container ${this.state.providers.length > 0 ? 'd-block' : 'd-none'}`}>
                <div className="modern-card p-5 animate-fade-in-up">
                    <div className="text-center mb-4">
                        <h4 className="fw-bold text-dark mb-2">{this.state.appointmentTitle}</h4>
                        {this.state.appoitmentSubTitle && (
                            <p className="text-muted mb-0">{this.state.appoitmentSubTitle}</p>
                        )}
                    </div>
                    <div className="d-flex flex-column gap-3" >
                        {
                            this.state.isloading && (
                                <div className="d-flex justify-content-center py-4">
                                    <div className="spinner-modern" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            this.state.appointmentsStep === 1 && !this.state.isloading && this.state.providers.map((provider, index) => {
                                //Realize um agendamento
                                return (
                                    <button key={index} className="btn btn-modern-secondary text-start p-3" onClick={() => this.handleSelectedProvider(provider)}>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-user-tie me-3 text-primary" style={{fontSize: '1.5rem'}}></i>
                                            <div>
                                                <h6 className="mb-1 fw-bold">{provider?.nome}</h6>
                                                <small className="text-muted">
                                                    <i className="fas fa-phone me-1"></i>
                                                    {!isEmpty(provider?.celular) ? (<PhoneNumberFormat value={provider?.celular} />) : ("Não informado")}
                                                </small>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })
                        }
                        {
                            this.state.appointmentsStep === 2 && !this.state.isloading && this.state.horarios.map((day, index) => {
                                //Selecione uma data
                                if (day.isDayAllowed === false) {
                                    return (
                                        <button key={index} className="btn btn-outline-secondary text-start p-3" disabled>
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-calendar-times me-3 text-muted" style={{fontSize: '1.5rem'}}></i>
                                                <div>
                                                    <h6 className="mb-1 fw-bold text-muted">{day.dia}</h6>
                                                    <small className="text-muted">{dateToString(day.date)}</small>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                }
                                return (
                                    <button key={index} className="btn btn-modern-secondary text-start p-3" onClick={() => this.handleSelectedDay(day)}>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-calendar-check me-3 text-primary" style={{fontSize: '1.5rem'}}></i>
                                            <div>
                                                <h6 className="mb-1 fw-bold">{day.dia}</h6>
                                                <small className="text-muted">{dateToString(day.date)}</small>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })
                        }
                        {
                            this.state.appointmentsStep === 3 && !this.state.isloading && (this.state.availableHours?.length > 0 ? (
                                //Selecione um horário
                                this.state.availableHours.map((hour, index) => {
                                    if (!hour.available && !hour.isEditing) {
                                        return (
                                            <button key={index} className="btn btn-outline-secondary text-start p-3" disabled>
                                                <div className="d-flex align-items-center">
                                                    <i className="fas fa-clock me-3 text-muted" style={{fontSize: '1.5rem'}}></i>
                                                    <h6 className="mb-0 fw-bold text-muted">{hour.hour}</h6>
                                                </div>
                                            </button>
                                        )
                                    } if (hour.isEditing) {
                                        return (
                                            <button key={index} className="btn btn-warning text-start p-3" onClick={() => this.handleSelectedHour(hour.hour)}>
                                                <div className="d-flex align-items-center">
                                                    <i className="fas fa-edit me-3 text-white" style={{fontSize: '1.5rem'}}></i>
                                                    <h6 className="mb-0 fw-bold text-white">{hour.hour}</h6>
                                                </div>
                                            </button>
                                        )
                                    } else{
                                        return (
                                            <button key={index} className="btn btn-modern-secondary text-start p-3" onClick={() => this.handleSelectedHour(hour.hour)}>
                                                <div className="d-flex align-items-center">
                                                    <i className="fas fa-clock me-3 text-primary" style={{fontSize: '1.5rem'}}></i>
                                                    <h6 className="mb-0 fw-bold">{hour.hour}</h6>
                                                </div>
                                            </button>
                                        ) 
                                    }
                                })
                            ) : (
                                <div className="alert alert-warning d-flex align-items-center" role="alert">
                                    <i className="fas fa-exclamation-triangle me-3"></i>
                                    <div>
                                        <strong>Nenhum horário configurado</strong><br/>
                                        <small>para este dia da semana.</small>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            this.state.appointmentsStep === 4 && !this.state.isloading && (!isEmpty(this.state.selectedProvider?.services) ? (
                                //Selecione um serviço
                                this.state.selectedProvider.services.map((service, index) => {
                                    return (
                                        <button key={index} className="btn btn-modern-secondary text-start p-3" onClick={() => this.handleServiceSelected(service)}>
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-scissors me-3 text-primary" style={{fontSize: '1.5rem'}}></i>
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1 fw-bold">{service.nome}</h6>
                                                    <div className="d-flex justify-content-between">
                                                        <small className="text-muted">
                                                            <i className="fas fa-clock me-1"></i>
                                                            Duração: {service.duracao}
                                                        </small>
                                                        <small className="fw-bold text-primary">
                                                            <PriceFormat value={service.preco}/>
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="alert alert-warning d-flex align-items-center" role="alert">
                                    <i className="fas fa-exclamation-triangle me-3"></i>
                                    <div>
                                        <strong>
                                            {this.state.selectedProvider ? "Nenhum serviço disponível" : "Selecione um prestador primeiro"}
                                        </strong><br/>
                                        <small>
                                            {this.state.selectedProvider ? "para este prestador." : "para continuar."}
                                        </small>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            this.state.appointmentsStep === 5 && !this.state.isloading &&
                            //Resumo do Agendamento
                            <>
                                <div className="modern-card p-4 mb-4">
                                    <h6 className="fw-bold text-primary mb-3">
                                        <i className="fas fa-clipboard-list me-2"></i>
                                        Resumo do Agendamento
                                    </h6>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-user-tie me-3 text-primary"></i>
                                                <div>
                                                    <small className="text-muted">Prestador</small>
                                                    <p className="mb-0 fw-semibold">{this.state.selectedProvider?.nome}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-calendar me-3 text-primary"></i>
                                                <div>
                                                    <small className="text-muted">Data</small>
                                                    <p className="mb-0 fw-semibold">{this.state.selectedDay ? `${this.state.selectedDay.dia} - ${dateToString(this.state.selectedDay.date)}` : "Não selecionada"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-clock me-3 text-primary"></i>
                                                <div>
                                                    <small className="text-muted">Horário</small>
                                                    <p className="mb-0 fw-semibold">{hoursArrayToString(this.state.selectedHour)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-scissors me-3 text-primary"></i>
                                                <div className="flex-grow-1">
                                                    <small className="text-muted">Serviço</small>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p className="mb-0 fw-semibold">{this.state.selectedService?.nome || "Não selecionado"}</p>
                                                        <span className="fw-bold text-primary">
                                                            <PriceFormat value={this.state.selectedService?.preco}/>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modern-card p-4 mb-4">
                                    <h6 className="fw-bold text-primary mb-3">
                                        <i className="fas fa-user me-2"></i>
                                        Dados do Cliente
                                    </h6>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark mb-2">Nome do Cliente</label>
                                        <input type="text" name="nome" id="nome" placeholder="Nome do cliente" className="form-control-modern"
                                        value={this.state.appointmentCliente} onChange={(e) => this.setState({ appointmentCliente: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark mb-2">Celular</label>
                                        <PhoneNumberInput value={this.state.appointmentCelular} onChange={(e) => this.setState({ appointmentCelular: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark mb-2">Observação</label>
                                        <textarea name="observação" id="observação" placeholder="Observação" className="form-control-modern"
                                        value={this.state.appointmentObservation} onChange={(e) => this.setState({ appointmentObservation: e.target.value })} />
                                    </div>
                                </div>
                                {
                                    this.state.mininumStep === 1 &&
                                    <button className="btn btn-modern w-100" onClick={() => this.finishAppointment()}>
                                        <i className="fas fa-check me-2"></i>
                                        Finalizar Agendamento
                                    </button>
                                }
                                {
                                    this.state.mininumStep === 2 &&
                                    <button className="btn btn-modern w-100" onClick={() => this.updateAppointment()}>
                                        <i className="fas fa-save me-2"></i>
                                        Atualizar Agendamento
                                    </button>
                                }
                            </>
                        }
                    </div>
                    {
                        this.state.appointmentsStep > this.state.mininumStep  &&
                        <div className="d-flex justify-content-start mt-4">
                            <button className="btn btn-modern-secondary" onClick={this.handleLastStep}>
                                <i className="fas fa-arrow-left me-2"></i>
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