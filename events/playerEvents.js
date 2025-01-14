function setupPlayerEvents(player) {
  player.events.on("connection", (queue) => {
    console.log("Successfully connected to voice channel");
  });

  player.events.on("playerStart", (queue, track) => {
    queue.metadata.channel.send(`🎵 Now playing: **${track.title}**`);
  });

  player.events.on("audioTrackAdd", (queue, track) => {
    queue.metadata.channel.send(`🎵 Added **${track.title}** to the queue`);
  });

  player.events.on("disconnect", (queue) => {
    queue.metadata.channel.send("❌ Disconnected from voice channel!");
  });

  player.events.on("emptyChannel", (queue) => {
    queue.metadata.channel.send(
      "❌ Nobody is in the voice channel, leaving..."
    );
  });

  player.events.on("emptyQueue", (queue) => {
    queue.metadata.channel.send("✅ Queue finished!");
  });

  player.events.on("error", (queue, error) => {
    console.error(`Player error: ${error.message}`);
    queue.metadata.channel.send(`❌ Error: ${error.message}`);
  });
}

module.exports = setupPlayerEvents;
