import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { sessionService } from "../../services/sessionService";


module.exports = {
	data: new SlashCommandBuilder()
		.setName('listdndsessions')
		.setDescription('Lists all DnD sessions.'),
	async execute(interaction: ChatInputCommandInteraction) {
		let sessions = await sessionService.getSessionsAsync();
		
        // display sessions in embed
        let sessionList = "";
        sessions.forEach(session => {
            sessionList += `${session.name}\n`;
        });
        await interaction.reply(sessionList);
	},
};