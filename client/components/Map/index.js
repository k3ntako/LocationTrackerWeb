import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const Map = (props) => {
  return <GoogleMap defaultZoom={8} defaultCenter={{ lat: 40.667545, lng: -73.969877 }} defaultZoom={13}>
    {props.isMarkerShown && <Marker position={{ lat: 40.667545, lng: -73.969877 }} />}
  </GoogleMap>
}



export default withScriptjs(withGoogleMap(Map));