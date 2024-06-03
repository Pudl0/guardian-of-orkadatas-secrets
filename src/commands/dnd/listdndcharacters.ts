import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { characterService } from "../../services/characterService";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('listdndcharacters')
        .setDescription('Lists all DnD characters.'),
    async execute(interaction: ChatInputCommandInteraction) {
        let characters = await characterService.getCharactersAsync();

        // create embed with all characters and their information
        const embed = new EmbedBuilder()
            .setTitle('DnD Characters')
            .setDescription('List of all DnD characters')
            .setColor('#0099ff');

        if (characters.length == 0) {
            embed.setDescription('No DnD Characters found.');
            await interaction.reply({ embeds: [embed] });
            return;
        }

        characters.sort().forEach(character => {
            embed.addFields({ name: character.name, value: `Character ID: ${character.id}\nSession: ${character.Session.name}\nUser: <@${character.userId}>` });
        });

        await interaction.reply({ embeds: [embed] });
    },
};