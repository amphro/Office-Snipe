var HID = require('node-hid');

// The hexadecimal commands for the missle launcher USB interface
var Commands = {
    DOWN    : 0x01,
    UP      : 0x02,
    LEFT    : 0x04,
    RIGHT   : 0x08,
    FIRE    : 0x10,
    STOP    : 0x20
};

var Launcher = function() {
    var devices = HID.devices();
    var path = null;

    for (var i = 0; i < devices.length; i++) {
        var device = devices[i];

        if (this.isUsbMissileLauncher(device)) {
            path = device.path;
            console.log('Found launcher with path ' + path);
        }
    }

    if (!path) {
        throw new Error('No launcher found');
    }

    this.device = new HID.HID(path);
}

Launcher.prototype.PRODUCT_ID = 0x1010;
Launcher.prototype.VENDOR_ID = 0x2123;
Launcher.prototype.PRODUCT_NAME = 'USB Missile Launcher';

Launcher.prototype.isUsbMissileLauncher = function isUsbMissileLauncher(usbDevice) {
    return usbDevice.productId === this.PRODUCT_ID ||
        usbDevice.vendorId === this.VENDOR_ID ||
        // As a last resort, use the product name. This is usually undefined on linux.
        usbDevice.product === this.PRODUCT_NAME;
}

Launcher.prototype.led = function led(on) {
    var ON = 0x01, OFF = 0x00;
    this.device.write([0x03, on ? ON : OFF, 0x00,0x00,0x00,0x00,0x00,0x00]);
}

Launcher.prototype.sendCommand = function sendCommand(cmd) {
    if (typeof cmd === 'string') {
        cmd = Commands[cmd.toUpperCase()];
    }
    if (typeof cmd === 'number') {
        this.device.write([0x02, cmd, 0x00,0x00,0x00,0x00,0x00,0x00]);
    } else {
        throw new Error("Command doesn't exist: " + cmd);
    }
}

module.exports = Launcher;
