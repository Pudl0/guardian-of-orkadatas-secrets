/**
 * @file DnD Command
 * @module commands/dnd/dnd
 * @description Collection of public DnD commands.
 */

import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { characterService } from "../../services/characterService";
import { sessionService } from "../../services/sessionService";

/**
 * Represents the dnd command.
 */
module.exports = {
    /**
     * The data for the slash command.
     */
    data: new SlashCommandBuilder()
        .setName('dnd')
        .setDescription('Collection of public DnD commands.')
        .addSubcommandGroup(group =>
            group
                .setName('list')
                .setDescription('List all DnD objects.')
                .addSubcommand(command =>
                    command.setName('character')
                        .setDescription('List all DnD characters.')
                )
                .addSubcommand(command =>
                    command.setName('session')
                        .setDescription('List all DnD sessions.')
                )
        )
        .addSubcommandGroup(group =>
            group
                .setName('show')
                .setDescription('Shows the weekly DnD Schedule.')
                .addSubcommand(command =>
                    command.setName('schedule')
                        .setDescription('Shows the DnD Session Schedule.')
                )
                .addSubcommand(command =>
                    command.setName('session')
                        .setDescription('Shows a specific DnD Session.')
                        .addIntegerOption(option =>
                            option.setName('id')
                                .setDescription('The ID of the session.')
                                .setRequired(true)
                        )
                )
                .addSubcommand(command =>
                    command.setName('character')
                        .setDescription('Shows a specific DnD Character.')
                        .addIntegerOption(option =>
                            option.setName('id')
                                .setDescription('The ID of the character.')
                                .setRequired(true)
                        )
                )
        ),
    /**
     * Executes the DnD command.
     * @param interaction The command interaction.
     */
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommandGroup = interaction.options.getSubcommandGroup()!;
        let subcommand = interaction.options.getSubcommand()!;

        let embed: EmbedBuilder = new EmbedBuilder();

        switch (subcommandGroup) {
            case 'list':
                embed = await listAsync(subcommand);
                break;
            case 'show':
                embed = await showAsync(subcommand, interaction);
                break;
        }

        await interaction.reply({ embeds: [embed] });
    },
};

/**
 * Lists DnD objects based on the specified type.
 * @param type The type of DnD objects to list.
 * @returns The embed containing the list of DnD objects.
 */
async function listAsync(type: String) {
    switch (type) {
        case 'character':
            return await listCharactersAsync();
        case 'session':
            return await listSessionsAsync();
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');
}

/**
 * Shows detailed information about a DnD object based on the specified type.
 * @param type The type of DnD object to show.
 * @param interaction The command interaction.
 * @returns The embed containing the detailed information of the DnD object.
 */
async function showAsync(type: String, interaction: ChatInputCommandInteraction) {
    switch (type) {
        case 'schedule':
            return await showScheduleAsync();
        case 'session':
            return await showSessionAsync(interaction);
        case 'character':
            return await showCharacterAsync(interaction);
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');
}

/**
 * Lists all DnD sessions.
 * @returns The embed containing the list of DnD sessions.
 */
async function listSessionsAsync() {
    let sessions = await sessionService.getSessionsAsync();

    // create embed with all sessions and their information
    const embed = new EmbedBuilder()
        .setTitle('DnD Sessions')
        .setDescription('List of all DnD sessions')
        .setColor('#0099ff');

    if (sessions.length == 0) {
        embed.setDescription('No DnD sessions found.');
        return embed;
    }

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    sessions.forEach(session => {
        embed.addFields({
            name: session.name,
            value: `Session ID: ${session.id}\nActive: ${session.active}\nDM: <@${session.dmId}>\nPlaying every ${weekday[session.dayOfWeek]} at ${(session.time.toString().length == 1 ? "0" : "") + session.time}:00\n${session.DndCharacter.length} ${session.DndCharacter.length == 1 ? "Player" : "Players"}`
        });
    });

    return embed;
}

/**
 * Lists all DnD characters.
 * @returns The embed containing the list of DnD characters.
 */
async function listCharactersAsync() {
    let characters = await characterService.getCharactersAsync();

    // create embed with all characters and their information
    const embed = new EmbedBuilder()
        .setTitle('DnD Characters')
        .setDescription('List of all DnD characters')
        .setColor('#0099ff');

    if (characters.length == 0) {
        embed.setDescription('No DnD Characters found.');
        return embed;
    }

    characters.sort().forEach(character => {
        embed.addFields({
            name: character.name,
            value: `Character ID: ${character.id}\nSession: ${character.Session.name}\nUser: <@${character.userId}>`
        });
    });

    return embed;
}

/**
 * Shows the schedule of currently active DnD sessions.
 * @returns The embed containing the DnD session schedule.
 */
async function showScheduleAsync() {
    let sessions = await sessionService.getSessionsAsync();

    // create embed with all sessions and their information
    const embed = new EmbedBuilder()
        .setTitle('DnD Session Schedule')
        .setDescription('Shows the schedule of currently active dnd sessions')
        .setColor('#0099ff');

    if (sessions.length == 0) {
        embed.setDescription('No DnD sessions found.');
        return embed;
    }

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    weekday.forEach(day => {
        let sessionsForDay = sessions.filter(session => session.dayOfWeek == weekday.indexOf(day) && session.active);

        if (sessionsForDay.length < 1) {
            embed.addFields({
                name: day,
                value: "No Sessions for this day."
            });
        } else {
            embed.addFields({
                name: day,
                inline: true,
                value: sessionsForDay
                    .sort((a, b) => {
                        if (a.time < b.time) {
                            return -1;
                        }
                        if (a.time > b.time) {
                            return 1;
                        }
                        return 0;
                    })
                    .map(s => `${(s.time.toString().length == 1 ? "0" : "") + s.time}:00 - ${s.name}`)
                    .join('\n')
            });
        }
    });

    return embed;
}

/**
 * Shows detailed information about a specific DnD session.
 * @param interaction The command interaction.
 * @returns The embed containing the detailed information of the DnD session.
 */
async function showSessionAsync(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getString('id')!;
    const session = await sessionService.getSessionByIdAsync(id);

    if (session == null) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Character with id: "${id}" does not exist!`)
            .setColor('#ff0000');

        return errorEmbed;
    }

    const successEmbed = new EmbedBuilder()
        .setTitle(session.name)
        .setDescription(`Session information of session with id: ${session.id}`)
        .setColor('#00ff00')
        .addFields({ name: 'DM', value: `<@${session.dmId}>` }, { name: 'Day of the week', value: session.dayOfWeek.toString() }, { name: 'Time', value: session.time.toString() });

    return successEmbed;
}

/**
 * Shows detailed information about a specific DnD character.
 * @param interaction The command interaction.
 * @returns The embed containing the detailed information of the DnD character.
 */
async function showCharacterAsync(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getString('id')!;
    const character = await characterService.getCharacterByIdAsync(id);

    if (character == null) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Character with id: "${id}" does not exist!`)
            .setColor('#ff0000');

        return errorEmbed;
    }

    const successEmbed = new EmbedBuilder()
        .setTitle(character.name)
        .setDescription(`Character information of character with id: ${character.id}`)
        .setColor('#00ff00')
        .addFields({ name: 'User', value: `<@${character.userId}>` }, { name: 'Session', value: character.Session.name });

    return successEmbed;
}