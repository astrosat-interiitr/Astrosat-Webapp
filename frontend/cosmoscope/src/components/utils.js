import {geoHammer, geoAitoff} from "d3-geo-projection"
import {geoGraticule10} from "d3"

export const projection = geoAitoff()
                          .scale(100)
                          .translate([ 800 / 2, 450 / 2 ])
                    
export const graticule = geoGraticule10()

export const outline = ({type: "Sphere"})

export const getMwbackground = (d) => {
  // geoJson object to darken the mw-outside, prevent greying of whole map in some orientations 
  var res = {'type': 'FeatureCollection', 'features': [ {'type': 'Feature', 
              'geometry': { 'type': 'MultiPolygon', 'coordinates' : [] }
            }]};

  // reverse the polygons, inside -> outside
  var l1 = d.features[0].geometry.coordinates[0];
  res.features[0].geometry.coordinates[0] = [];
  for (var i=0; i<l1.length; i++) {
    res.features[0].geometry.coordinates[0][i] = l1[i].slice().reverse();
  }

  return res;
}