import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { sessionService } from "../../services/sessionService";


module.exports = {
	data: new SlashCommandBuilder()
		.setName('createdndsession')
		.setDescription('Create a new DnD session.')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the session.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('dm')
				.setDescription('The Dungeon Master of the session.')
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		const dm = interaction.options.getUser('dm')!;
		const name = interaction.options.getString('name')!;
		await sessionService.createSessionAsync(name, dm.id);
		
		await interaction.reply('Created Session!');
	},
};