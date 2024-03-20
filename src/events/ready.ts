import { Client, Events } from "discord.js";

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
        if (client.user == null) {
            console.error("client.user is null")
            return;
        }
		console.log(`Logged in as "${client.user.tag}"`);
	},
};