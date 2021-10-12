# Node Handlers
## About

Node Handlers is a [Node.js](https://nodejs.org) module that allows you to easily use Handlers in node.js!

At the moment there are only handlers for Discord bots, more will follow.

## Installation

**Node.js 16.6.0 or newer is required.**  

```sh-session
npm install node-handlers
```


## Example usage

Install all required dependencies:
```sh-session
npm install node-handlers

```

How to use the Discord Handlers:
```js
// Command Template
const Discord = require('discord.js');
module.exports = {
    name: "ping",
    description: "Show the Ping",
    async execute(message, args) {
        const Pinging = await message.channel.send(new Discord.MessageEmbed()
            .setTitle("> __**PING!**__")
            .setDescription(`**PONG! Latenz: ${Pinging.createdTimestamp - message.createdTimestamp}ms. | API Latenz: ${Math.round(message.client.ws.ping)}ms.**`)
            .setTimestamp()
            .setColor("GREEN")
            .setFooter("Ping Command"))
     }
}
```
```js
// Event Template
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
```

Afterwards we can create a quite simple example bot:
```js
const { Discord, Client, Intents} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const handlers = require('node-handlers');

client.commands = []

handlers.dc.functions('./functions', client)
handlers.dc.events('./events', client)
handlers.dc.commands('./commands', client)

client.login('token')
```

## Links

- [Support Discord server](https://dsc.gg/ole_is_live)
- [GitHub](https://github.com/Ole-is-live/node-handlers)
- [NPM](https://www.npmjs.com/package/node-handlers)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported, and check the
[documentation](https://www.npmjs.com/package/node-handlers).  

## Help

If you do not understand something in the documentation, if you have problems or you need support, then do not hesitate to join the official [Server](https://dsc.gg/ole_is_live).
