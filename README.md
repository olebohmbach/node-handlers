# Node Handlers
## About

Node Handlers is a [Node.js](https://nodejs.org) module that allows you to easily use Handlers in node.js!

At the moment there are only handlers for Discord Bots, more will follow.

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

## How to use the Discord Handlers:

### Example Directory Structure
#### This is an example structure for the example below
##### The files named in the example structure are under the example structure
```text
📦 path/to/directory
 ┣📂 commands
 ┃ ┣📂 help
 ┃ ┃ ┗📜 ping.js
 ┃ ┗📜 pong.js
 ┣📂 events
 ┃ ┣📂 interactions
 ┃ ┃ ┗📜 interactionCreate.js
 ┃ ┗📜 ready.js
 ┗📜 index.js
```
>**_Commands can either be placed directly in a folder (e.g. commands) or in a subfolder (e.g. commands/help) 
>in the folder. It's the same for the events: They can 
>either be placed directly in a folder (e.g. events) or in a subfolder (e.g. events/interactions) in the folder._**

### Command Template

```js
// Command Template (Normal Command, 'ping.js')
const Discord = require('discord.js');
module.exports = {
    name: "ping",
    description: "Replies with Pong",
    slash: false,
    async execute(message){
            
            const Pinging = new Discord.MessageEmbed()
            Pinging.setTitle("> __**PONG!**__")

            message.channel.send({embeds: [ Pinging ]});
    }
}
```
```js
// Command Template (Slash Command, 'pong.js')
const Discord = require('discord.js');
module.exports = {
    name: "pong",
    description: "Replies with Pong",
    slash: true,
    async execute(interaction){
            
            const Pinging = new Discord.MessageEmbed()
            Pinging.setTitle("> __**PONG!**__")

            interaction.reply({embeds: [ Pinging ]});
    }
}
```
### Event Template
```js
// Event Template (Runs when the bot is logged in, 'ready.js')
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
```
```js
// Event Template (Is needed to interact with slash commands, 'InteractionCreate.js')
module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (interaction.isCommand()) {
            
            const command = client.slashcmds.find(cmd => {
                return cmd.name === interaction.commandName
              })
    
            if (!command) return;
    
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
	},
};
```

Afterwards we can create a quite simple example bot with the Event and Command Handler:
```js
// This is the 'index.js' from the example structure
const { Discord, Client, Intents} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]});
const handlers = require('node-handlers');

handlers.dc.events('PATH TO EVENT FOLDER', client) // e.g. './events'
handlers.dc.commands('PATH TO COMMAND FOLDER', client) // e.g. './commands'

client.login('YOUR TOKEN') // Copy from your Application on https://discord.com/developers/applications
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
