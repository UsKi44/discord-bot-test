const { SlashCommandBuilder } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get lyrics for the currently playing song"),
  async execute(interaction) {
    try {
      // Check if there's music playing
      const queue = interaction.client.player.nodes.get(interaction.guildId);
      if (!queue || !queue.isPlaying()) {
        return interaction.reply("There is no music playing!");
      }

      await interaction.deferReply(); // Defer the reply as lyrics search might take time

      const currentTrack = queue.currentTrack;
      let lyrics = null;

      try {
        // Search for lyrics
        lyrics =
          (await lyricsFinder(currentTrack.author, currentTrack.title)) ||
          "No lyrics found.";
      } catch (error) {
        console.error("Error fetching lyrics:", error);
        lyrics = "Error fetching lyrics.";
      }

      // Create an embed for better presentation
      const lyricsEmbed = new EmbedBuilder()
        .setTitle(`Lyrics for ${currentTrack.title}`)
        .setDescription(
          lyrics.length > 4096 ? lyrics.slice(0, 4093) + "..." : lyrics
        )
        .setColor("#0099ff")
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      if (currentTrack.thumbnail) {
        lyricsEmbed.setThumbnail(currentTrack.thumbnail);
      }

      return interaction.followUp({ embeds: [lyricsEmbed] });
    } catch (error) {
      console.error("Error in lyrics command:", error);
      return interaction.followUp(
        "An error occurred while fetching the lyrics."
      );
    }
  },
};
