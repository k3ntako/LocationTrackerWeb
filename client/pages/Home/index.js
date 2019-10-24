import React, { Component } from 'react';
import Map from '../../components/Map';

export default (props) => {
  return <div>
    <Map isMarkerShown
      googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyBNw8ZOZT-iRYex-8YY8a7vbtHkElGO8II&v=3.exp&libraries=geometry,drawing,places"}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100vh` }} />}
      mapElement={<div style={{ height: `100%` }} />} />
  </div>
}