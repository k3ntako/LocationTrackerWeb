import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";


const Map = (props) => {
  const markers = props.locations && props.locations.map(location => {
    return <Marker 
      key={location.id} 
      position={{ lat: location.latitude, lng: location.longitude }} />
  })  

  return <GoogleMap defaultZoom={8} defaultCenter={{ lat: 40.667545, lng: -73.969877 }} defaultZoom={13}>
    {markers}
  </GoogleMap>
}



export default withScriptjs(withGoogleMap(Map));