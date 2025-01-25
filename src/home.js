import React from 'react';
const initialState = {
    projeto: 'PratiCorte',
    data: '24/01/2025'
}
class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    render() {
        return (
            <>
                <div>
                    <div>
                        <img src='' alt='' />
                        <span>Gestão rapida e fácil da sua barbearia.</span>
                    </div>
                    <form>
                        <div>
                            <label htmlFor='email'>E-mail</label>
                            <input type='text' name='email' id='email' placeholder='exemplo@gmail.com'
                            />
                        </div>
                        <div>
                            <label htmlFor='password'>Senha</label>
                            <input type='password' name='password' id='password' placeholder='***********'
                            />
                        </div>
                    </form>
                    <a href=''>Esqueceu sua senha?</a>
                    <button>Fazer Login</button>
                    <div>
                        <span>Ainda não é cliente?</span>
                        <a href=''>Crie sua conta!</a>
                    </div>
                </div>
            </>
        )
    }
}

export { Home }