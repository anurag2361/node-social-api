import React, { Component } from 'react';
import './App.css';
import Signup from './components/Signup/Signup.js';
import Header from './components/Header/Header';

class App extends Component {
  render() {
    return (
      <div>
        <Signup history={this.props.history} />
      </div>
    )
  }
}

export default App;