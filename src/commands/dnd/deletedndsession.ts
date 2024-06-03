import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { sessionService } from "../../services/sessionService";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletedndsession')
        .setDescription('Delete existing DnD session.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the session.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('name')!;
        let session = await sessionService.getSessionByNameAsync(name);


        if (session == null) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`Session with name: "${name}" does not exist!`)
                .setColor('#ff0000');

            await interaction.reply({ embeds: [errorEmbed] });
            return;
        }

        let deletedSession = await sessionService.deleteSessionByIdAsync(session.id);

        const successEmbed = new EmbedBuilder()
            .setTitle('Success')
            .setDescription(`Deleted Session ${deletedSession.name}!`)
            .setColor('#00ff00');

        await interaction.reply({ embeds: [successEmbed] });
    },
};