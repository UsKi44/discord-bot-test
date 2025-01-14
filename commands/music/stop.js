const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the music and clears the queue"),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply("You need to be in a voice channel!");
    }

    const queue = interaction.client.player.getQueue(interaction.guildId);
    if (!queue) {
      return interaction.reply("There is no music playing!");
    }

    queue.destroy();
    return interaction.reply("🛑 Stopped the music and cleared the queue!");
  },
};
