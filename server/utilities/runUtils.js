const fetchUtils = require('./fetchUtils');
const GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyDmjwkH5u86-RNU-_iWEpOoLlSUcW1cFeE&v=3.exp&mode=walking';

module.exports = {
  getPolylineCode: async(locationPoints) => {
    try {
      if (locationPoints.length < 2) throw new Error('There must be at least two location points');

      // Format coordinates into strings
      let locationURLArr = locationPoints.map(locationPoint => `${locationPoint.latitude},${locationPoint.longitude}`);

      // remove origin and destination from locationURLArr
      const origin = locationURLArr.shift();
      const destination = locationURLArr.pop();

      let url = GOOGLE_MAPS_URL + `&origin=${origin}&destination=${destination}`;

      // url for waypoints
      const locationURL = locationURLArr.join('|');
      url += `&waypoints=via:` + locationURL;

      const response = await fetchUtils.get(url);
      if(!response.routes || !response.routes.length){
        throw new Error('Invalid polyline response: ', response);
      }
      const polylineCode = response.routes[0].overview_polyline.points;

      const originPoint = locationPoints[0];
      const destinationPoint = locationPoints[locationPoints.length - 1];
      const startCoordinate={
        latitude: originPoint.latitude,
        longitude: originPoint.longitude,
      }

      return [polylineCode, destinationPoint.time, startCoordinate];
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  generatePolylineResponse: (polylineCode, updatedAt, currentCoordinate, startCoordinate) => {
    return {
      polylineCode,
      updatedAt,
      currentCoordinate,
      startCoordinate,
      changed: true,
    };
  }
}