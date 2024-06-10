const { SlashCommandBuilder } = require('discord.js');
const CONFIG = require("/Users/$USER/Documents/Programming/Javascript/DiscordBot/config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong and replies with ping.'),
	async execute(interaction) {
		let sent = await interaction.reply({
			content: 'Pong! Getting ping...',
			fetchReply: true,
			ephemeral: true
		});
		await interaction.editReply(`Pong! Got ping: ${sent.createdTimestamp-interaction.createdTimestamp}ms`);
	},
};