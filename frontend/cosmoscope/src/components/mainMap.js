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
  

  useEffect(() => {
    let map = d3.select("svg")
    map
    .call(drag(projection))
  })

  const drag = (projection) => {
    let v0, q0, r0, a0, l;

    function pointer(event, that) {
      const t = d3.pointers(event, that);
      if (t.length !== l) {
        l = t.length;
        if (l > 1) a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
        dragstarted.apply(that, [event, that]);
      }
  
      // For multitouch, average positions and compute rotation.
      if (l > 1) {
        const x = d3.mean(t, p => p[0]);
        const y = d3.mean(t, p => p[1]);
        const a = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
        return [x, y, a];
      }
  
      return t[0];
    }
    
    const dragstarted = (e) => {
      v0 = versor.cartesian(projection.invert(pointer()));
      q0 = versor(r0 = projection.rotate());
    }

    const dragged = (e) => {

      const p = pointer();
      const v1 = versor.cartesian(projection.rotate(r0).invert(p));
      const delta = versor.delta(v0, v1);
      let q1 = versor.multiply(q0, delta);
  
      // For multitouch, compose with a rotation around the axis.
      if (p[2]) {
        const d = (p[2] - a0) / 2;
        const s = -Math.sin(d);
        const c = Math.sign(Math.cos(d));
        q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
      }
      
      const newPath = geoPath(projection.rotate(versor.rotation(q1)))
      
      console.log(newPath)
  
      // In vicinity of the antipode (unstable) of q0, restart.
      if (delta[0] < 0.7) dragstarted.apply(this, [e, this]);
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged);
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