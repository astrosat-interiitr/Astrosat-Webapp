import {geoHammer, geoAitoff, geoMollweide} from "d3-geo-projection"
import {geoGraticule10} from "d3"

export const aitoffProj = geoAitoff()
export const hammerProj = geoHammer()
export const mollweideProj = geoMollweide()

                    
export const graticule = geoGraticule10()

export const outline = ({type: "Sphere"})

export const axes1 = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "geometry": {
          "type": "LineString",
          "coordinates": [
              [0.0, 90.0],
              [0.0, -90.0],
          ]
      },
      "properties": {
        "name": "CP",
        "prop1": 0.0
    }
  }]
}

export const axes2 = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "geometry": {
          "type": "LineString",
          "coordinates": [
              [-180, 0],
              [180., 0],
          ]
      },
      "properties": {
        "name": "CP",
        "prop1": 0.0
    }
  }]
}

