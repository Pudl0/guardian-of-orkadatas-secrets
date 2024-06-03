import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { characterService } from "../../services/characterService";
import { sessionService } from "../../services/sessionService";


module.exports = {
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
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommandGroup = interaction.options.getSubcommandGroup()!;
        let subcommand = interaction.options.getSubcommand()!;

        let embed: EmbedBuilder = new EmbedBuilder();

        switch (subcommandGroup) {
            case 'list':
                embed = await listAsync(subcommand);
                break;
        }

        await interaction.reply({ embeds: [embed] });
    },
};

async function listAsync(type: String) {
    switch (type) {
        case 'character':
            return await listCharactersAsync();
        case 'session':
            return await listSessionsAsync();
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');
}

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

    sessions.forEach(session => {
        embed.addFields({ name: session.name, value: `Session ID: ${session.id}\nDM: <@${session.dmId}>\n${session.DndCharacter.length} ${session.DndCharacter.length == 1 ? "Player" : "Players"}` });
    });

    return embed;
}
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
        embed.addFields({ name: character.name, value: `Character ID: ${character.id}\nSession: ${character.Session.name}\nUser: <@${character.userId}>` });
    });

    return embed;
}