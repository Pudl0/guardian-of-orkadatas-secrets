import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

/**
 * Represents a ping command.
 */
module.exports = {
	/**
	 * Creates a new slash command builder for the ping command.
	 * @returns The slash command builder.
	 */
	async create() {
		return new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Replies with Pong!');
	},
	/**
	 * Executes the ping command.
	 * @param interaction - The chat input command interaction.
	 */
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('Pong!');
	},
};