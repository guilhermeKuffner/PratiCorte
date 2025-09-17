import React from "react";
import { getSessao, getEstabelecimento } from "../../config/auth";
import { NavBar } from "../../components/navbar";
import { getAppointmentsByDate } from "../../store/collections/appointmentWorker";
import { getActiveUsersAppointmentAllowed } from '../../store/collections/userWorker';
import { Appointment } from "./appointment";
import { History } from "./history";
import { groupAgendamentosByDayOfWeek, completeAvailableHours } from "../../services/appointment/appointmentService";


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: getEstabelecimento(),
            sessao: getSessao(),
            appointments: [],
        }
    }

    async componentDidMount() {
        this.load()
    }

    load = async () => {
        try {
            const today = new Date()
            const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
            const appointments = await getAppointmentsByDate(this.state.establishment.id, today, endDate)
            const groupedAppointments = groupAgendamentosByDayOfWeek(appointments)

            const providers = await getActiveUsersAppointmentAllowed(this.state.establishment.id)
            const horarios = this.state.sessao?.horarios
            
            // Verificação de segurança para horários
            if (!horarios) {
                console.warn('Horários não disponíveis na sessão:', this.state.sessao)
                this.setState({
                    appointments: groupedAppointments, 
                    appoitmentData: {
                        horarios: [],
                        providers: providers || [],
                        appointmentTitle: 'Realize um agendamento',
                    }
                })
                return
            }

            const completedAvailableHours = completeAvailableHours(horarios)
            
            const appoitmentData = {
                horarios: completedAvailableHours,
                providers: providers || [],
                appointmentTitle: 'Realize um agendamento',
            }
            this.setState({
                appointments: groupedAppointments, 
                appoitmentData: appoitmentData
            })
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            // Estado de fallback em caso de erro
            this.setState({
                appointments: [], 
                appoitmentData: {
                    horarios: [],
                    providers: [],
                    appointmentTitle: 'Realize um agendamento',
                }
            })
        }
    }

    render() {
        return (
            <>
                <NavBar />
                <div className="container-fluid px-4 py-4">
                    <div className="main-content-container">
                        <div className="row g-4" style={{maxWidth: '1000px', width: '100%'}}>
                            <div className="col-12 col-md-6 d-flex justify-content-center">
                                {
                                    this.state.appoitmentData && (
                                        <Appointment reload={this.load} appoitmentData={this.state.appoitmentData}/>)
                                }
                            </div>
                            <div className="col-12 col-md-6 d-flex justify-content-center">
                                <History appointments={this.state.appointments} reload={this.load} appoitmentData={this.state.appoitmentData}/>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export { Home };
