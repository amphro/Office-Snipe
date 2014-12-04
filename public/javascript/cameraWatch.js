$(document).ready(function () {
    var img = document.getElementById("frame");

    // Web socket connection stuff is next...
    if('WebSocket' in window){
        connect('ws://localhost:3001/');
    } else {
        log ('web sockets not supported');
    }

    var ws;
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 450;

    function drawTargetCircle() {
        var centerX = canvas.width / 2 + 10;
        var centerY = canvas.height / 2 + 150;
        var radius = 10;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'red';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#003300';
        context.stroke();
    }

    function connect(host) {
        ws = new WebSocket(host);

        ws.onopen = function () {
            log('connected');
        };
        ws.onmessage = function (evt) {
            if (evt.data != null && evt.data[0] === "d" && evt.data[1]==="a") {
                var img = new Image();
                //console.log(str);
                img.src = evt.data;
                img.onload = function () {
                    context.drawImage(img,0,0);

                    drawTargetCircle();

                }
                //context.drawImage(evt.data, 0, 0, 120, 200);
                //img.src=evt.data;
            }
        };

        ws.onclose = function () {
            log('socket closed');
        };

        ws.onerror = function (evt) {
            log('<span style="color: red;">ERROR:</span> ' + evt.data);
        };
    };

    function log(msg){
        document.getElementById('log').innerHTML = msg + "<br/>" + document.getElementById('log').innerHTML ;
    }

});
