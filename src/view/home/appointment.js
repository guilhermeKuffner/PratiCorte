import react from 'react';
import { getEstabelecimento } from '../../config/auth';
import { getActiveUsersAppointmentAllowed } from '../../store/collections/userWorker';

class Appointment extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: getEstabelecimento(),
            users: [
                // Example user data
                { nome: "John Doe", status: "active", agendavel: true },
                { nome: "Jane Smith", status: "inactive", agendavel: false },
                { nome: "Alice Johnson", status: "active", agendavel: true },
            ],
            appointments: [],
        }
    }

    componentDidMount() {
        this.load()
    }

    load = async () => {
        console.log(this.state)
        const users = await getActiveUsersAppointmentAllowed(this.state.establishment.id)
        this.setState({ users: users })
    }

    render() {
        return (
            <>
                {
                    this.state.users.map((user, index) => {
                        return (
                            <div key={index}>
                                <h3>{user?.nome}</h3>
                                <p>Status: {user?.status}</p>
                                <p>Agendável: {user?.agendavel}</p>
                            </div>
                        )
                    })
                }
            </>
        )
    }
}

export { Appointment };