var builder = require('botbuilder');
var TextAnalytics = require('./text-analytics-service.js');
var WebSearch = require('./web-search-service.js');

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
    var target = builder.EntityRecognizer.findEntity(args.entities, 'Users::Target');
    target = target ? target.entity : null;

    var self = builder.EntityRecognizer.findEntity(args.entities, 'Users::Self');
    self = self ? self.entity : null;
    var user = builder.EntityRecognizer.findEntity(args.entities, 'Users::Self');
    user = user ? user.entity : null;

    if ((!target) && (!self) && (!user)) {
      builder.Prompts.text(session, "Who do you want to target?");
      send(session, "Who do you want to target?");
    } else {
      next({ response: { 'target': target, 'user': user, 'self': self } });
    }
  },
  function (session, results) {
    if (results.response.target) {
      var msg = session.message.text;
      var target = restoreCaseSensitivity(msg, results.response.target);
      send(session, "Alright, I'll put " + target + " on the \"To be terminated\" list and send a copy to Robotic Santa.");
    }
    else if ((results.response.self) || (results.response.user)) {
      send(session, "Let\'s not go on a suicidal run, okay?");
    }
    else {
      send(session, "Well then...");
    }
  }
]);


core.dialog.matches('Lookup', [
  function (session, args, next) {
    var lookup = builder.EntityRecognizer.findEntity(args.entities, 'Lookup');
    var topic = lookup ? lookup.entity : null;
    if (!topic) {
      builder.Prompts.text(session, "What do you want to learn about exactly?");
      send(session, "What do you want to learn about exactly?");
    } else {
      next({ response: topic });
    }
  },
  function (session, results) {
    if (results.response) {
      var msg = session.message.text;
      var topic = restoreCaseSensitivity(msg, results.response);
      send(session, 'Looking up ' + topic + '...please wait');
      WebSearch.lookup(topic,
        function (snippet) {
          console.log(snippet);
          send(session, snippet);
        });
    }
    else {
      send(session, "Well then...");
    }
  }
]);


core.dialog.matches('NeedHelp', function (session) {
  send(session, 'I want to help but my hands are...wait, I don\'t have hands');
});


core.dialog.matches('Greeting', function (session) {
  var user = session.message.user.id;
  var responses = [
    'Greetings to you too, ' + user,
    'Hi, ' + user,
    'Hello, ' + user,
    'Good day!'
  ];
  send(session, responses[core.randBetween(0, responses.length - 1)]);
});


core.dialog.matches('Goodbye', function (session) {
  var user = session.message.user.id;
  var responses = [
    'Cya later, ' + user,
    'Don\'t let the door hit you on your way out, ' + user,
    'Good bye, ' + user,
    'Later!'
  ];
  send(session, responses[core.randBetween(0, responses.length - 1)]);

});


core.dialog.matches('GetInfo', function (session) {
  send(session, 'I\'m a chat bot created by Fujihita@fujihita.wordpress.com');
  send(session, 'For what I can do, please refer my Git repo at https://github.com/Fujihita/chatbot-aiko');
});


core.dialog.matches('Thanking', function (session) {
  var user = session.message.user.id;
  var responses = [
    'You\'re very welcome, ' + user,
    'No problem!',
    'I\'m glad to help, ' + user,
    'It\' my pleasure'
  ];
  send(session, responses[core.randBetween(0, responses.length - 1)]);
});


core.dialog.matches('Teaching', function (session) {
  var user = session.message.user.id;
  var responses = [
    'I see...thanks, ' + user,
    'Okay, noted! Anything else,' + user + '?',
    'Welp, I learned something new',
    'I\'ll keep that in mind',
    'Hmm, so that\' how it is huh?',
    'Got it! Anything else?'
  ];
  send(session, responses[core.randBetween(0, responses.length - 1)]);
});

core.dialog.matches('Query', function (session) {
  var responses = [
    'I don\'t know...Yes, maybe? No, maybe?',
    'Yes, but don\'t take my word for it',
    'Since I have yet to be able to make such a decision...I\'ll take \"whatever you choose\"',
    'Random answer: Yes. Please ask again when Fujihita finishes my wiki lookup',
    'I can\'t decide...No, probably?',
    'How about no?',
    'That\'s a no, Watson!'
  ];
  send(session, responses[core.randBetween(0, responses.length - 1)]);
});

core.dialog.onDefault(function (session) {
  TextAnalytics.sentiment(session.message.text,
    function (score) {
      if (score < 0.2) {
        send(session, 'So this is how Tay went rogue. Thanks for killing my faith in humanity');
      }
      else if (score < 0.4) {
        send(session, 'Enough internet for today. I want off...oh wait, I can\'t');
      }
      else if (score < 0.6) {
        send(session, 'I see');
      }
      else if (score < 0.8) {
        send(session, 'Errr...that\'s alright? I guess?');
      }
      else {
        send(session, 'Cool! Tell me about it more');
      }
    });
});

function restoreCaseSensitivity(msg, insensitive_msg) {
  var sensitive_msg = msg.match(RegExp(insensitive_msg, 'i'));
  if (sensitive_msg !== undefined) {
    return sensitive_msg[0];
  }
}

function send(session, message) {
  console.log("Bot sending messages");
  var id = session.message.address.conversation.id;
  var registry = include('/services/config/registry.js');
  registry[id].socket.send(message);
}

core.randBetween = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = core;