var Service;
var Characteristic;
var HomebridgeAPI;

var gpio = require("rpi-gpio");

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    HomebridgeAPI = homebridge;

    homebridge.registerAccessory("homebridge-doorbell",
        "DOORBELL", Doorbell);
};

function Doorbell(log, config) {
    this.log = log;
    this.name = config.name;
    this.pin = conig.pin;
    this.reset = config.reset || 4500;
    this.timeout = null;
    this.bellDetected = false;

    var that = this;

    gpio.setup(this.pin, gpio.DIR_IN, gpio.EDGE_RISING, function (err) {
        if (err != undefined) {
            that.log("Error setting up gpio pin: " + that.pin);
            that.log(err);
        }

        that.log("GPIO setup completed");

        gpio.on("change", function (channel, val) {
            that.gpioChange(that, channel, val);
        });
    });

    this.informationService = new Service.AccessoryInformation();
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, "Quhwa")
        .setCharacteristic(Characteristic.Model, "QH-09BCE")
        .setCharacteristic(Characteristic.SerialNumber, "122334455");

    this.service = new Service.MotionSensor(this.name);
    this.service.getCharacteristic(Characteristic.MotionDetected)
        .on('get', this.getState.bind(this));
}

Doorbell.prototype.getState = function (callback) {
    callback(null, this.bellDetected);
};

Doorbell.prototype.gpioChange = function (that, channel, val) {
    if (!that.bellDetected) {
        that.bellDetected = true;
        that.log("Got GPIO rising edge event");

        that.service.getCharacteristic(Characteristic.MotionDetected)
            .updateValue(that.bellDetected, null, "gpioChange");

        if (that.timeout) clearTimeout(that.timeout);

        that.timeout = setTimeout(function () {
            that.log("Resetting gpio change event throttle flag");
            that.bellDetected = false;

            that.service.getCharacteristic(Characteristic.MotionDetected)
                .updateValue(that.bellDetected, null, "gpioChange");

            that.timeout = null;
        }, that.reset);
    }
};

Doorbell.prototype.getServices = function () {
    return [this.informationService, this.service];
};