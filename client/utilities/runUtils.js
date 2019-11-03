import fetchUtils from './fetchUtils';


export default {
  getRun: async (run_id, after = null) => {
    try {
      const afterQuery = after ? `?after=${after}` : ''
      const response = await fetchUtils.get('/api/run/' + run_id + afterQuery);
      
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  getUserLiveRun: async (user_id, after = null) => {
    try {
      const afterQuery = after ? `?after=${after}` : ''
      return await fetchUtils.get(`/api/user/${user_id}/live${afterQuery}`);
    } catch (err) {
      console.error(err);
      return err;
    }
  },
};
