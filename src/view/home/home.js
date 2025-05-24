import React from "react";
import { handleLogout } from "../../config/auth";
import { auth } from '../../config/firebase';
import { getSessao } from "../../config/auth";
import { NavBar } from "../../components/navbar";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DateInput } from "../../components/DatePicker";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.currentUser,
            establishment: null,
            isLoading: true,
            sessao: getSessao(),
            appointmentModalOpen: false,
            selectedDate: null,
        }
    }

    async componentDidMount() {
        try {
            const establishment = this.state.sessao.estabelecimento
            this.setState({ establishment: establishment, isLoading: false });
        } catch (error) {
            handleLogout()
            console.error("Erro ao obter o estabelecimento", error);
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
                                value={this.state.selectedDate}
                                onChange={(newDate) => this.setState({ selectedDate: newDate })}
                            />
                        </DialogContent>
                    }
                </Dialog>
            </>
        );
    }
}

export { Home };
