const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearhistory")
    .setDescription("Clear messages from the current channel")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to clear (1-100)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    try {
      // Check if user has Administrator permission
      if (
        !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
      ) {
        return interaction.reply({
          content: "You need Administrator permissions to use this command.",
          ephemeral: true,
        });
      }

      const amount = interaction.options.getInteger("amount");
      const channel = interaction.channel;

      // Fetch and delete messages
      const messages = await channel.bulkDelete(amount, true).catch((error) => {
        console.error("Error deleting messages:", error);
        throw new Error(
          "Failed to delete messages. Messages older than 14 days cannot be bulk deleted."
        );
      });

      // Send confirmation message that will delete itself after 5 seconds
      await interaction.reply({
        content: `Successfully deleted ${messages.size} messages.`,
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: `An error occurred: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};
