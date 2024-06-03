import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { characterService } from "../../services/characterService";
import { sessionService } from "../../services/sessionService";


module.exports = {
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
                .setName('set')
                .setDescription('Set state of DnD Objects.')
                .addSubcommand(command =>
                    command.setName('session')
                        .setDescription('Set state of session')
                        .addStringOption(option =>
                            option.setName('name')
                                .setDescription('The name of the session.')
                                .setRequired(true)
                        )
                        .addBooleanOption(option =>
                            option.setName("active")
                                .setDescription("Change active state of session")
                                .setRequired(true)
                        )
                )
        ),
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
            case 'set':
                embed = await setAsync(subcommand, interaction);
        }

        await interaction.reply({ embeds: [embed] });
    },
};

async function createAsync(type: String, interaction: ChatInputCommandInteraction) {
    switch (type) {
        case 'character':
            return await createCharacterAsync(interaction);
        case 'session':
            return await createSessionAsync(interaction);
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');
}

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

async function deleteAsync(type: String, interaction: ChatInputCommandInteraction) {
    switch (type) {
        case 'character':
            return await deleteCharacterAsync(interaction);
        case 'session':
            return await deleteSessionAsync(interaction);
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');
}

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

async function setAsync(type: String, interaction: ChatInputCommandInteraction) {
    switch (type) {
        case 'session':
            return await setSessionStateAsync(interaction);
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');    
}

async function setSessionStateAsync(interaction: ChatInputCommandInteraction) {
    const active = interaction.options.getBoolean('active')!;
    const session = await sessionService.getSessionByNameAsync(interaction.options.getString('name')!);

    if (session == null) {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Session with name: "${interaction.options.getString('name')}" does not exist!`)
            .setColor('#ff0000');

        return errorEmbed;
    }

    await sessionService.setSessionActiveAsync(session.id, active);

    const successEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`Set active state of session ${session.name} to ${active}!`)
        .setColor('#00ff00');

    return successEmbed;
}