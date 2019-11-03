import React, { Component } from 'react';
import Map from '../../components/Map';

import runUtils from '../../utilities/runUtils';
const getRun = runUtils.getRun;
const getUserLiveRun = runUtils.getUserLiveRun;

class index extends Component {
  constructor(props) {
    super(props);

    const pathname = window.location.pathname.toLowerCase();      
    let user_id, run_id;
    if (pathname.startsWith('/user/') && (pathname.endsWith('/live') || pathname.endsWith('/live/')) ) {
      user_id = pathname.substring(
        pathname.lastIndexOf("/user/") + 6, //6 is the length of "/user/"
        pathname.lastIndexOf("/live")
      );
    }else{
      run_id = pathname.slice(1);
    }

    const onRootPage = pathname.length < 2;
    const validUserId = user_id && user_id.length === 36;
    const validRunId = run_id && run_id.length === 36;
    if (!onRootPage && !validUserId && !validRunId) {
      window.location.replace("/");
    }


    this.state = {
      run_id: run_id || null,
      user_id: user_id || null,
      polylineCodes: [],
      updatedAt: null,
      startCoordinate: null,
      currentCoordinate: null,
    }

    this.interval = null;
  }

  componentDidMount(){
    this.getRun();
    
    this.interval = setInterval(() => {
      this.getRun();
    }, 10000)    
  }

  getRun = async () => {    
    const {run_id, user_id} = this.state;

    let response;
    if (run_id) {
      response = await getRun(run_id, this.state.updatedAt);
    } else if (user_id){
      response = await getUserLiveRun(user_id, this.state.updatedAt);
    }else{
      return;
    }

    if (!response.changed) {
      return;
    }

    const { polylineCodes, updatedAt, startCoordinate, currentCoordinate } = response;    
    this.setState({ polylineCodes, updatedAt, startCoordinate, currentCoordinate });
  }
  
  render() {
    const { polylineCodes, startCoordinate, currentCoordinate } = this.state;

    return (
      <div>
        <Map
          polylineCodes={polylineCodes}
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