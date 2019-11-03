import React, {Component} from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import PropTypes from 'prop-types';
import { MAP } from 'react-google-maps/lib/constants';

class Map extends Component{
  static contextTypes = { [MAP]: PropTypes.object };

  constructor(props) {
    super(props);
    this.state = {
      snappedPoints: [],
      polylines: [],
      polylineCodes: [],
      newPolylineCount: 0,
    };

    this.map = null;
  }

  static getDerivedStateFromProps(props, state){
    const { polylineCodes } = props;

    if (!polylineCodes.length) {
      return null;
    }

    if (state.polylineCodes.includes(props.polylineCodes[0])) {
      return null;
    }

    // if (polylineCodes.length === state.polylineCodes.length){
    //   return null;
    // }


    // const newPolylineCodes = polylineCodes.slice(state.polylineCodes.length);
    const newPolylineCodes = polylineCodes;

    const decodedPolylineCodes = newPolylineCodes.map(code => google.maps.geometry.encoding.decodePath(code));
    
    const newPolylines = decodedPolylineCodes.map(path => {
      return new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
    });

    //TODO: change bounds

    return {
      polylines: state.polylines.concat(newPolylines),
      polylineCodes,
      newPolylineCount: newPolylines.length
    };
  }

  componentDidMount(){
    this.map = this.context[MAP];
    if(!this.map){
      throw new Error("No map. Try reloading the page.")
    }
  }

  componentDidUpdate(){
    const { polylines, newPolylineCount } = this.state;

    if (polylines.length && newPolylineCount) {
      const newPolylines = polylines.slice(polylines.length - newPolylineCount);
      newPolylines.map(polyline => {
        polyline.setMap(this.map);
      });

      const { latitude, longitude } = this.props.currentCoordinate;

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        const center = {
          lat: latitude,
          lng: longitude,
        }

        this.map.setCenter(center);
      }

      this.setState({
        newPolylineCount: 0,
      })
    }
  }
  
  render(){
    const {startCoordinate, currentCoordinate} = this.props;
    let markers;
    if (startCoordinate && currentCoordinate){
      markers = [startCoordinate, currentCoordinate].map((location, idx) => {
        return <Marker
          key={idx}
          position={{ lat: location.latitude, lng: location.longitude }} />
      })
    }

    return <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 40.667545, lng: -73.969877 }}>
      {markers}
    </GoogleMap>
  }
}

export default withScriptjs(withGoogleMap(Map));