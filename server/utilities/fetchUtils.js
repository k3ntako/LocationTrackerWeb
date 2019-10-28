const fetch = require('node-fetch');

module.exports = {
  get: async url => {
    const response = await fetch(url, {
      mode: 'no-cors',
    });

    return await response.json();
  },
};
