import React from "react";
import { handleLogout } from "../../config/auth";
import { getSessao } from "../../config/auth";
import { NavBar } from "../../components/navbar";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DateInput } from "../../components/DatePicker";
import { getDay } from "date-fns";
import { setDaysAllowed } from "../../shared/utils";

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
    
            this.setState({ 
                establishment: sessao.estabelecimento, 
                horarios: horarios,
                user: sessao.usuario,
                daysAllowed: daysAllowed,
                isDayAllowed: isDayAllowed,
                isLoading: false 
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
        })
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
                                                <div key={index}>
                                                    <h3>{hour.dia}</h3>
                                                    <p>{hour.horarioInicio} as {hour.horarioFim}</p>
                                                </div>
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
