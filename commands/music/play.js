const { SlashCommandBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The song to play")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply("You need to be in a voice channel first!");
    }

    await interaction.deferReply();

    try {
      const query = interaction.options.getString("query");
      const searchResult = await interaction.client.player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (!searchResult || !searchResult.tracks.length) {
        return interaction.followUp("No results found!");
      }

      const { track } = await interaction.client.player.play(
        interaction.member.voice.channel,
        searchResult,
        {
          nodeOptions: {
            metadata: {
              channel: interaction.channel,
              client: interaction.client,
              requestedBy: interaction.user,
            },
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000, // 5 minutes
            leaveOnEnd: true,
            leaveOnEndCooldown: 300000, // 5 minutes
          },
        }
      );

      return interaction.followUp(`✅ Track **${track.title}** queued!`);
    } catch (error) {
      console.error(error);
      return interaction.followUp("❌ Error occurred while playing music!");
    }
  },
};
