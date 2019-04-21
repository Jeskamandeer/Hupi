const readline = require('readline');
const fs = require('fs');

// create instance of readline
// each instance is associated with single input stream
let rl = readline.createInterface({
    input: fs.createReadStream('laulukirja.txt')
});

let line_no = 0;

// event is emitted after each line
rl.on('line', function(line) {
    line_no++;
    let match = "Finlandia-hymni";
    let haku = ". " + match;
    if(line === haku){
        console.log(line);
    }
});

// end
rl.on('close', function(line) {
    console.log('Total lines : ' + line_no);
});
