import React, { Component, useState, useEffect  } from 'react'

import {geoPath, } from "d3-geo"
import * as d3 from "d3"

import { feature } from "topojson-client"

import {projection as initProj, graticule, outline} from "./utils"
import "./mainMap.css"

const versor = require("versor");

function Map(props){

  const [mapWidth, setMapWidth] = useState(window.innerWidth);
  const [highlight, toggleHighlight] = useState(false)
  const [highlightPos, setHighlightPos] = useState([0, 0])
  const [highlightName, setHighlightName] = useState("")

  const projection = initProj

  const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(mapWidth, outline)).bounds(outline);
  const mapHeight = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), mapHeight);
  projection.scale(projection.scale() * (l - 1) / l).precision(0.2);

  const coords = [139.6917,35.6895]
  
  const [path, setPath] = useState(() => geoPath(projection));
  const [sources, setSources] = useState([])
  // const [projection, setProjection] = useState(initProj);
  // const [graticule, setGraticule] = useState(graticule);

  var v0, q0, r0;

  useEffect(() => {
    let map = d3.select("#outline") 
    
    map.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    );

    

    fetch("http://127.0.0.1:8000/cosmicsource/")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(cosmicData => {
          setSources(cosmicData)
        })
      })
  })

  const dragstarted = (event) => {
    v0 = versor.cartesian(projection.invert(d3.pointer(event)));
    r0 = projection.rotate();
    q0 = versor(r0);
  }
  
  const dragged = (event) => {
    let p = d3.pointer(event)
    var v1 = versor.cartesian(projection.rotate(r0).invert(d3.pointer(event))),
        q1 = versor.multiply(q0, versor.delta(v0, v1)),
        r1 = versor.rotation(q1);
    projection.rotate(r1);

    setPath(() => geoPath(projection))
  }

  const handleSourceClick = (id) => {
    
    toggleHighlight(highlight => !highlight)
    setHighlightPos([sources[id].equatorial_ra, sources[id].equatorial_dec])
    setHighlightName(sources[id].name)
  }
 
  return (
    <div>
      <svg
        width = {mapWidth}
        height = {mapHeight}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
      >
      <defs>
        <path 
          id="outline" 
          d={path(outline)}
        />
        <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: `rgb(0,0,255)`, stopOpacity:1}} />
          <stop offset="100%" style={{stopColor: `rgb(0,0,0)`, stopOpacity:1}} />
        </linearGradient>
      </defs>

      {/* <rect width="100%" height="100%" fill="url(#grad2)" /> */}

      <use href="#outline" fill="#000"/>

      <g>
        <path d={path(graticule)} stroke="#ccc" fill="none" strokeWidth="0.5"/>
      </g>
      
      <use href="#outline" fill="none" stroke="#000"/>

      <g className="sources">
        {
          sources.map((source, i) => (
            <circle
              key={i}
              cx={ projection([source.equatorial_ra, source.equatorial_dec])[0] }
              cy={ projection([source.equatorial_ra, source.equatorial_dec])[1] }
              r={ 5 }
              fill="#99fadc"
              stroke="#FFFFFF"
              className="marker"
              onClick={ () => handleSourceClick(i) }
            />

          ))
        }  
      </g>

      {highlight && (
        <g>
          <circle
          cx={ projection(highlightPos)[0] }
          cy={ projection(highlightPos)[1] }
          r={10}
          fill="none"
          stroke="#7021e4"
          strokeWidth="3"
          className="highlight"
          onClick={ () => handleSourceClick() }
        />
        <text 
          x={ projection(highlightPos)[0] + 4 }
          y={ projection(highlightPos)[1] + 4 }
          class="small"
          fill="red"
          >
            {highlightName}
        </text>
        </g>
      )}
      
      </svg>
    </div>
  )
}
export default Map