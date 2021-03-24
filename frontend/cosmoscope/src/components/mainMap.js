import React, { Component, useState, useEffect, useRef  } from 'react'

import {geoPath, } from "d3-geo"
import * as d3 from "d3"



import {projection as initProj, graticule, outline} from "./utils"
import "./mainMap.css"

import Navbar from "./navbar"

const versor = require("versor");

function Map(props){

  const [mapWidth, setMapWidth] = useState(window.innerWidth);
  const [highlight, toggleHighlight] = useState(false)
  const [highlightId, setHighlightId] = useState()
  const [query, setQuery] = useState("")

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
    
    let map = d3.select("#outline") 
  
    map.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    );

    map.call(zoom(projection))
  }, [])

  const dragstarted = (event) => {
    v0 = versor.cartesian(projection.invert(d3.pointer(event)));
    r0 = projection.rotate();
    q0 = versor(r0);
  }
  
  const dragged = (event) => {
    var v1 = versor.cartesian(projection.rotate(r0).invert(d3.pointer(event))),
        q1 = versor.multiply(q0, versor.delta(v0, v1)),
        r1 = versor.rotation(q1);
    projection.rotate(r1);

    setPath(() => geoPath(projection))
  }

  const handleSourceClick = (id) => {
    
    toggleHighlight(highlight => !highlight)
    setHighlightId(id)
  }

  function zoom(projection, {
    // Capture the projection’s original scale, before any zooming.
    scale = projection._scale === undefined
      ? (projection._scale = projection.scale()) 
      : projection._scale,
    scaleExtent = [0.8, 8]
  } = {}) {
    let vv0, qq0, rr0, aa0, tl;    
  
    const zoomstarted = (event) => {
      vv0 = versor.cartesian(projection.invert(d3.pointer(event)));
      qq0 = versor((rr0 = projection.rotate()));
    }
  
    const zoomed = (event) => {
      projection.scale(event.transform.k);
      const pt = d3.pointer(event);
      const vv1 = versor.cartesian(projection.rotate(rr0).invert(pt));
      const deltaa = versor.delta(vv0, vv1);
      let qq1 = versor.multiply(qq0, deltaa);
  
      projection.rotate(versor.rotation(qq1));

      // setPath(() => geoPath(projection))
    }

    const zoom = d3.zoom()
        .scaleExtent(scaleExtent.map(x => x * scale))
        .on("start", zoomstarted)
        .on("zoom", zoomed);
  
    return Object.assign(selection => selection
        .property("__zoom", d3.zoomIdentity.scale(projection.scale()))
        .call(zoom), {
      on(type, ...options) {
        return options.length
            ? (zoom.on(type, ...options), this)
            : zoom.on(type);
      }
    });
  }

  function InfoPanel() {
    return(
      <div class="bg">
        <div>
        <p>Name: {sources[highlightId].name}</p>
        <p>Ra, Dec: {sources[highlightId].equatorial_ra}, {sources[highlightId].equatorial_dec}</p>
        <p>Gal. Long/Lat: {sources[highlightId].galactic_longitude}, {sources[highlightId].galactic_latitude}</p>
        <p>X-Ray Flux: {sources[highlightId].x_ray_flux}</p>
        </div>
      </div>
    )
  }
  
  function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

  const onSubmit = (e) => {
    console.log(query);

    var res = findWithAttr(sources, "name", query)
    if (res === -1) {
      res = findWithAttr(sources, "name2", query)
    }

    if (res === -1) {
      res = findWithAttr(sources, "name3", query)
    }

    if (res != -1) {
      setHighlightId(res)
      toggleHighlight(true)
    }

  }

  function Footer() {
    return (
      <div className="custom-footer col p-3 d-flex justify-content-center " style={{color:'black', background:'#c0b9b924'}}>
          <form class="col-md-8 form-inline my-2">
              <input class="form-control col-lg-8" type="search" placeholder="Search" aria-label="Search" style={{opacity:1}} value={query} onChange={e => setQuery(e.target.value)} />
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={onSubmit}>Search</button>
              <div class="btn-group dropup">
                <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Projections
                </button>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="#">Aitoff</a>
                  <a class="dropdown-item" href="#">Hammer</a>
                  <a class="dropdown-item" href="#">Mollweide</a>
                </div>
              </div>
              
          </form>
      </div>
    );
  }
 
  return (
    <div>
      <div class="overlay"><Navbar/></div>
      {
        highlight && (<div><InfoPanel id={1}/></div>)
      }
      
      <svg
        width = {mapWidth}
        height = {mapHeight}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        id="map"
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
          cx={ projection([sources[highlightId].equatorial_ra, sources[highlightId].equatorial_dec])[0] }
          cy={ projection([sources[highlightId].equatorial_ra, sources[highlightId].equatorial_dec])[1] }
          r={10}
          fill="none"
          stroke="#7021e4"
          strokeWidth="3"
          className="highlight"
          onClick={ () => handleSourceClick() }
        />
        <text 
          x={ projection([sources[highlightId].equatorial_ra, sources[highlightId].equatorial_dec])[0] + 4 }
          y={ projection([sources[highlightId].equatorial_ra, sources[highlightId].equatorial_dec])[1] + 4 }
          class="small"
          fill="red"
          >
            {sources[highlightId].name}
        </text>
        </g>
      )}
      
      </svg>

      <div class="overlay2">
        {Footer()}
      </div>
    </div>
  )
}


export default Map