require('colors');

const { testServerId } = require('../../config.json');
const commandComparing = require('../../utils/commandComparing');
const getApplicationCommand = require('../../utils/getApplicationCommands');
const getLocalCommand = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    try {
        const [localCommands, applicationCommand] = await Promise.all([
            getLocalCommand(), 
            getApplicationCommand(client, testServerId)
        ]);

        for (const localCommand of localCommands) {
            const { data, deleted } = localCommand;
            
            const { 
                name: commandName, 
                description: commandDescription,
                options: commandOptions,
            } = data;

            const existingCommand = await applicationCommand.cache.find(
                (cmd) => cmd.name === commandName
            );

            if (deleted) {
                if (existingCommand) {
                    await applicationCommand.delete(existingCommand.id);
                    console.log(`[COMMAND REGISTRERY] Application Command : ${commandName} has been deleted!`.red);
                } else {
                    console.log(`[COMMAND REGISTRERY] Application Command : ${commandName} has been skipped, since property "deleted" is set to "true"!`.grey);
                };
            } else if (existingCommand) {
                if (commandComparing(existingCommand, localCommand)) {
                    await applicationCommand.edit(existingCommand.id, {
                        name: commandName, 
                        description: commandDescription, 
                        options: commandOptions,
                    });
                    console.log(`[COMMAND REGISTRERY] Application Command : ${commandName} has been edited!`.yellow);
                }
            } else {
                await applicationCommand.create({
                    name: commandName, 
                    description: commandDescription, 
                    options: commandOptions,
                });
                console.log(`[COMMAND REGISTRERY] Application Command : ${commandName} has been registered!`.green);
            }
        } 
    } catch (error) {
        console.log(`[ERROR] An error has occured inside the command registrery :\n ${error}`.red)
    }
}