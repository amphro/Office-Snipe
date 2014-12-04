$(document).ready(function () {

    function log(msg) {
        var logElement = document.getElementById('log');
        if (logElement) {
            logElement.innerHTML = document.getElementById('log').innerHTML + msg + "<br/>";
        }
    };

    // Override the getUserMedia for browser support
    navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    var videoStream = null,
        videoElement = document.querySelector("video"),
        videoSelect = document.querySelector("select#videoSource");

    function addSourceToPage(sourceInfos) {
        for (var i = 0; i != sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];

            if (sourceInfo.kind === 'video') {
                var option = document.createElement("option");
                option.value = sourceInfo.id;
                option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
                videoSelect.appendChild(option);
            }
        }
    }

    if (typeof MediaStreamTrack === 'undefined'){
        alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
    } else {
        MediaStreamTrack.getSources(addSourceToPage);
    }


    function successCallback(stream) {
        videoStream = stream; // make stream available to console
        videoElement.src = window.URL.createObjectURL(stream);
        videoElement.play();
    }

    function errorCallback(error){
        console.log("navigator.getUserMedia error: ", error);
    }

    function start(){
        // Kill the old stream, if there is one
        if (!!videoStream) {
            videoElement.src = null;
            videoStream.stop();
        }

        // Get the video source
        var videoSource = videoSelect.value;
        var constraints = {
            video: {
                optional: [{
                    sourceId: videoSource
                }]
            }
        };

        // Ask for access
        navigator.getUserMedia(constraints, successCallback, errorCallback);
    }

    // Allow the user to change the video source
    videoSelect.onchange = start;

    if (navigator.getUserMedia) {
        start();
    } else {
        alert("Native web camera streaming is not supported in this browser!");
    };


    var webSocket;

    // Connect to the broadcasting server
    if('WebSocket' in window) {
        webSocket = new WebSocket('ws://localhost:3001/');
        webSocket.onopen = function () {
            log('connected');
        };

        webSocket.onclose = function () {
            log('socket closed');
        };

        webSocket.onerror = function (evt) {
            log('<span style="color: red;">ERROR:</span> ' + evt.data);
        };
    } else {
        alert('web sockets not supported');
    }

    function send(msg){
        if (!!webSocket && webSocket.readyState === 1) {
            webSocket.send(msg);
        }
    }

    var width = 600,
        height = 450,
        fps = 10,
        interval = 1000 / fps
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;


    function streamSnapshot() {
        // First, draw the current video snapshot into the canvas
        context.drawImage(videoElement, 0, 0, width, height);

        // Grab the pixel data from the backing canvas
        var stringData = canvas.toDataURL();

        // send it on the wire
        send(stringData);
    }

    setInterval(streamSnapshot, interval);

});
