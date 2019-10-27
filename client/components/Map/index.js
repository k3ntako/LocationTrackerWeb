import React, {Component} from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import PropTypes from 'prop-types';
import { MAP } from 'react-google-maps/lib/constants';
import roadUtils from '../../utilities/roadUtils';
const getSnappedPoints = roadUtils.getSnappedPoints;

class Map extends Component{
  static contextTypes = { [MAP]: PropTypes.object };

  constructor(props) {
    super(props);
    this.state = {
      snappedPoints: [],
    };

    this.map = null;
  }

  componentDidMount(){
    this.map = this.context[MAP];

    if (this.map && this.props.locations && this.props.locations.length) {
      let path = '';
      this.props.locations.forEach(location => {
        path += `${location.latitude},${location.longitude}|`;
      });
      path = path.substring(0, path.length - 1);

      getSnappedPoints(path).then(snappedPoints => {
        this.setState({ snappedPoints: snappedPoints.snappedPoints });
      })
    }
  }
  
  render(){
    if (this.state.snappedPoints.length) {
      const path = this.state.snappedPoints.map(location => {
        
        return {
          lat: location.location.latitude,
          lng: location.location.longitude,
        }
      });

      const runPath = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });    
      
      runPath.setMap(this.map);
    }

    const markers = this.props.locations && this.props.locations.map(location => {
      return <Marker
        key={location.id}
        position={{ lat: location.latitude, lng: location.longitude }} />
    })

    return <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 40.667545, lng: -73.969877 }}>
      {markers}
    </GoogleMap>
  }
}

export default withScriptjs(withGoogleMap(Map));