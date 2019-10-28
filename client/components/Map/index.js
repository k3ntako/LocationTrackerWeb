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
      polyline: null,
      polylineCode: null,
    };

    this.map = null;
  }

  static getDerivedStateFromProps(props, state){
    const { polylineCode } = props;

    if (!polylineCode){
      return null;
    }

    if (polylineCode === state.polylineCode){
      return null;
    }

    const decodedPolylineCode = google.maps.geometry.encoding.decodePath(polylineCode);
    const polyline = new google.maps.Polyline({
      path: decodedPolylineCode,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    //TODO: change bounds

    return { polyline, polylineCode };
  }

  componentDidMount(){
    this.map = this.context[MAP];
    if(!this.map){
      throw new Error("No map. Try reloading the page.")
    }
  }

  componentDidUpdate(){
    if(this.state.polyline){      
      this.state.polyline.setMap(this.map);
    }
  }
  
  render(){
    const {startCoordinate, currentCoordinate} = this.props;
    let markers;
    if (startCoordinate && currentCoordinate){
      markers = [startCoordinate, currentCoordinate].map(location => {
        return <Marker
          key={location.id}
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