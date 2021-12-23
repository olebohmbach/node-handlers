const fs = require('fs');
const chalk = require('chalk');

module.exports = {

    dc: { // All Handlers for Discord

        commands: async (path, client) => { // Command Handler
            const commands = []; // Create an array to store commands temporarily
            client.commands = [] // Create an array to store commands permanently
            client.slashcmds = [] // Create an array to store slash commands permanently

            //Command Handler: 
            const commandFolders = fs.readdirSync(path);
            for (const subfolder_file of commandFolders) {

                var isd = fs.statSync(`${path}/${subfolder_file}`)
                if (isd.isDirectory()) {
                    commands.push({
                        name: subfolder_file,
                        type: 'directory',
                        files: fs.readdirSync(`${path}/${subfolder_file}`)
                    })
                } else {
                    commands.push({
                        name: subfolder_file,
                        type: 'file',
                    })
                }
            }

            for (const command of commands) {

                if (command.type === 'directory') {
                    for (const file of command.files) {
                        const command_file = require(`${path}/${command.name}/${file}`);
                        if (command_file.name) {
                            if (command_file.slash) { // If Command is a Slash Command, then add it to the client (for-each guild)
                                client.slashcmds.push(command_file)
                                console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Loaded Slashcommand: `) + chalk.yellow(command_file.name) + chalk.cyan(` | Now Waiting for Publishing `));

                            } else { // If Command is not a Slash Command
                                client.commands.push(command_file.name, command_file);
                                console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Loaded Command: `) + chalk.yellow(command_file.name));
                            }

                        } else { // If Command not has a name, then it is not a command and is not loaded into the client 
                            console.log(chalk.cyan(`[Commands]`) + chalk.red(` ${cmd} has no name and was not loaded `))
                        }
                    }
                } else {
                    const command_file = require(`${path}/${command.name}`);
                    if (command_file.name) {
                        if (command_file.slash) { // If Command is a Slash Command, then add it to the client (for-each guild)
                            client.slashcmds.push(command_file)
                            console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Loaded Slashcommand: `) + chalk.yellow(command_file.name) + chalk.cyan(` | Now Waiting for Publishing `));

                        } else { // If Command is not a Slash Command
                            client.commands.push(command_file.name, command_file);
                            console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Loaded Command: `) + chalk.yellow(command_file.name));
                        }

                    } else { // If Command not has a name, then it is not a command and is not loaded into the client 
                        console.log(chalk.cyan(`[Commands]`) + chalk.red(` $No name and was not loaded `))

                    }
                }
            }

            setTimeout(async () => {
                await client.guilds.fetch()

                var progress = 0
                var failedguilds = 0
                var end = false
                await client.guilds.cache.forEach(async guild => {

                    try {
                        let commands = await guild.commands.set(client.slashcmds)
                        console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Published all Slashcommands for: `) + chalk.yellow(guild.name))


                    } catch (error) {

                        console.log(error.requestData)
                        failedguilds++
                        console.log(chalk.cyan(`[Commands]`) + chalk.red(` Failed to publish Slashcommands for ${guild.name} because ` + error))
                    } finally {
                        progress++
                        if (progress == client.guilds.cache.size) end = true
                    }
                })
                setTimeout(() => {
                    if (end && failedguilds == 0) {
                        console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Loaded all Slashcommands for ${client.guilds.cache.size} guilds `))
                    }
                    if (end && failedguilds > 0 && client.guilds.cache.size != failedguilds) {
                        console.log(chalk.cyan(`[Commands]`) + chalk.red(` Failed to publish Slashcommands for ${failedguilds} guilds. `))
                    } else if (end && failedguilds > 0 && client.guilds.cache.size == failedguilds) {
                        console.log(chalk.cyan(`[Commands]`) + chalk.red(` Failed to publish Slashcommands on all ${failedguilds} guilds. `))
                    }
                }, 1000)





            }, 5000)

        },



        events: async (path, client) => { // Event Handler

            const events = []; // Create an array to store events temporarily
            const eventFolders = fs.readdirSync(path);
            for (const subfolder_file of eventFolders) {

                var isd = fs.statSync(`${path}/${subfolder_file}`)
                if (isd.isDirectory()) {
                    events.push({
                        name: subfolder_file,
                        type: 'directory',
                        files: fs.readdirSync(`${path}/${subfolder_file}`)
                    })
                } else {
                    events.push({
                        name: subfolder_file,
                        type: 'file',
                    })
                }
            }

            for (const event of events) {

                if (event.type === 'directory') {
                    for (const file of event.files) {
                        const event_file = require(`${path}/${event.name}/${file}`);
                        if (event_file.name) {

                            if (event_file.once) client.once(event_file.name, (...args) => event_file.execute(...args, client));
                            else client.on(event_file.name, (...args) => event_file.execute(...args, client));
                            console.log(chalk.cyan(`[Events]`) + chalk.cyan(` Loaded Event: `) + chalk.yellow(event_file.name));


                        } else { // If Command not has a name, then it is not a command and is not loaded into the client 
                            console.log(chalk.cyan(`[Events]`) + chalk.red(` ${event_file} has no name. `))
                        }
                    }
                } else {
                    const event_file = require(`${path}/${event.name}`);
                    if (event_file.name) {

                        if (event_file.once) client.once(event_file.name, (...args) => event_file.execute(...args, client));
                        else client.on(event_file.name, (...args) => event_file.execute(...args, client));
                        console.log(chalk.cyan(`[Events]`) + chalk.cyan(` Loaded Event: `) + chalk.yellow(event_file.name));


                    } else { // If Command not has a name, then it is not a command and is not loaded into the client 
                        console.log(chalk.cyan(`[Events]`) + chalk.red(` ${event_file} has no name. `))
                    }
                }
            }





        },
    }
}