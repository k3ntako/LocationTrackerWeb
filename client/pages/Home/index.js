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
      locations: [],
      run_id: run_id,
      locations: [],
    }
  }

  componentDidMount(){
    if(this.state.run_id){
      getRun(this.state.run_id).then(run => {
        this.setState({ locations: run.locationPoints });
      });      
    }
  }
  
  render() {
    return (
      <div>
        <Map
          locations={this.state.locations}
          googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyBNw8ZOZT-iRYex-8YY8a7vbtHkElGO8II&v=3.exp&libraries=geometry,drawing,places"}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />} />
      </div>
    );
  }
}

export default index;