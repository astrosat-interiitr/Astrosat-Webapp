import React from 'react'
import './App.css'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Canvas from './components/Canvas.js'
import WorldMap from './components/worldmap'

function App() {
  return (
    <Router className="App">
     <div className='App'>
      <Switch>
          <Route exact path='/' component={WorldMap} />
        </Switch> 
     </div>
    </Router>
  );
}

export default App;
