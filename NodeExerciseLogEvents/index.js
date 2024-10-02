const EventEmmiter = require('events');
const logEvents = require('./LogEvents.js');
class MyEmmiter extends EventEmmiter {}
const myEmmiter = new MyEmmiter();
myEmmiter.on('log', (message) => logEvents(message));
setTimeout(() => {
    myEmmiter.emit('log', 'hello i will log in later 😍 😅😂');
}
, 2000)