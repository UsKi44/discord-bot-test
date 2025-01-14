const { Events } = require("discord.js");

module.exports = {
  name: Events.VoiceStateUpdate,
  execute(oldState, newState) {
    // Handle bot disconnection
    if (oldState.member.id === oldState.client.user.id && !newState.channelId) {
      const queue = oldState.client.player.getQueue(oldState.guild.id);
      if (queue) {
        queue.destroy();
      }
    }

    // Handle when bot is alone in channel
    if (oldState.channelId && oldState.channel.members.size === 1) {
      const queue = oldState.client.player.getQueue(oldState.guild.id);
      if (
        queue &&
        queue.connection &&
        oldState.channel.members.has(oldState.client.user.id)
      ) {
        queue.destroy();
      }
    }
  },
};
