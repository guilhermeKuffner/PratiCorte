import React from "react";
class Home extends React.Component {
    render() {
        return (
            <>
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <div className="card p-4 shadow-lg bg-white rounded">
                        <div>
                            <img src="" alt="" />
                            <span>Gestão rapida e fácil da sua barbearia.</span>
                        </div>
                        <form>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="email">E-mail</label>
                                <input className="form-control" type="text" name="email" id="email" placeholder="exemplo@gmail.com"/>
                            </div>
                            <div>
                                <label className="form-label" htmlFor="password">Senha</label>
                                <input className="form-control" type="password" name="password" id="password" placeholder="***********"
                                />
                            </div>
                        </form>
                        <a href="" className="d-block mb-3 text-decoration-none text-center">Esqueceu sua senha?</a>
                        <button className="btn btn-primary mb-3">Fazer Login</button>
                        <div className="text-center">
                            <span className="d-block mb-2">Ainda não é cliente?</span>
                            <a href="" className="btn btn-outline-secondary">Crie sua conta!</a>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export { Home }