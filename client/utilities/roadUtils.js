import fetchUtils from './fetchUtils';

const ROAD_API_KEY = 'AIzaSyBKK0ATR1EzEDdGPucqQgPwFed9oZA876g';
const GOOGLE_ROAD_URL = `https://roads.googleapis.com/v1/snapToRoads?key=${ROAD_API_KEY}&`;

const GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/directions/json?';


export default {
  getSnappedPoints: async path => {
    try {
      const url = GOOGLE_ROAD_URL + `path=${path}`;
      const snappedPoints = await fetchUtils.get(url);

      return snappedPoints;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
};
