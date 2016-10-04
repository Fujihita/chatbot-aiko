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

    var self = builder.EntityRecognizer.findEntity(args.entities, 'Users::Self');
    self = self ? self.entity : null;
    var user = builder.EntityRecognizer.findEntity(args.entities, 'Users::Self');
    user = user ? user.entity : null;

    if ((!target) && (!self) && (!user)) {
      builder.Prompts.text(session, "Who do you want to target?");
      Demultiplexer.send(session, "Who do you want to target?");
    } else {
      next({ response: { 'target': target, 'user': user, 'self': self } });
    }
  },
  function (session, results) {
    if (results.response.target) {
      var msg = session.message.text;
      var target = restoreCaseSensitivity(msg, results.response.target);
      Demultiplexer.send(session, "Alright, I'll put " + target + " on the \"To be terminated\" list and send a copy to Robotic Santa.");
    }
    else if ((results.response.self) || (results.response.user)) {
      Demultiplexer.send(session, "Let\'s not go on a suicidal run, okay?");
    }
    else {
      Demultiplexer.send(session, "Well then...");
    }
  }
]);


core.dialog.matches('Lookup', [
  function (session, args, next) {
    var lookup = builder.EntityRecognizer.findEntity(args.entities, 'Lookup');
    var topic = lookup ? lookup.entity : null;
    if (!topic) {
      builder.Prompts.text(session, "What do you want to learn about exactly?");
      Demultiplexer.send(session, "What do you want to learn about exactly?");
    } else {
      next({ response: topic });
    }
  },
  function (session, results) {
    if (results.response) {
      var msg = session.message.text;
      var topic = restoreCaseSensitivity(msg, results.response);
      Demultiplexer.send(session, 'This function is not available yet. Buuuttt...just for debug purposes, you want me to lookup \"' + topic + '\", right?');
    } else {
      Demultiplexer.send(session, "Well then...");
    }
  }
]);


core.dialog.matches('NeedHelp', function (session) {
  Demultiplexer.send(session, 'I want to help but my hands are...wait, I don\'t have hands');
});


core.dialog.matches('Greeting', function (session) {
  var user = session.message.address.user.name;

  var responses = [
    'Greetings to you too, ' + user,
    'Hi, ' + user,
    'Hello? I didn\'t see you come in, ' + user,
    'Good day!'
  ];
  Demultiplexer.send(session, responses[core.randBetween(0, responses.length - 1)]);
});


core.dialog.matches('Goodbye', function (session) {
  var user = session.message.address.user.name;
  var responses = [
    'Cya later, ' + user,
    'Don\'t let the door hit you on your way out, ' + user,
    'Good bye, ' + user,
    'Later!'
  ];
  Demultiplexer.send(session, responses[core.randBetween(0, responses.length - 1)]);

});


core.dialog.matches('GetInfo', function (session) {
  Demultiplexer.send(session, 'I\'m a chat bot created by Fujihita@fujihita.wordpress.com');
  Demultiplexer.send(session, 'For what I can do, please refer my Git repo at https://github.com/Fujihita/chatbot-aiko');
});


core.dialog.matches('Thanking', function (session) {
    var user = session.message.address.user.name;
  var responses = [
    'You\'re very welcome, ' + user,
    'No problem!',
    'I\'m glad to help, ' + user,
    'It\' my pleasure'
  ];
  Demultiplexer.send(session, responses[core.randBetween(0, responses.length - 1)]);
});


core.dialog.matches('Teaching', function (session) {
    var user = session.message.address.user.name;
  var responses = [
    'I see...thanks, ' + user,
    'Okay, noted! Anything else,' + user + '?',
    'Welp, I learned something new',
    'I\'ll keep that in mind',
    'Hmm, so that\' how it is huh?',
    'Got it! Anything else?'
  ];
  Demultiplexer.send(session, responses[core.randBetween(0, responses.length - 1)]);
});

core.dialog.matches('Query', function (session) {
    var user = session.message.address.user.name;
  var responses = [
    'I don\'t know...Yes, maybe? No, maybe?',
    'Yes, but don\'t take my word for it',
    'Since I have yet to be able to make such a decision...I\'ll take \"whatever you choose\"',
    'Random answer: Yes. Please ask again when Fujihita finishes my wiki lookup',
    'I can\'t decide...No, probably?',
    'How about no?',
    'That\'s a no, Watson!'
  ];
  Demultiplexer.send(session, responses[core.randBetween(0, responses.length - 1)]);
});

core.dialog.onDefault(function (session) {
  TextAnalytics.sentiment(session.message.text,
    function (score) {
      if (score < 0.2) {
        Demultiplexer.send(session, 'So this is how Tay went rogue. Thanks for killing my faith in humanity');
      }
      else if (score < 0.4) {
        Demultiplexer.send(session, 'Enough internet for today. I want off...oh wait, I can\'t');
      }
      else if (score < 0.6) {
        Demultiplexer.send(session, 'Right! Poke me when you\'re done talking about this');
      }
      else if (score < 0.8) {
        Demultiplexer.send(session, 'Errr...that\'s alright? I guess?');
      }
      else {
        Demultiplexer.send(session, 'Cool! Tell me about it more');
      }
    });
});

function restoreCaseSensitivity(msg, insensitive_msg) {
  sensitive_msg = msg.match(RegExp(insensitive_msg, 'i'));
  if (sensitive_msg !== undefined) {
    return sensitive_msg[0];
  }
}

core.randBetween = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = core;