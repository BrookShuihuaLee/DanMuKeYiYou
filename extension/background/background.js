/**
 * Created by Brook on 2016/5/14.
 */
var socket = io('http://localhost:15434');
socket.on('connect', function () {
    socket.emit('getOldMessages', 'www.baidu.com');
});
socket.on('message', function (message) {
    console.log(message);
});
socket.on('oldMessages', function (oldMessages) {
    console.log(oldMessages);
});