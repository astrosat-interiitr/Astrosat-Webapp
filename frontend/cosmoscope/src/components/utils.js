import {geoHammer, geoAitoff} from "d3-geo-projection"
import {geoGraticule10} from "d3"

export const projection = geoAitoff()
                          .scale(100)
                          .translate([ 800 / 2, 450 / 2 ])
                    
export const graticule = geoGraticule10()

export const outline = ({type: "Sphere"})