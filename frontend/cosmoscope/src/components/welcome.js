import React, { Component, useState, useEffect  } from 'react'
import styles from './welcome.module.scss'
import {NavLink} from "react-router-dom"

function Welcome(props) {
  return (
      <div className ={styles.welcome}>
        <div className ={styles.title}>CosmoScope</div>

        <div className={styles.desc}>A web based visualisation tool for AstroSat observations!</div>

        <NavLink to="/home" className={styles.animated_button7}>
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