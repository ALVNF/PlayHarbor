const express = require('express');
var app = express();
var datos;
var server = require('http').Server(app);
var io = require('socket.io')(server);
const WebSocket = require('ws')

const wss = new WebSocket.Server({port:8081},()=>{
    console.log('server started')
})

wss.on('connection',(ws)=>{
    ws.on('message',(data)=>{
        console.log('data received %o '+data)
        ws.send(data)
        datos = data;
    })
})

wss.on('listening',()=>{
    console.log('server is listening on port 8080');
})

app.get('/', function(req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(datos);
});

server.listen(8080, function(){
    console.log("Servidor corriendo en http://localhost:8080");
});



