import React from 'react'
// import styles from './welcome.module.scss'
import {NavLink} from "react-router-dom"

import "./welcome.css"
function Welcome(props) {
  return (
      <div class="welcome">
        <div class="title">CosmoScope</div>

        <div class="desc">A web based visualisation tool for AstroSat observations!</div>

        <NavLink to="/home" class="animated-button7">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Get Started
        </NavLink>
      </div>
      
  )
}

export default Welcome