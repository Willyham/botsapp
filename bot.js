'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var whatsapi = require('whatsapi');

var Dispatcher = require('./lib/dispatcher');
var Errors = require('./lib/errors');

function Bot(options) {
  var self = this;
  options = options || {};
  options.adapter = options.adapter || {};

  if (!options.adapter.msisdn) {
    throw Errors.InvalidArgumentError({
      argument: 'adapter.msisdn',
      given: options.adapter.msisdn,
      expected: 'String'
    });
  }
  if (!options.adapter.password) {
    throw Errors.InvalidArgumentError({
      argument: 'adapter.password',
      given: options.adapterpassword,
      expected: 'String'
    });
  }
  if (!options.adapter.ccode) {
    throw Errors.InvalidArgumentError({
      argument: 'adapter.ccode',
      given: options.adapter.ccode,
      expected: 'String'
    });
  }

  this.adapter = whatsapi.createAdapter(options.adapter);
  this.adapter.on('error', function reportError(err) {
    self.emit('error', err);
  });

  // Setup bot state
  this.contacts = [];
  this.serverProperties = {};

  // Add listeners
  this.dispatcher = new Dispatcher();

  this._events = [
    'receivedMessage',
    'receivedLocation',
    'receivedImage',
    'receivedVideo',
    'receivedAudio',
    'receivedVcard'
  ];
  this._events.forEach(function register(event) {
    self.adapter.on(event, self.dispatcher.dispatchEvent);
  });
}

util.inherits(Bot, EventEmitter);

Bot.prototype.connect = function connect(callback) {
  var self = this;

  function onLogin(err) {
    if (err) {
      callback(Errors.ConnectionError(err));
      return;
    }
    // Simulate official clients by requesting properties
    self.adapter.requestServerProperties(function onProps(props) {
      self.serverProperties = props;
    });
    self.adapter.sendIsOnline();
    callback(null);
  }

  this.adapter.connect(function onConnect(err) {
    if (err) {
      callback(Errors.ConnectionError(err));
      return;
    }
    self.adapter.login(onLogin);
  });
};

Bot.prototype.registerAction = function registerAction(trigger, action, context) {
  this.dispatcher.registerAction(trigger, action, context);
};

Bot.prototype.destroy = function destroy() {
  var self = this;
  this._events.forEach(function register(event) {
    self.adapter.off(event, self.dispatcher.dispatchEvent);
  });
  this.adapter.sendIsOffline();
  this.adapter.disconnect();
};

module.exports = Bot;
