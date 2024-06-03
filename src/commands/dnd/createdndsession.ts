import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { sessionService } from "../../services/sessionService";


module.exports = {
	data: new SlashCommandBuilder()
		.setName('createdndsession')
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
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction: ChatInputCommandInteraction) {
		const dm = interaction.options.getUser('dm')!;
		const name = interaction.options.getString('name')!;

		let success = await sessionService.createSessionAsync(name, dm.id);

		if (success == null) {
			const errorEmbed = new EmbedBuilder()
				.setTitle('Error')
				.setDescription(`Session with name: "${name}" already exists!`)
				.setColor('#ff0000');

			await interaction.reply({ embeds: [errorEmbed] });
			return;
		}

		const successEmbed = new EmbedBuilder()
			.setTitle('Success')
			.setDescription(`Created session ${name}!`)
			.setColor('#00ff00');

		await interaction.reply({ embeds: [successEmbed] });
	},
};