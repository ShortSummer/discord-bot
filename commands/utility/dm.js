const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dm')
		.setDescription('DMs you with hi'),
	async execute(interaction) {
        await interaction.user.send('hello');
        await interaction.reply({
			content:'u should have a dm',
			ephemeral: true
		});
	},
};