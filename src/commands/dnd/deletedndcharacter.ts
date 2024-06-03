import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { characterService } from "../../services/characterService";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletedndcharacter')
        .setDescription('Delete existing DnD character.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The id of the character.')
                .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction: ChatInputCommandInteraction) {
        const id = interaction.options.getString('id')!;
        let session = await characterService.getCharacterByIdAsync(id);


        if (session == null) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`Character with id: "${id}" does not exist!`)
                .setColor('#ff0000');

            await interaction.reply({ embeds: [errorEmbed] });
            return;
        }

        let deletedCharacter = await characterService.deleteCharacterByIdAsync(session.id);

        const successEmbed = new EmbedBuilder()
            .setTitle('Success')
            .setDescription(`Deleted character ${deletedCharacter.name}!`)
            .setColor('#00ff00');

        await interaction.reply({ embeds: [successEmbed] });
    },
};