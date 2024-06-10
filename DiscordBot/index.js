const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const CONFIG = require('./config.json');
const { time } = require('console');
const fs = require('node:fs');
const path = require('node:path');

const serverId = "1033238652811231313";
const serverLink = `https://discord.com/channels/${serverId}/`

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = CONFIG.token;
client.commands = new Collection();

function getChannels() {
	const channelIds = CONFIG.channelIds;

	const channels = {
		"general": client.channels.cache.get(channelIds["general"]),
		"uptimeCheck": client.channels.cache.get(channelIds["uptimeCheck"]),
		"auditLogs": client.channels.cache.get(channelIds["auditLogs"])
	};
	return channels;
}


const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

function LoginClient(onLogin) {
    client.once(Events.ClientReady, readyClient => {
        console.log(`Ready! Logged in as: ${readyClient.user.tag}`);
        client.user.setStatus('online');
        var date = new Date(Date.now()).toLocaleString();
        client.user.setActivity(`Bot has been up since: ${date} (PST)`);
        if(onLogin) { onLogin(); }
    });
    client.login(token);
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	let channels = getChannels();
	channels["auditLogs"].send(`Command used: ${interaction.commandName} by <@${interaction.user.id}>\nChannel: ${serverLink}${interaction.channelId}`);
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

LoginClient(function() {

let channels = getChannels();
channels["uptimeCheck"].send("bot is up");

});