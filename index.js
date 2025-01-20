require("dotenv").config({ path: ".env.test" });

const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");
const libsodium = require("libsodium-wrappers");
const setupPlayerEvents = require("./events/playerEvents");
const { YoutubeiExtractor } = require("discord-player-youtubei");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize player
async function initializePlayer() {
  await libsodium.ready;

  // Create new player instance
  const player = new Player(client);

  // Add player to client
  client.player = player;

  // Create queues property
  client.queues = new Map();

  // Load extractors using the new method
  await player.extractors.loadMulti(DefaultExtractors);

  // Register YouTubei extractor
  await player.extractors.register(YoutubeiExtractor, {
    // Optional: Add cookie if you want to use authenticated features
    // cookie: "YOUR_YOUTUBE_COOKIE",
    // Optional: Override bridge mode if needed
    // overrideBridgeMode: "ytmusic", // or "yt"
  });

  setupPlayerEvents(player);
}

// Make sure to await the initialization
(async () => {
  try {
    await initializePlayer();
    // Rest of your bot initialization code
  } catch (error) {
    console.error("Failed to initialize player:", error);
  }
})();

// Events loader (loading events from events folder)
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);

client.commands = new Collection();

// Loading commands
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Add error handling that doesn't expose sensitive details
client.on("error", (error) => {
  console.error("An error occurred:", error.message);
  // Don't log the full error stack in production
});

// Sanitize logging
client.on("interactionCreate", async (interaction) => {
  // Log only non-sensitive information
  console.log(`Command executed: ${interaction.commandName}`);
  // Don't log full interaction object
});
