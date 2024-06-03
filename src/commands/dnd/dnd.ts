import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ApplicationCommandNumericOptionMinMaxValueMixin } from "discord.js";
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
        )
        .addSubcommandGroup(group =>
            group
                .setName('show')
                .setDescription('Shows the weekly DnD Schedule.')
                .addSubcommand(command =>
                    command.setName('schedule')
                        .setDescription('Shows the DnD Session Schedule.')
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
            case 'show':
                embed = await scheduleAsync(subcommand);
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

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    sessions.forEach(session => {
        embed.addFields({
            name: session.name,
            value: `Session ID: ${session.id}\nActive: ${session.active}\nDM: <@${session.dmId}>\nPlaying every ${weekday[session.dayOfWeek]} at ${(session.time.toString().length == 1 ? "0" : "") + session.time}:00\n${session.DndCharacter.length} ${session.DndCharacter.length == 1 ? "Player" : "Players"}`
        });
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
        embed.addFields({
            name: character.name,
            value: `Character ID: ${character.id}\nSession: ${character.Session.name}\nUser: <@${character.userId}>`
        });
    });

    return embed;
}

async function scheduleAsync(type: String) {
    switch (type) {
        case 'schedule':
            return await scheduleSessionAsync();
    }
    return new EmbedBuilder().setTitle('Error').setDescription('Invalid type').setColor('#ff0000');
}

async function scheduleSessionAsync() {
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