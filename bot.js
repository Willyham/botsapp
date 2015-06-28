'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var timers = require('timers');

var whatsapi = require('whatsapi');

var Dispatcher = require('./lib/dispatcher');
var Errors = require('./lib/errors');
var createDelay = require('./lib/type-delay');

/**
 * Create an instance of a Bot
 * @param {Object} options
 * @param {Object} options.adapter whatsapi adapter options
 * @param {String} options.adapter.msisdn msisdn number
 * @param {String} options.adapter.password password
 * @param {String} options.adapter.ccode country code
 * @param {String} [options.adapter.username] Whatsapp username
 * @constructor
 */
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
  this.dispatcher = options.dispatcher || new Dispatcher();

  this._events = [
    'receivedMessage',
    'receivedLocation',
    'receivedImage',
    'receivedVideo',
    'receivedAudio',
    'receivedVcard'
  ];
  var dispatch = this.dispatcher.dispatchEvent.bind(this.dispatcher);
  this._events.forEach(function register(event) {
    self.adapter.on(event, dispatch);
  });
}

util.inherits(Bot, EventEmitter);

/**
 * Connect the bot to whatsapp servers
 * This function will connect, login, get server properties and set the online status
 * This attempts to mimic the official clients as closely as possible
 * @param {Function} callback function which is called when connected
 */
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

/**
 * Register an action for the bot
 * @param {Trigger} trigger The trigger to listen for
 * @param {Function} handler The function to run when the trigger matches
 * @param {Object} context Context to call the action with
 */
Bot.prototype.registerTrigger = function registerTrigger(trigger, handler, context) {
  this.dispatcher.registerTrigger(trigger, handler, context);
};

/**
 * Send a message with a delay.
 * Also set the typing state to imitate a real client
 * @param {String} recipient The recipient's id
 * @param {String} text The text to send
 * @param {Function} callback called when sent.
 */
Bot.prototype.sendMessage = function sendMessage(recipient, text, callback) {
  var self = this;
  this.adapter.sendComposingState(recipient);
  timers.setTimeout(function send() {
    self.adapter.sendPausedState(recipient);
    self.adapter.sendMessage(recipient, text, callback);
  }, createDelay(text));
};

/**
 * Destroy and cleanup the bot
 */
Bot.prototype.destroy = function destroy() {
  this._events.forEach(this.adapter.removeAllListeners);
  this.adapter.sendIsOffline();
  this.adapter.disconnect();
};

module.exports = Bot;
