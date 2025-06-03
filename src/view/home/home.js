import React from "react";
import { handleLogout } from "../../config/auth";
import { getSessao } from "../../config/auth";
import { NavBar } from "../../components/navbar";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DateInput } from "../../components/DatePicker";
import { getDay } from "date-fns";
import { setDaysAllowed, getAvailableHours } from "../../shared/utils";
import { getAppointment, addAppointment, updateAppointment } from "../../store/collections/appointmentWorker";
import { data } from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessao: getSessao(),
            user: null,
            establishment: null,
            horarios: [],
            isLoading: true,
            appointmentModalOpen: false,
            selectedDate: new Date(),
            availableHours: [],
            dayOfWeek: getDay(new Date()),
            daysAllowed: [],
            isDayAllowed: false,
        }
    }

    async componentDidMount() {
        try {
            const sessao = getSessao()
            const horarios = this.state.sessao.horarios
            const daysAllowed = setDaysAllowed(horarios)
            const isDayAllowed = daysAllowed.includes(this.state.dayOfWeek)
            const availableHours = getAvailableHours(this.state.selectedDate, horarios)
    
            this.setState({ 
                establishment: sessao.estabelecimento, 
                horarios: horarios,
                user: sessao.usuario,
                daysAllowed: daysAllowed,
                isDayAllowed: isDayAllowed,
                isLoading: false,
                availableHours: availableHours
            })
        } catch (error) {
            handleLogout()
            console.error("Erro nas atribuições de sessão:", error.message)
            this.setState({ isLoading: false });
        }
    }

    showAppointmentModal = () =>{
        this.setState({
            appointmentModalOpen: true,
        })
    }

    hideAppointmentModal = () =>{
        this.setState({
            appointmentModalOpen: false,
        })
    }

    handleDateChange = (date) => {
        console.log(date)
        this.setState({
            selectedDate: date,
            dayOfWeek: date.getDay(),
            isDayAllowed: this.state.daysAllowed.includes(date.getDay()),
            availableHours: getAvailableHours(this.state.selectedDate, this.state.horarios)
        })
    }

    async handleAppointment (bloco) {
        const [hora, minuto] = bloco.split(':').map(Number);
        const dia = new Date(this.state.selectedDate);
        dia.setHours(hora, minuto, 0, 0)

        const data = {
            horario: bloco,
            usuario: this.state.user,
            data: dia,
        }
        try {

                await addAppointment(data)

            alert("Agendamento salvo com sucesso!")
        } catch (error) {
            console.error("Erro ao cadastrar agendamento:", error.message)
        }
    }

    render() {
        const { user, establishment, isLoading } = this.state;
        if (isLoading) {
            return <div></div>;
        }

        return (
            <>
                <NavBar />
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <div className="card p-4 shadow-lg bg-white rounded">
                        <button className="btn btn-success" onClick={() => this.showAppointmentModal()}>Agendar</button>
                    </div>
                </div>
                <Dialog onClose={this.hideAppointmentModal} fullWidth maxWidth={"xs"} open={this.state.appointmentModalOpen}>
                    {
                        this.state.appointmentModalOpen &&
                        <DialogContent>
                            <h2>Agendar serviço</h2>
                            <DateInput
                                days={this.state.daysAllowed}
                                value={this.state.selectedDate}
                                onChange={this.handleDateChange}
                            />
                            <div>
                                {
                                    this.state.dayOfWeek && this.state.isDayAllowed ?
                                    this.state.horarios.horarios.map((hour, index) => {
                                        if (hour.day === this.state.dayOfWeek) {
                                            return (
                                                <>
                                                    <div key={index}>
                                                        <h3>{hour.dia}</h3>
                                                        <p>Atendimento das {hour.horarioInicio} as {hour.horarioFim}</p>
                                                    </div>
                                                    <div className="row">
                                                        {
                                                            this.state.availableHours.map((bloco, index) => (
                                                            <div key={index} className="col-6 col-md-4 mb-3 d-flex justify-content-center">
                                                                <button className="btn btn-primary w-100" onClick={() => this.handleAppointment(bloco)}>
                                                                    {bloco}
                                                                </button>
                                                            </div>
                                                            ))
                                                        }
                                                    </div>
                                                </>
                                            )
                                        } 
                                    }) : 
                                    <div> 
                                        <h3>{this.state.horarios.horarios[this.state.dayOfWeek].dia}</h3>
                                        <p>Não realizamos atendimento nesse dia da semana, por favor selecione outra data.</p>
                                    </div>
                                }
                            </div>
                        </DialogContent>
                    }
                </Dialog>
            </>
        );
    }
}

export { Home };
