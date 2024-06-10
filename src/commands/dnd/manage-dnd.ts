/**
 * @file Manage DnD Command
 * @module commands/dnd/manage-dnd
 * @description Collection of private DnD commands.
 */

import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { characterService } from "../../services/characterService";
import { sessionService } from "../../services/sessionService";

/**
 * Represents the manage-dnd command.
 */
module.exports = {
    /**
     * The data for the manage-dnd command.
     */
    data: new SlashCommandBuilder()
        .setName('manage-dnd')
        .setDescription('Collection of private DnD commands.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommandGroup(group =>
            group
                .setName('create')
                .setDescription('Create new DnD objects.')
                .addSubcommand(command =>
                    command.setName('session')
                        .setDescription('Create a new DnD session.')
                        .addStringOption(option =>
                            option.setName('name')
                                .setDescription('The name of the session.')
                                .setRequired(true)
                        )
                        .addUserOption(option =>
                            option.setName('dm')
                                .setDescription('The Dungeon Master of the session.')
                                .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option.setName('dayoftheweek')
                                .setDescription('The day of the week the session is on. (0-6) 0 = Sunday, 6 = Saturday.')
                                .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option.setName('time')
                                .setDescription('The time the session is on. (0-23) 0 = 12:00 AM, 23 = 11:00 PM.')
                                .setRequired(true)
                        )
                )
                .addSubcommand(command =>
                    command.setName('character')
                        .setDescription('Create a new DnD character.')
                        .addStringOption(option =>
                            option.setName('name')
                                .setDescription('The name of the character.')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option.setName('sessionid')
                                .setDescription('The Session Id to add the character to.')
                                .setRequired(true)
                        )
                        .addUserOption(option =>
                            option.setName('user')
                                .setDescription('The user of the character.')
                        )
                )
        )
        .addSubcommandGroup(group =>
            group
                .setName('delete')
                .setDescription('Delete existing DnD objects.')
                .addSubcommand(command =>
                    command.setName('session')
                        .setDescription('Delete existing DnD session.')
                        .addStringOption(option =>
                            option.setName('name')
                                .setDescription('The name of the session.')
                                .setRequired(true)
                        )
                )
                .addSubcommand(command =>
                    command.setName('character')
                        .setDescription('Delete existing DnD character.')
                        .addStringOption(option =>
                            option.setName('id')
                                .setDescription('The id of the character.')
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(group =>
            group
                .setName('update')
                .setDescription('Update state of DnD Objects.')
                .addSubcommand(command =>
                    command.setName('session')
                        .setDescription('Update session')
                        .addStringOption(option =>
                            option.setName('id')
                                .setDescription('The id of the session.')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option.setName('name')
                                .setDescription('The new name of the session.')
                        )
                        .addUserOption(option =>
                            option.setName('dm')
                                .setDescription('The new Dungeon Master of the session.')
                        )
                        .addBooleanOption(option =>
                            option.setName("active")
                                .setDescription("Change active state of session")
                        )
                        .addIntegerOption(option =>
                            option.setName('dayoftheweek')
                                .setDescription('The day of the week the session is on. (0-6) 0 = Sunday, 6 = Saturday.')
                        )
                        .addIntegerOption(option =>
                            option.setName('time')
                                .setDescription('The time the session is on. (0-23) 0 = 12:00 AM, 23 = 11:00 PM.')
                        )
                )
                .addSubcommand(command =>
                    command.setName('character')
                        .setDescription('Update character')
                        .addStringOption(option =>
                            option.setName('id')
                                .setDescription('The id of the character.')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option.setName('name')
                                .setDescription('The new name of the character.')
                        )
                        .addUserOption(option =>
                            option.setName('user')
                                .setDescription('The new user of the character.')
                        )
                        .addStringOption(option =>
                            option.setName('sessionid')
                                .setDescription('The new Session Id to add the character to.')
                        )
                )
        ),
    /**
     * Executes the manage-dnd command.
     * @param {ChatInputCommandInteraction} interaction - The command interaction.
     */
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommandGroup = interaction.options.getSubcommandGroup()!;
        let subcommand = interaction.options.getSubcommand()!;

        let embed: EmbedBuilder = new EmbedBuilder();

        switch (subcommandGroup) {
            case 'create':
                embed = await createAsync(subcommand, interaction);
                break;
            case 'delete':
                embed = await deleteAsync(subcommand, interaction);
                break;
            case 'update':
                embed = await updateAsync(subcommand, interaction);
        }

        await interaction.reply({ embeds: [embed] });
    },
};

/**
 * Creates a new DnD character.
 * @param {String} type - The type of the character.
 * @param {ChatInputCommandInteraction} interaction - The command interaction.
 * @returns {Promise<EmbedBuilder>} The embed builder with the result.
 */
async function createAsync(type: String, interaction: ChatInputCommandInteraction) {
    switch (type) {
        case 'character':
            return await createCharacterAsync(interaction);
        case 'session':
            return await createSessionAsync(interaction);
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');
}

/**
 * Creates a new DnD character.
 * @param {ChatInputCommandInteraction} interaction - The command interaction.
 * @returns {Promise<EmbedBuilder>} The embed builder with the result.
 */
async function createCharacterAsync(interaction: ChatInputCommandInteraction) {
    var user = interaction.options.getUser('user');
    const name = interaction.options.getString('name')!;
    const sessionId = interaction.options.getString('sessionid')!;

    if (user == null) {
        user = interaction.user;
    }

    if (await sessionService.getSessionByIdAsync(sessionId) == null) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Session with ID: "${sessionId}" does not exist!`)
            .setColor('#ff0000');

        return errorEmbed;
    }

    await characterService.createCharacterAsync(name, user.id, sessionId);

    const successEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`Created Character ${name}!`)
        .setColor('#00ff00');

    return successEmbed;
}

/**
 * Creates a new DnD session.
 * @param {ChatInputCommandInteraction} interaction - The command interaction.
 * @returns {Promise<EmbedBuilder>} The embed builder with the result.
 */
async function createSessionAsync(interaction: ChatInputCommandInteraction) {
    const dm = interaction.options.getUser('dm')!;
    const name = interaction.options.getString('name')!;
    const dayOfTheWeek = interaction.options.getInteger('dayoftheweek')!;
    const time = interaction.options.getInteger('time')!;

    let success = await sessionService.createSessionAsync(name, dm.id, dayOfTheWeek, time);

    if (success == null) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Session with name: "${name}" already exists!`)
            .setColor('#ff0000');

        return errorEmbed;
    }

    const successEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`Created session ${name}!`)
        .setColor('#00ff00');

    return successEmbed;
}

