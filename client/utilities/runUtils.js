import fetchUtils from './fetchUtils';


export default {
  getRun: async (run_id, afterTime = null) => {
    try {
      const afterTimeQuery = afterTime ? `?afterTime=${afterTime}` : ''
      const run = await fetchUtils.get('http://localhost:3000/api/run/' + run_id + afterTimeQuery);
      
      return run;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
};
