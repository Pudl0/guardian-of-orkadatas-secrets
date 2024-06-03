import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { characterService } from "../../services/characterService";
import { sessionService } from "../../services/sessionService";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('createdndcharacter')
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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction: ChatInputCommandInteraction) {
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

            await interaction.reply({ embeds: [errorEmbed] });
            return;
        }

        await characterService.createCharacterAsync(name, user.id, sessionId);

        const successEmbed = new EmbedBuilder()
            .setTitle('Success')
            .setDescription(`Created Character ${name}!`)
            .setColor('#00ff00');

        await interaction.reply({ embeds: [successEmbed] });
    },
};