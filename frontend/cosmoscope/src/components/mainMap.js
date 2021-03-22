import React, { Component, useState, useEffect  } from 'react'

import {geoPath, } from "d3-geo"
import * as d3 from "d3"

import {projection as initProj, graticule, outline} from "./utils"
import { geoCraigRaw } from 'd3-geo-projection';

const versor = require("versor");


function Map(props){
  const mapHeight= window.innerHeight;
  const mapWidth = window.innerWidth;
  const projection = initProj
  const path = geoPath(projection);
  // const [path, setPath] = useState(initPath);
    // const [projection, setProjection] = useState(initProj);
  // const [graticule, setGraticule] = useState(graticule);
  var v0;
  var r0;
  var q0;

  useEffect(() => {
    let map = d3.select("svg") 
    
    map.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    );
  })

  const dragstarted = (event) => {
    v0 = versor.cartesian(projection.invert(d3.pointer(event)));
    r0 = projection.rotate();
    q0 = versor(r0);

    console.log("here")
  }
  
  const dragged = (event) => {
    var v1 = versor.cartesian(projection.rotate(r0).invert(d3.pointer(event))),
        q1 = versor.multiply(q0, versor.delta(v0, v1)),
        r1 = versor.rotation(q1);
    projection.rotate(r1);

    console.log("hereff")
    
  }


 
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

      <use href="#outline" fill="#000"/>

      <g>
        <path d={path(graticule)} stroke="#ccc" fill="none" strokeWidth="0.5"/>
      </g>
      
      <use href="#outline" fill="none" stroke="#000"/>
      
      </svg>
    </div>
  )
}
export default Map