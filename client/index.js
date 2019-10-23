import React, { Component } from 'react';
import { render } from 'react-dom';
import Home from './pages/Home';

class App extends Component {
  render() {
    return <Home />
  }
}
render(<App />, document.getElementById('app'));