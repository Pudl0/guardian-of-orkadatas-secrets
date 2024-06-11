import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import fs from 'node:fs';
import path from 'node:path';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

(async () => {
	client.commands = new Collection();

	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);

			if ('create' in command && 'execute' in command) {
				let commandData = await command.create();
				client.commands.set(commandData.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "create" or "execute" property.`);
			}
		}
	}

	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	client.login(config.DISCORD_TOKEN);
})();
