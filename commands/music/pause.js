const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses or resumes the current song"),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply("You need to be in a voice channel!");
    }

    console.warn(interaction.client.player.nodes, "THOSE ARE NODES");

    console.error(interaction.client.player, "THIS IS THE PLAYER");

    const queue = interaction.client.player.nodes.get(interaction.guildId);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply("There is no music playing!");
    }

    const paused = queue.node.isPaused();
    queue.node.setPaused(!paused);

    return interaction.reply(paused ? "▶️ Track resumed!" : "⏸️ Track paused!");
  },
};
