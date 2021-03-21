import React from 'react'
import './App.css'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Canvas from './components/Canvas.js'
import WorldMap from './components/worldmap'
import Map from './components/mainMap'

function App() {
  return (
    <Router className="App">
     <div className='App'>
      <Switch>
          <Route exact path='/' component={Map} />
        </Switch> 
     </div>
    </Router>
  );
}

export default App;
