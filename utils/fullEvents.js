const axios = require('axios');
const cheerio = require('cheerio');

const getFullEvents = async () => {
  let events;
  try {
    const response = await axios.get('https://dumppi-tapahtumat.now.sh/hupi');
    if (response.status === 200) {
      const html = response.data;
      events = html;
    } else {
      throw new Error(`Error, response status ${response.status}`);
    }
  } catch (error) {
    return [];
  }
  return events;
}

module.exports = getFullEvents;