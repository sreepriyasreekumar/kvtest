const axios = require('axios');

const getData = async () => {
    try {
        let result  = await axios.get('http://block2test.azure-api.net/kvtest');
        console.log(result);
    } catch (error) {
      console.error(error)
    }
  }

  getData();