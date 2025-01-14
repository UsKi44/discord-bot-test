const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song"),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply("You need to be in a voice channel!");
    }

    const queue = interaction.client.player.nodes.get(interaction.guildId);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply("There is no music playing!");
    }

    queue.node.skip();
    return interaction.reply("⏭️ Skipped the current track!");
  },
};
