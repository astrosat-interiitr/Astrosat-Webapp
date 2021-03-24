import React, { Component, useState, useEffect  } from 'react'
import './welcome.css'

function Welcome(props) {
  return (
      <div id="welcome">
        <h1 id="title">CosmoScope</h1>

        <h2 id="desc">A web based visualisation tool for AstroSat observations!</h2>

        <a href="/home" class="animated-button7">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Get Started
        </a>
      </div>
      
  )
}

export default Welcome