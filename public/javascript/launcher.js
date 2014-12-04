$(document).ready(function () {
    var socket = io();
    // Keep track of whether we are firing a missile so the user can't overload
    // the launcher with fire
    var firing = false;

    function sendCommand(evt) {
        socket.emit('command', evt.target.id);
    }

    function stop(evt) {
        socket.emit('command', 'stop');
    }

    function addListeners(button) {
        button.on('mousedown', sendCommand);

        // We need to tell the launcher to stop moving. Do this when it lifts up.
        button.on('mouseup', stop);
    }

    function fire() {
        if (!firing) {
            // Show the firing UI
            firing = true;
            var div = $('<div />').appendTo('body');
            div.attr('class', 'firing');
            div.text("Fire!");

            // Actually fire the missile
            socket.emit('command', 'fire');

            // Remove the div after 2 seconds
            setTimeout(function() {
                firing = false;
                div.remove();
            }, 2000);
        }
    }

    // Add mouse controls
    addListeners($('#left'));
    addListeners($('#right'));
    addListeners($('#up'));
    addListeners($('#down'));

    $('#fire').on('mousedown', fire);

    // Add keyboard controlls
    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
            socket.emit('command', 'left');
            break;

            case 38: // up
            socket.emit('command', 'up');
            break;

            case 39: // right
            socket.emit('command', 'right');
            break;

            case 40: // down
            socket.emit('command', 'down');
            break;

            case 32: // space
            fire();
            break;

            default: return;
        }
        e.preventDefault();
    });

    // We have to tell the launcher to stop moving
    $(document).keyup(function(e) {
        if (e.which !== 32) {
            stop();
        }
    });
});
