const axios = require('axios');
const cheerio = require('cheerio');

const getWisdoms = async () => {
  let wisdoms = [];
  try {
    const response = await axios.get('https://fi.wikiquote.org/wiki/Suomalaisia_sananlaskuja');
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const items = $('.mw-parser-output ul li');
      items.each((index, element) => {
        wisdoms.push($(element).text());
      })
    } else {
      throw new Error(`Error, response status ${response.status}`);
    }
  } catch (error) {
    return [];
  }
  return wisdoms;
}

module.exports = getWisdoms
