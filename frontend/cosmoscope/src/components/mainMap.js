import React, { Component } from 'react'

import {geoPath} from "d3-geo"

import {projection, graticule, outline} from "./utils"

class Map extends Component {

  constructor (props) {
    super(props)

    this.state = {
      mapHeight: window.innerHeight,
      mapWidth: window.innerWidth,
      projection: projection,
      graticule: graticule,
      outline: outline,
      path: geoPath(projection),
    }
  }

  

  render() {
    const {mapHeight, mapWidth, projection, path} = this.state

    return (
      <div>
        <svg 
          width={mapWidth} 
          height={mapHeight} 
          viewBox={`0 0 800 400`}
        >
        <defs>
          <path 
            id="outline" 
            d={path(outline)}
          />
        </defs>

        <use href="#outline" fill="#000" stroke="#000"/>

        <g>
          <use href={new URL("#outline")} fill="#fff" />
          <path d={path(graticule)} stroke="#ccc" fill="none" stroke-width="0.5"/>
        </g>
        
        
        </svg>
      </div>
    )
  }

}

export default Map