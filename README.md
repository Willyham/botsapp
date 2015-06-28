# botsapp
A WhatsApp bot framework in Node

Botsapp is simple framework for creating WhatsApp bots (using the awesome [whatsapi](https://github.com/hidespb/node-whatsapi) project).

## Disclaimer

I know. I'm sorry. I really hope this doesn't end up powering lots of annoying WhatsApp bots, but I needed this for a personal project. 

Be warned that there are plenty of reports of people getting their number banned from WhatsApp when using anything other than the official clients. *Using this code may result in your account being banned*. The bot will attempt to follow the protocol as closely as possible to avoid that, but this is based on annecdotal evidence rather than watching network traffic (as that is against the WhatsApp terms and conditions).

## Install

`npm install --save botsapp`
  
## Usage

```js
'use strict';

var Botsapp = require('botsapp');

var yourBot = new Botsapp.Bot({
  adapter: {
    msisdn: '123456789', // phone number with country code
    username: 'YourBot', // your name on WhatsApp
    password: 'asdfghjkl', // WhatsApp password
    ccode: '44' // country code
  }
});

var testTrigger = new Botsapp.Triggers.TextTrigger('Hello');

yourBot.registerAction(testTrigger, function onTrigger(event) {
  console.log('Received matching message', event);
});

yourBot.connect(function() {
  console.log("I'm alive!");
});
```

This will setup a simple bot which will log any message which contains the string 'hello'.
