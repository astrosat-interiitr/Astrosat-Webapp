import React, { Component, useState, useEffect  } from 'react'

import {geoPath, } from "d3-geo"
import * as d3 from "d3"

import { feature } from "topojson-client"

import {projection as initProj, graticule, outline} from "./utils"

const versor = require("versor");

function Map(props){

  const mapWidth = window.innerWidth;
  const projection = initProj

  const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(mapWidth, outline)).bounds(outline);
  const mapHeight = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), mapHeight);
  projection.scale(projection.scale() * (l - 1) / l).precision(0.2);

  
  const [path, setPath] = useState(() => geoPath(projection));
  const [geographies, setGeographies] = useState([])
  // const [projection, setProjection] = useState(initProj);
  // const [graticule, setGraticule] = useState(graticule);

  console.log(typeof(path));

  var v0, q0, r0;

  useEffect(() => {
    let map = d3.select("svg") 
    
    map.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    );

    fetch("/world-110m.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worlddata => {
          setGeographies(feature(worlddata, worlddata.objects.countries).features)
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
      </defs>

      <use href="#outline" fill="#000"/>

      <g>
        <path d={path(graticule)} stroke="#ccc" fill="none" strokeWidth="0.5"/>
      </g>
      
      <use href="#outline" fill="none" stroke="#000"/>

      <g className="countries">
          {
            geographies.map((d,i) => (
              <path
                key={ `path-${ i }` }
                d={ geoPath().projection(projection)(d) }
                className="country"
                fill={ `rgba(38,50,56,${ 1 / geographies.length * i})` }
                stroke="#FFFFFF"
                strokeWidth={ 0.5 }
                // onClick={ () => handleCountryClick(i) }
              />
            ))
          }
        </g>
      
      </svg>
    </div>
  )
}
export default Map