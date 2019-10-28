import React, { Component } from 'react';
import Map from '../../components/Map';

import runUtils from '../../utilities/runUtils';
const getRun = runUtils.getRun;

class index extends Component {
  constructor(props) {
    super(props);

    const pathname = window.location.pathname;
    const run_id = pathname.slice(1);

    if (run_id && run_id.length !== 36) {
      window.location.replace("/");
    }

    this.state = {
      run_id: run_id,
      polylineCode: null,
      updatedAt: null,
      startCoordinate: null,
      currentCoordinate: null,
    }
  }

  componentDidMount(){
    this.getRun();
  }

  getRun = async () => {
    const run_id = this.state.run_id;
    if (!run_id) {
      return;
    }

    const response = await getRun(run_id, this.state.updatedAt);
    if (!response.changed) {
      return;
    }

    const { polylineCode, updatedAt, startCoordinate, currentCoordinate } = response;
    this.setState({ polylineCode, updatedAt, startCoordinate, currentCoordinate });
  }
  
  render() {
    const { polylineCode, startCoordinate, currentCoordinate } = this.state;

    return (
      <div>
        <Map
          polylineCode={polylineCode}
          startCoordinate={startCoordinate}
          currentCoordinate={currentCoordinate}
          googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyBNw8ZOZT-iRYex-8YY8a7vbtHkElGO8II&v=3.exp&libraries=geometry,drawing,places"}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />} />
      </div>
    );
  }
}

export default index;