/**
 * Deletes an existing DnD object.
 * @param {String} type - The type of the object.
 * @param {ChatInputCommandInteraction} interaction - The command interaction.
 * @returns {Promise<EmbedBuilder>} The embed builder with the result.
 */
async function deleteAsync(type: String, interaction: ChatInputCommandInteraction) {
    switch (type) {
        case 'character':
            return await deleteCharacterAsync(interaction);
        case 'session':
            return await deleteSessionAsync(interaction);
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');
}

/**
 * Deletes a character based on the provided id.
 * @param interaction - The ChatInputCommandInteraction object representing the interaction with the command.
 * @returns A success or error EmbedBuilder object indicating the result of the deletion.
 */
async function deleteCharacterAsync(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getString('id')!;
    let session = await characterService.getCharacterByIdAsync(id);


    if (session == null) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Character with id: "${id}" does not exist!`)
            .setColor('#ff0000');

        return errorEmbed;
    }

    let deletedCharacter = await characterService.deleteCharacterByIdAsync(session.id);

    const successEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`Deleted character ${deletedCharacter.name}!`)
        .setColor('#00ff00');

    return successEmbed;
}


/**
 * Deletes a session based on the provided name.
 * @param interaction - The ChatInputCommandInteraction object representing the interaction with the command.
 * @returns A success or error EmbedBuilder object indicating the result of the deletion.
 */
async function deleteSessionAsync(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name')!;
    let session = await sessionService.getSessionByNameAsync(name);

    if (session == null) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Session with name: "${name}" does not exist!`)
            .setColor('#ff0000');

        return errorEmbed;
    }

    let deletedSession = await sessionService.deleteSessionByIdAsync(session.id);

    const successEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`Deleted Session ${deletedSession.name}!`)
        .setColor('#00ff00');

    return successEmbed;
}

