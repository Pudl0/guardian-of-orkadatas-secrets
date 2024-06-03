import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { sessionService } from "../../services/sessionService";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('listdndsessions')
        .setDescription('Lists all DnD sessions.'),
    async execute(interaction: ChatInputCommandInteraction) {
        let sessions = await sessionService.getSessionsAsync();

        // create embed with all sessions and their information
        const embed = new EmbedBuilder()
            .setTitle('DnD Sessions')
            .setDescription('List of all DnD sessions')
            .setColor('#0099ff');

        if (sessions.length == 0) {
            embed.setDescription('No DnD sessions found.');
            await interaction.reply({ embeds: [embed] });
            return;
        }

        sessions.forEach(session => {
            embed.addFields({ name: session.name, value: `Session ID: ${session.id}\nDM: <@${session.dmId}>` });
        });

        await interaction.reply({ embeds: [embed] });
    },
};