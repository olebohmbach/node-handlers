const fs = require('fs');
const chalk = require('chalk');
module.exports = {



    dc: {
        commands: async (path, client) => {

            //Command Handler:
            const commandFolders = fs.readdirSync(path);
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`${path}/${folder}/${file}`);
                    client.commands.set(command.name, command);
                    console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Loaded Command: `) + chalk.yellow(command.name));
                }
            }
        },
        functions: async (path, client) => {
            const functions = fs.readdirSync(path);

            for (const folder of functions) {
                const functionFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of functionFiles) {
                    const funcion = require(`${path}/${folder}/${file}`)
                    console.log(chalk.cyan(`[Functions]`) + chalk.cyan(` Loaded Function: `) + chalk.yellow(file));
                }
            }
        },


        events: async (path, client) => {
            const events = fs.readdirSync(path);
            for (const folder of events) {
                const eventFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of eventFiles) {
                    const event = require(`${path}/${folder}/${file}`);
                    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
                    else client.on(event.name, (...args) => event.execute(...args, client));
                    console.log(chalk.cyan(`[Events]`) + chalk.cyan(` Loaded Event: `) + chalk.yellow(event.name));
                }
            }
        }
    }
}