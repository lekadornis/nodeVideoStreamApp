const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const server  = require('http').Server(app);
const io = require('socket.io')(server);
const openCv = require('opencv4nodejs');

const FTS = 30;
const vCap = new openCv.VideoCapture(0);
vCap.set(openCv.CAP_PROP_FRAME_WIDTH, 400);
vCap.set(openCv.CAP_PROP_FRAME_HEIGHT, 400);

app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/watch-live-video', (req,res)=> {
    res.writeHead(200, {'Content-Type': 'video/mp4'})
    var rs = fs.createReadStream('video.mp4');
    rs.pipe(res);
});

app.get('/watch-image-stream', (req,res)=> {
    
    res.sendFile(path.join(__dirname, 'stream-image.html'));
});

setInterval(()=> {
    const frame = vCap.read();
    const image = openCv.imencode('.jpg', frame).toString('base64');
    io.emit('image', image);
}, 1000 / FTS);



server.listen(3300);