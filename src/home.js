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
                <h1>{this.state.projeto}</h1>
                <h1>{this.state.data}</h1>
            </>
        )
    }
}

export { Home }