const config = require('./config.json');
const ledBoard = require('cd-rpi-rgb-led-matrix');
const ip = require('ip');
const socket = require('socket.io-client')(config.socketURL+':'+config.socketPort);

var led = new ledBoard(config.matrix.height, config.matrix.width);

console.log(config.appName + ' started.');

//initial message on the screen
led.drawText(0, 0, ip.address(), config.fontFile, 240, 106, 2);
led.drawText(0, 11, 'connecting', config.fontFile, 240, 106, 2);
led.drawText(0, 21, 'ver'+config.version, config.fontFile, 240, 106, 2 );
led.update();

//wrongly named function
function newLine(busses) {
    led.clear();
    let lineX, lineY = 0;
    let timeX = 0;
    for(let i in busses) {
        led.drawText(lineX, lineY, busses[i]['LinePublicNumber'], config.fontFile, 240, 106, 2);
        if(busses[i]['ArrivalInMinutes'].toString().length === 1) {
            timeX = 0;
        } else {
            timeX = 6;
        }
        //  240, 106, 2 = oranje
        // led.drawText(lineX, lineY, busses[i]['DestinationName50'], config.fontFile, 240, 106, 2 ); // for the bigger board
        if(!busses[i]['Halted']){
            led.drawText((led.getWidth() - 31) - timeX, lineY, busses[i]['ArrivalInMinutes'] + " min", config.fontFile, 240, 106, 2 );
        } else {
            halted(lineY);
        }
        lineY += 11;
    } 
    led.update();
}

function halted(pos) {
    let bus =[
        { y: 0, x: 0 }, { y: 0, x: 1 }, { y: 0, x: 2 }, { y: 0, x: 3 }, { y: 0, x: 4 }, { y: 0, x: 5 }, { y: 0, x: 6 }, { y: 0, x: 7 }, { y: 0, x: 8 }, { y: 0, x: 9 }, { y: 0, x: 10 }, { y: 0, x: 11 }, { y: 0, x: 12 }, { y: 0, x: 13 }, { y: 0, x: 14 }, { y: 0, x: 15 }, { y: 0, x: 16 },
        { y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 4 }, { y: 1, x: 5 }, { y: 1, x: 8 }, { y: 1, x: 9 }, { y: 1, x: 12 }, { y: 1, x: 13 }, { y: 1, x: 15 },
        { y: 2, x: 0 }, { y: 2, x: 1 }, { y: 2, x: 4 }, { y: 2, x: 5 }, { y: 2, x: 8 }, { y: 2, x: 9 }, { y: 2, x: 12 }, { y: 2, x: 13 }, { y: 2, x: 16 },
        { y: 3, x: 0 }, { y: 3, x: 1 }, { y: 3, x: 4 }, { y: 3, x: 5 }, { y: 3, x: 8 }, { y: 3, x: 9 }, { y: 3, x: 12 }, { y: 3, x: 13 }, { y: 3, x: 16 },
        { y: 4, x: 0 }, { y: 4, x: 1 }, { y: 4, x: 2 }, { y: 4, x: 3 }, { y: 4, x: 4 }, { y: 4, x: 5 }, { y: 4, x: 6 }, { y: 4, x: 7 }, { y: 4, x: 8 }, { y: 4, x: 9 }, { y: 4, x: 10 }, { y: 4, x: 11 }, { y: 4, x: 12 }, { y: 4, x: 13 }, { y: 4, x: 14 }, { y: 4, x: 15 }, { y: 4, x: 16 },
        { y: 5, x: 0 }, { y: 5, x: 1 }, { y: 5, x: 2 }, { y: 5, x: 3 }, { y: 5, x: 6 }, { y: 5, x: 7 }, { y: 5, x: 8 }, { y: 5, x: 9 }, { y: 5, x: 10 }, { y: 5, x: 11 }, { y: 5, x: 14 }, { y: 5, x: 15 }, { y: 5, x: 16 },
        { y: 6, x: 4 }, { y: 6, x: 5 }, { y: 6, x: 12 }, { y: 6, x: 13 }
    ];
    for (let i in bus) {
       led.setPixel(((bus[i].x + led.getWidth()) - 17) - 1, (bus[i].y + 1) + pos, 240, 106, 2); 
    }
    led.update();
}

socket.on('connect', function(){
    console.log('connected to server');
    led.clear();
    led.drawText(0, 0, ip.address(), config.fontFile, 240, 106, 2);
    led.drawText(0, 11, 'connected', config.fontFile, 240, 106, 2 );
    led.drawText(0, 21, 'ver'+config.version, config.fontFile, 240, 106, 2 );
    led.update();
});

socket.on(config.timingPointCode, function(data){
    newLine(data);
});

socket.on('disconnect', function(){
    console.log('disconnected from server');
    led.clear()
    led.drawText(0, 0, ip.address(), config.fontFile, 240, 106, 2);
    led.drawText(0, 11, 'disconnect', config.fontFile, 240, 106, 2);
    led.drawText(0, 21, 'ver'+config.version, config.fontFile, 240, 106, 2 );
    led.update();
});