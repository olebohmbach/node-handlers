const fs = require('fs');
const chalk = require('chalk');
module.exports = {

    dc: {
        commands: async (path, client) => {

            //Command Handler:
            const commandFolders = fs.readdirSync(path);
            for (const folder of commandFolders) {
                var isd = fs.statSync(`${path}/${folder}`)
                if (isd.isDirectory()) {
                    commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'))
                } else {
                    commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'))
                }
                for (let file of commandFiles) {
                    if (folder == file) {
                        cmd = file

                    } else {
                        cmd = `${folder}/${file}`
                    }
                    const command = require(`../../${path}/${cmd}`);

                    if (command.name) {
                        client.commands.push(command.name, command);
                        console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Loaded Command: `) + chalk.yellow(command.name));
                    } else {
                        console.log(chalk.cyan(`[Commands]`) + chalk.red(` ${cmd} has no name. `))
                    }



                }
            }
        },
        functions: async (path, client) => {
            const functions = fs.readdirSync(path);

            for (const folder of functions) {
                const functionFiles = fs.readdirSync(`../../${path}/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of functionFiles) {
                    const funcion = require(`${path}/${folder}/${file}`)
                    console.log(chalk.cyan(`[Functions]`) + chalk.cyan(` Loaded Function: `) + chalk.yellow(file));
                }
            }
        },

        events: async (path, client) => {
            //Command Handler:
            const eventFolders = fs.readdirSync(path);
            for (const folder of eventFolders) {
                var isd = fs.statSync(`${path}/${folder}`)
                if (isd.isDirectory()) {
                    eventFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'))
                } else {
                    eventFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'))
                }
                for (let file of eventFiles) {
                    if (folder == file) {
                        ev = file

                    } else {
                        ev = `${folder}/${file}`
                    }
                    const event = require(`../../${path}/${ev}`);
                    if (event.name) {
                        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
                        else client.on(event.name, (...args) => event.execute(...args, client));
                        console.log(chalk.cyan(`[Events]`) + chalk.cyan(` Loaded Event: `) + chalk.yellow(event.name));
                    } else {
                        console.log(chalk.cyan(`[Events]`) + chalk.red(` ${ev} has no name. `))
                    }


                }
            }
        },
    }
}