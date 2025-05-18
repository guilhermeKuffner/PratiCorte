import React from 'react';
import AppRoutes from './config/routes';

class App extends React.Component {
  render() {
      return (
          <div className="main-container bg-secondary">
            <AppRoutes />
          </div>
      )
  }
}

export { App }