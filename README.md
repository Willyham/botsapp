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
var process = require('process');

var yourBot = new Botsapp.Bot({
  adapter: {
    msisdn: '123456789', // phone number with country code
    username: 'YourBot', // your name on WhatsApp
    password: 'asdfghjkl', // WhatsApp password
    ccode: '44' // country code
  }
});

// Register a handler which logs every message
var anyMessage = new Botsapp.Trigger().always();
beanBot.registerTrigger(anyMessage, function onTrigger(event) {
  console.log(event);
});

// Get a thumbsup, give a thumbsup
var thumbsupEmoji = new Buffer([240, 159, 145, 141]);
var thumbsUp = new Botsapp.Trigger().withEmoji(thumbsupEmoji);

yourBot.registerTrigger(thumbsUp, function onTrigger(event) {
  var emoji = thumbsupEmoji.toString('utf8');

  yourBot.sendMessage(event.from, emoji, function onSend() {
    console.log('Sent emoji to', event.from);
  });
});

// Get hello from a specific user
var author = '123456789@s.whatsapp.net';
var helloFromMe = new Botsapp.Trigger()
  .from(author)
  .withText('hello');

beanBot.registerTrigger(helloFromMe, function onTrigger(event) {
  console.log('Got hello from', author, event.body);
});

// Connect to the server
beanBot.connect(function() {
  console.log("I'm alive!");
});

beanBot.on('error', function gracefulShutdown() {
  beanBot.destroy();
  process.exit(1);
});
```

## API

There are two exports; `Bot` and `Trigger`. Make an isntance of Bot to establish a connection.
The bot provides methods to register actions and to interact with WhatsApp. Currently, only
sending a message (to a user or group) is supported.

Triggers are sets of conditions which trigger functions when all (default) or any of those conditions are met.
Triggers can be arbitrarily constructed with a chain.

Matching any conditions:

```js
var someWords = new Trigger({
 mode: 'any',
}).withText('foo').withText('bar')
```

Matching all conditions:

```js
var helloInGroup = new Trigger()
 .withText('hello')
 .inGroup()
```

Full API description:

```ocaml

Bot(options: Object) => {
  connect: (callback: Function) => void,
  destroy: () => void,
  registerTrigger: (trigger: Trigger, handler: Function, callback: Function) => void,
  sendMessage: (recipient: String, text: String, callback: Function) => void,
}

Trigger(options: Object) => {
  matches: (event: Object) => Boolean,
  always: () => Trigger,
  withText: (text: String, options: Object) => Trigger,
  withEmoji: (emoji: Buffer) => Trigger,
  from: (author: String) => Trigger,
  inGroup: (options: Object) => Trigger,
  custom: (predicate: (event: Object) => Boolean) => Trigger
}

```


