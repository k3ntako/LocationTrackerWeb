const fetchUtils = require('./fetchUtils');
const GOOGLE_MAPS_URL = `https://maps.googleapis.com/maps/api/directions/json?key=${process.env.NODE_GOOGLE_API_KEY}&v=3.exp&mode=walking`;

module.exports = {
  getPolylineCode: async (locationPoints, polyline_updated_at) => {
    try {
      if (locationPoints.length < 2) throw new Error('There must be at least two location points');
      let lastIncludedIdx = 0;
      if (polyline_updated_at) {
        lastIncludedIdx = locationPoints.findIndex((location) => polyline_updated_at.getTime() === location.time.getTime());
        lastIncludedIdx = lastIncludedIdx <= 0 ? 0 : lastIncludedIdx - 1; //if -1 change it to 0
      }

      const newLocationPoints = lastIncludedIdx === -1 ? locationPoints : locationPoints.slice(lastIncludedIdx, lastIncludedIdx + 10);
      // newLocationPoints are points that were not included in a previous polyline update.
      // It includes the oldest 10 points that were not included because Google Maps charges more for polylines with 11+ waypointss
      // https://developers.google.com/maps/documentation/directions/usage-and-billing#directions-advanced

      // Format coordinates into strings
      let locationURLArr = newLocationPoints.map(locationPoint => `${locationPoint.latitude},${locationPoint.longitude}`);

      // remove origin and destination from locationURLArr
      const origin = locationURLArr.shift();
      const destination = locationURLArr.pop();

      let url = GOOGLE_MAPS_URL + `&origin=${origin}&destination=${destination}`;

      // url for waypoints
      const locationURL = locationURLArr.join('|');
      url += `&waypoints=` + locationURL;

      const response = await fetchUtils.get(url);
      if(!response.routes || !response.routes.length){
        throw new Error('Invalid polyline response: ' + response);
      }
      const polylineCode = response.routes[0].overview_polyline.points;

      const originPoint = locationPoints[0]; // starting point for whole run
      const destinationPoint = newLocationPoints[newLocationPoints.length - 1]; // end point for updated part of run (not necessarily the whole run)
      const startCoordinate = {
        latitude: originPoint.latitude,
        longitude: originPoint.longitude,
      }

      return [polylineCode, destinationPoint.time, startCoordinate];
    } catch (err) {
      console.error("Error in getPolylineCode")
      console.error(err);
      return err;
    }
  },
  generatePolylineResponse: (polylineCodes, updatedAt, currentCoordinate, startCoordinate) => {
    return {
      polylineCodes,
      updatedAt,
      currentCoordinate,
      startCoordinate,
      changed: true,
    };
  }
}