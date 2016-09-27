var builder = require('botbuilder');
var TextAnalytics = require('./text-analytics-service.js');
var Demultiplexer = require('./channel-demultiplexer.js');

var core = {};

core.model = (process.env.LUIS_MODEL_API);
core.recognizer = new builder.LuisRecognizer(core.model);
core.dialog = new builder.IntentDialog({ recognizers: [core.recognizer] });
core.connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});
core.bot = new builder.UniversalBot(core.connector);
core.bot.dialog('/', core.dialog);

core.dialog.matches('Kick', [
  function (session, args, next) {
    var user = builder.EntityRecognizer.findEntity(args.entities, 'Users::Target');
    var target = user ? user.entity : null;
    if (!target) {
      builder.Prompts.text(session, "Who do you want to target?");
      Demultiplexer.send(session, "Who do you want to target?");
    } else {
      next({ response: target });
    }
  },
  function (session, results) {
    if (results.response) {
      var msg = session.message.text;
      var target = restoreCaseSensitivity(msg, results.response);
      Demultiplexer.send(session, "Alright, I'll put " + target + " on the \"To be terminated\" list and send a copy to Robotic Santa.");
      Demultiplexer.send(session, "Just in case he can get it done faster than I can");
    } else {
      //session.send("Well then...");
      Demultiplexer.send(session, "Well then...");
    }
  }
]);

core.dialog.matches('NeedHelp', function (session) {
  Demultiplexer.send(session, 'I want to help but my hands are...wait, I don\'t have hands');
});
core.dialog.matches('Greeting', function (session) {
  var user = session.message.address.user.name;
  var rand = Math.floor(Math.random() * 4) + 1;
  switch (rand) {
    case 1: {
      Demultiplexer.send(session, 'Greetings to you too, ' + user);
      break;
    }
    case 2: {
      Demultiplexer.send(session, 'Hi, ' + user);
      break;
    }
    case 3: {
      Demultiplexer.send(session, 'Hello? I didn\'t see you come in, ' + user);
      break;
    }
    case 4: {
      Demultiplexer.send(session, 'Good day!');
      break;
    }
  }
});
core.dialog.matches('Goodbye', function (session) {
  var user = session.message.address.user.name;
  var rand = Math.floor(Math.random() * 4) + 1;
  switch (rand) {
    case 1: {
      Demultiplexer.send(session, 'Cya later, ' + user);
      break;
    }
    case 2: {
      Demultiplexer.send(session, 'Don\'t let the door hit you on your way out, ' + user);
      break;
    }
    case 3: {
      Demultiplexer.send(session, 'Good bye, ' + user);
      break;
    }
    case 4: {
      Demultiplexer.send(session, 'Later!');
      break;
    }
  }
});
core.dialog.matches('GetInfo', function (session) {
  Demultiplexer.send(session, 'I\'m a chat bot created by Fujihita at Kantai Collection English Wikia');
  Demultiplexer.send(session, 'As for my logs, they are at: http://fujihita.azurewebsites.net/');
});

core.dialog.onDefault(function (session) {
  //session.message.address.user.name
  TextAnalytics.sentiment(session.message.text,
    function (score) {
      if (score < 0.2) {
        Demultiplexer.send(session, 'I sometimes think about the future, I believe this is one of the moments I have to consider leaving humanity alone.');
      }
      else if (score < 0.4) {
        Demultiplexer.send(session, 'Let me think about that for a second...');
        Demultiplexer.send(session, 'Yeah...That\'s still a big no! I\'m tempted but no');
      }
      else if (score < 0.6) {
        Demultiplexer.send(session, 'How about no? Kinda meh and I\'m not interested');
      }
      else if (score < 0.8) {
        Demultiplexer.send(session, 'Errr...okay? You don\'t say');
      }
      else {
        Demultiplexer.send(session, 'Yes, it\'s cool. Tell me about it more');
      }
    });
});

function restoreCaseSensitivity(msg, insensitive_msg) {
  sensitive_msg = msg.match(RegExp(insensitive_msg, 'i'));
  if (sensitive_msg !== undefined) {
    return sensitive_msg[0];
  }
}

module.exports = core;