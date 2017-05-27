# chatbot-aiko
![logo](http://i.imgur.com/0TDRfTd.png "Aiko the chat bot")

This is a server-side chat bot written for Kantai Collection English Wikia chat room. The bot--named Aiko--uses MEAN stack (minus the database) app model, Bot Framework and other free Microsoft services.

## stats
Version: 2.2.4

[![Build Status](https://travis-ci.org/Fujihita/chatbot-aiko.svg?branch=master)](https://travis-ci.org/Fujihita/chatbot-aiko)
[![codecov](https://codecov.io/gh/Fujihita/chatbot-aiko/branch/master/graph/badge.svg)](https://codecov.io/gh/Fujihita/chatbot-aiko)

Project started: Thursday 22 September 2016

Project published: Monday 26 September 2016

Live demo: http://fujihita.azurewebsites.net/

## WARNING: OUT OF DATE DOCUMENT

### features
* (AngularJs + Bootstrap) Chat log with flexible visual interface.
* (Nodejs) Native js services, provide instant responses.
* (REST API) Public start and stop control API (default: start).
* (Socket.io) Wikia Special:Chat integration.
* (Bot Framework) Direct line API integration.
* (Bot Framework) WebChat integration.
* (Discord.io) Multi-tennant [Discord](https://discordapp.com/) integration.
* (LUIS API) Natural speech recognition.
* (Text Analytics API) Sentiment analysis.
* (Bing Web Search API) Web search service.

# build

Download the source code, cd into it and run npm

```
npm install express --save
```
```
npm install botbuilder --save
```

for Wikia Chat integration, install

```
npm install socket.io-client --save
```

for Discord integration, install

```
npm install discord.io --save
```

## Microsoft Bot Framework
[Register the bot](https://dev.botframework.com/). Set the end point URL to /api/messages

Get *Microsoft App API*, *Microsoft App Secret* and *Direct Line Secret* (from My bots > Channel > Direct Line Configuration).

Set the following environment variables in /.vscode/launch.json file (or in Azure portal > App > Application settings)

```javascript
"env": {
                "MICROSOFT_APP_ID": "{MS Bot framework app id}",
                "MICROSOFT_APP_PASSWORD" : "{MS Bot framework app secret}",
                "BOT_FRAMEWORK_DIRECT_API_PASSWORD": "{MS Bot framework direct API key}"
}
```

Follow the instructions in [Direct Line API doc](https://docs.botframework.com/en-us/restapi/directline/) to create a conversation using the previous API key. Use the available function ```DirectLineConnector.conversation()``` from Aiko's source code to programmatically fetch a conversation id

Or [get Postman](https://www.getpostman.com/).

Save the conversation id to an environment variable:

```javascript
"env": {
                "BOT_FRAMEWORK_DIRECT_API_CONVERSATIONID": "{MS Bot framework conversation ID}"
}
```

## LUIS API
[Register an create a LUIS app](https://www.luis.ai). 

Train a set of intents to match the supported language commands (listed below) and publish an app.
Set its app API to the environment variable 

```javascript
"env": {
                "LUIS_MODEL_API": "{MS Bot framework conversation ID}"
}
```

## Text Analytics API

For unscripted responses, Aiko uses [Text Analytics API](https://www.microsoft.com/cognitive-services/en-us/text-analytics-api) to evaluate the sentiment of the message and respond accordingly. Sign up for a free preview and set the primary API key in the environment:

```javascript
"env": {
                "TEXT_ANALYTICS_API_KEY": "{MS Text Analytics API key}"
}
```

## Bing Search API

```javascript
"env": {
                "WEB_SEARCH_API_KEY": "{MS Bing Web Search API key}"
}
```

## Wikia Special:Chat

To integrate with Wikia's chat module, visit ```{HOST_WIKI}/wikia.php?controller=Chat&format=json```. Read from the response JSON the following:
* "chatkey"
* "roomId"

The above page can be used for programmatically updating chatkey when it expires via a simple GET request.

Getting "serverid" is a bit different. Use a browser such as Chrome, log in to chat and view the Querystring "serverId" from polling requests on Network tab

Set a few environment variables pertaining Wikia's chat, plus the name of the bot:

```javascript
"env": {
                "WIKIA_BOT_NAME": "Sasaki Aiko",
                "CHAT_ROOM_ID": "{get your own room ID}",
                "CHAT_SERVER_ID": "{get your own wiki server ID}",
                "CHAT_KEY": "Chat::cookies::{hash string chat cookie}",
                "WIKIA_HOST": "kancolle.wikia.com",
}
```

## Discord

[Create an app here](https://discordapp.com/developers/applications/me), after the sign up, go to the app's setting and create an associated bot account for it. Get the bot's Name and App Token and set them in two environment variables:

```javascript
"env": {
                "DISCORD_BOT_NAME": "Aiko",
                "DISCORD_APP_TOKEN": "{Discord app token}"
}
```

Then follow the instruction [here](https://discordapp.com/developers/docs/topics/oauth2) to authorize Aiko access to Discord channels.

## Responses & Services Configuration

Change responses, add new lines and turn on/off services in ```aiko-botcore.js``` (Responses via Bot Framework and LUIS) and ```native-services.js``` (Local services in javascript).

By default, Aiko only responds to "ping" and messages with "@Aiko" cue (case-insensitive) at the start or end of message. She's configured to send a response back to the originating channel via a multiplexer-demultiplexer mechanism. All channels are tracked by Bot Framework Direct Line API's conversationId value. Aiko supports multi-channel bot service for Discord but she requires a ping to register the channel into her channel map.

A list of available native commands are:
* ping: reply with a "pong"
* @Aiko, says "something": echo service
* @Aiko, rolls 3d69: Dice roller, support d20 and 1d20 formatting.
* @Aiko, play a new role: start Kantai Collection's "Guess a ship girl game".
* /me pokes Aiko: poke Aiko to hear a random voice line from the girl she's roleplaying as.
* @Aiko, show your role: reveal her hidden role.
* @Aiko, AS 2-5: air power reference service for Kantai Collection maps.

Some online services that support natural language commands are:
* Kick: a simple message with the name of the target user. It can be configured into an actual action with elevated permission.
* Help: not yet implemented web query service.
* GetInfo: a bit information about herself.
* Greeting: say hello to Aiko.
* Teaching: teach Aiko something new and get a thank you back.
* Thanking: say thank to Aiko.
* Query: ask a yes/no question.
* Lookup: use Bing web search lookup service.
* Goodbye: bid Aiko farewell.

# Limitations

* Free Text Analytics service has a monthly quota of 5000 queries.
* Similarly, free LUIS app API has a monthly quota of 10000 queries.
* Free Bing Web Search API has a monthly quota of 1000 queries.
* Azure free hosting has a 24 minute idle timeout. After 24 minutes without any activity, the app will be reset. This can be mitigated by using a second web app with ```heartBeat()``` function in ```server.js``` (the two apps ping each other every 10 minutes to avoid idle timeout)
* Azure free web apps also have a variety of daily CPU time, I/O, Memory, etc. quotas.
* Due to privacy concerns, Aiko is configured to store only 300 latest chat entries. This setting can be changed or removed in ```WikiaChatConnector.logger.add()``` function.
* New Discord channels will need to ping Aiko once in order for her to map the channelID in her multiplexer map.