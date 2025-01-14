const { Player } = require("discord-player");

class MusicPlayerService {
  constructor(client) {
    this.player = new Player(client);
    this.setupPlayerEvents();
  }

  setupPlayerEvents() {
    this.player.events.on("playerStart", (queue, track) => {
      queue.metadata.channel.send(`🎵 Now playing: **${track.title}**`);
    });

    this.player.events.on("playerError", (queue, error) => {
      console.error(`Player error: ${error.message}`);
      queue.metadata.channel.send(`❌ Error: **${error.message}**`);
    });
  }
}
