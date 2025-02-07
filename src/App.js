import React from 'react';
import { Home } from './view/home'

class App extends React.Component {
  render() {
      return (
          <div className="main-container">
            <Home />
          </div>
      )
  }
}

export { App }