const fs = require('fs');
const chalk = require('chalk');
module.exports = {

    dc: { // All Handlers for Discord

        commands: async (path, client) => { // Command Handler
            client.commands = []
            client.slashcmds = []
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
                        if (command.slash) { // If Command is a Slash Command, then add it to the client (for-each guild)
                            client.slashcmds.push(command)
                            console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Loaded Slashcommand: `) + chalk.yellow(command.name) + chalk.cyan(` | Now Waiting for Publishing `));

                        } else { // If Command is not a Slash Command
                            client.commands.push(command.name, command);
                            console.log(chalk.cyan(`[Commands]`) + chalk.cyan(` Loaded Command: `) + chalk.yellow(command.name));
                        }

                    } else { // If Command not has a name, then it is not a command and is not loaded into the client 
                        console.log(chalk.cyan(`[Commands]`) + chalk.red(` ${cmd} has no name and was not loaded `))
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
                    if (end && failedguilds > 0 && client.guilds.cache.size != failedguilds){
                         console.log(chalk.cyan(`[Commands]`) + chalk.red(` Failed to publish Slashcommands for ${failedguilds} guilds. `))
                    } else if (end && failedguilds > 0 && client.guilds.cache.size == failedguilds){
                        console.log(chalk.cyan(`[Commands]`) + chalk.red(` Failed to publish Slashcommands all ${failedguilds} guilds. `))
                    }
                }, 1000)





            })

        },
        
        

        events: async (path, client) => { // Event Handler
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