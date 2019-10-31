import fetchUtils from './fetchUtils';


export default {
  getRun: async (run_id, lastUpdate = null) => {
    try {
      const lastUpdateQuery = lastUpdate ? `?lastUpdate=${lastUpdate}` : ''
      const response = await fetchUtils.get('https://location-tracker25.herokuapp.com/api/run/' + run_id + lastUpdateQuery);
      
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  getUserLiveRun: async (user_id, lastUpdate = null) => {
    try {
      const lastUpdateQuery = lastUpdate ? `?lastUpdate=${lastUpdate}` : ''
      return await fetchUtils.get(`https://location-tracker25.herokuapp.com/api/user/${user_id}/live${lastUpdateQuery}`);
    } catch (err) {
      console.error(err);
      return err;
    }
  },
};
