const axios = require('axios');
const cheerio = require('cheerio');
var url = "https://dumppi.fi/tapahtumat/";


const getEvents = async () => {
    let fullEvents = []
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const events = $('#em-wrapper > div.css-events-list > table > tbody',html).children();

            const eventList = [];
            events.each(function(i, elem) {
                eventList[i] = $(this).text().replace(/\s\s+/g, ' ');      //irrotetaan tekstisisältö elementeistä,siistitään whitespacet ja lisätään taulukkoon
            });

            const eventsWithCapacity = [];
            const capacities = [];
            
            eventList.forEach(element => {                                 //käydään läpi kaikki tapahtumat
                element += "\n";
                if(element.match(/(\([0-9]{1,}\/[0-9]{1,}\))/g)) {              //jos tapahtumassa on kanta
                    eventsWithCapacity.push(element);                           //lisätään kannallisten listalle
                    let capacity = element.match(/(\([0-9]{1,}\/[0-9]{1,}\))/g).toString().replace(/[\(\)]/g, '');     //otetaan kannan tiedot irti (osallistuneet/kapasiteetti)
                    capacities.push(capacity);                                         //lisätään kanta taulukkoon
                    capacities.forEach(amount => {                                 //käydään kantataulukko läpi
                        var amounts = amount.split('/');                    //erotetaan lukemat toisistaan tilapäiseen taulukkoon
                        //jos osallistuneiden lukumäärä on suurempi kuin kapasiteetti, lisätään tapahtumaelementti täysien kantojen listalle
                        if (parseInt(amounts[0]) > parseInt(amounts[1]) && fullEvents.indexOf(element) == -1) fullEvents.push(element);
                    });
                }
            });
        }
    } catch (error) {
        return [];
    }
    return fullEvents;

}

module.exports = getEvents
