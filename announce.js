const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Sends a message in #announcements using the bot')
        .addStringOption(option =>
            option.setName('content')
				.setDescription('The content of the announcement')
				.setRequired(true)
                ),
	async execute(interaction) {
		let content = interaction.options.getString('content');
		let sent = await interaction.reply({
			content: 'Announcing...',
			fetchReply: true,
			ephemeral: true
		});
		await interaction.deleteReply();
        await interaction.channel.send(`@everyone ${content}`);
	},
};