/**
 * Updates an existing DnD object.
 * @param {String} type - The type of the object.
 * @param {ChatInputCommandInteraction} interaction - The command interaction.
 * @returns {Promise<EmbedBuilder>} The embed builder with the result.
 */
async function updateAsync(type: String, interaction: ChatInputCommandInteraction) {
    switch (type) {
        case 'session':
            return await updateSessionAsync(interaction);
        case 'character':
            return await updateCharacterAsync(interaction);
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');    
}

/**
 * Updates a session based on the provided interaction.
 * @param interaction - The ChatInputCommandInteraction object representing the interaction.
 * @returns A Promise that resolves to an EmbedBuilder object representing the result of the update.
 */
async function updateSessionAsync(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getString('id')!;
    const session = await sessionService.getSessionByIdAsync(id);

    if (session == null) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Session with id: "${id}" does not exist!`)
            .setColor('#ff0000');

        return errorEmbed;
    }

    const active = interaction.options.getBoolean('active');
    const name = interaction.options.getString('name');
    const dm = interaction.options.getUser('dm');
    const dayOfTheWeek = interaction.options.getInteger('dayoftheweek');
    const time = interaction.options.getInteger('time');   

    let changes: string[] = [];

    if (active != null) {
        await sessionService.updateSessionActiveAsync(session.id, active);
        changes.push(`Active: ${active}`);
    }

    if (name != null) {
        await sessionService.updateSessionNameAsync(session.id, name);
        changes.push(`Name: ${name}`);
    }

    if (dm != null) {
        await sessionService.updateSessionDmIdAsync(session.id, dm.id);
        changes.push(`DM: ${dm.username}`);
    }

    if (dayOfTheWeek != null) {
        let success = await sessionService.updateSessionDayOfWeekAsync(session.id, dayOfTheWeek);
        if (success == null) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`Invalid day of the week: ${dayOfTheWeek}`)
                .setColor('#ff0000');
    
            return errorEmbed;
        }
        changes.push(`Day of the week: ${dayOfTheWeek}`);
    }

    if (time != null) {
        let success = await sessionService.updateSessionTimeAsync(session.id, time);
        if (success == null) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`Invalid time: ${time}`)
                .setColor('#ff0000');
    
            return errorEmbed;
        }
        changes.push(`Time: ${time}`);
    }
    
    const successEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`Successfully updated session: ${session.name}!`)
        .setColor('#00ff00');

    for (let i = 0; i < changes.length; i++) {
        successEmbed.addFields({ name: `Change ${i + 1}`, value: changes[i]});
    }

    return successEmbed;
}

/**
 * Updates a character based on the provided interaction.
 * @param interaction - The ChatInputCommandInteraction object representing the interaction.
 * @returns A Promise that resolves to an EmbedBuilder object representing the result of the update.
 */
async function updateCharacterAsync(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getString('id')!;
    const character = await characterService.getCharacterByIdAsync(id);

    if (character == null) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Character with id: "${id}" does not exist!`)
            .setColor('#ff0000');

        return errorEmbed;
    }

    const name = interaction.options.getString('name');
    const user = interaction.options.getUser('user');
    const sessionid = interaction.options.getString('sessionid');

    let changes: string[] = [];

    if (name != null) {
        await characterService.updateCharacterNameAsync(character.id, name);
        changes.push(`Name: ${name}`);
    }

    if (user != null) {
        await characterService.updateCharacterUserIdAsync(character.id, user.id);
        changes.push(`User: ${user.username}`);
    }

    if (sessionid != null) {
        await characterService.updateCharacterSessionIdAsync(character.id, sessionid);
        changes.push(`Session: ${sessionid}`);
    }

    const successEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`Successfully updated character: ${character.name}!`)
        .setColor('#00ff00');

    for (let i = 0; i < changes.length; i++) {
        successEmbed.addFields({ name: `Change ${i + 1}`, value: changes[i]});
    }

    return successEmbed;
}