require("dotenv").config();

const { REST, Routes } = require("discord.js");
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

// Add environment variable validation
if (!token) {
  throw new Error("Missing DISCORD_TOKEN in environment variables");
}

if (!clientId) {
  throw new Error("Missing CLIENT_ID in environment variables");
}

const fs = require("node:fs");
const path = require("node:path");

const commands = [];

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

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    if (commands.length === 0) {
      console.warn("Warning: No commands found to deploy!");
      return;
    }

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // Enhanced error handling
    if (error.status === 401) {
      console.error("Error: Invalid Discord token provided");
    } else if (error.status === 403) {
      console.error("Error: Bot lacks permissions to deploy commands");
    } else {
      console.error("Error deploying commands:", error.message);
    }
    process.exit(1);
  }
})();
