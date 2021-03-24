import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Map from './components/mainMap'
import Welcome from './components/welcome'

function App() {
  return (
    <Router className="App">
     <div className='App'>
      <Switch>
          <Route exact path='/home' component={Map} />
          <Route exact path='/' component={Welcome} exact={true} />
        </Switch> 
     </div>
    </Router>
  );
}

export default App;
