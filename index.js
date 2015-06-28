var whatsapi = require('whatsapi');

var wa = whatsapi.createAdapter({
  msisdn: '447972224420', // phone number with country code
  username: '', // your name on WhatsApp
  password: 'xR1ThaAZs8xcaBNx4TZad5b3JaQ=', // WhatsApp password
  ccode: '44' // country code
});

wa.connect(function connected(err) {
  if (err) { console.log(err); return; }
  console.log('Connected');
  // Now login
  wa.login(logged);
});

function logged(err) {
  if (err) { console.log(err); return; }
  console.log('Logged in to WA server');
  wa.sendIsOnline();
}

wa.on('receivedMessage', function(message) {
  console.log(message);

  var sender = message.from.split('@')[0];

  //setTimeout(function(){
  //
  //  wa.sendComposingState(sender);
  //
  //  setTimeout(function() {
  //    wa.sendPausedState(sender);
  //
  //    wa.sendMessage(sender, 'Yo', function(err, id) {
  //      if (err) { console.log(err.message); return; }
  //      console.log('Server received message %s', id);
  //    });
  //
  //  }, 2230);
  //
  //
  //}, 7362);

});