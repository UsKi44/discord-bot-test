# Discord Music Bot 🎵

A lightweight Discord music bot built with discord.js that brings high-quality music playback to your Discord server.

## Features

- Music playback from YouTube and other supported platforms
- Queue management
- High-quality audio streaming

## Prerequisites

Before setting up the bot, make sure you have:

- [Node.js](https://nodejs.org/) (v16 or higher) installed
- A Discord account and access to the [Discord Developer Portal](https://discord.com/developers/applications)

## Security Notice

⚠️ **Important Security Information:**

- Never commit your `.env.test` file to version control
- Add `.env.test` to your `.gitignore` file
- Never share your bot token or other credentials publicly
- Regularly rotate your bot token if you suspect it has been compromised

## Required Configuration

1. Create a `.env.test` file in the root directory with the following variables:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
```

### How to obtain the required variables:

1. **DISCORD_TOKEN**:

   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application or select an existing one
   - Navigate to the "Bot" section
   - Click "Reset Token" and copy your bot token
   - ⚠️ Keep this token secret and secure!

2. **CLIENT_ID**:

   - In the Discord Developer Portal, select your application
   - Navigate to the "General Information" section
   - Copy the "Application ID" (this is your CLIENT_ID)

3. **GUILD_ID**:
   - Open Discord and go to your server
   - Right-click on your server name
   - Click "Copy Server ID" (Enable Developer Mode in Discord settings if you don't see this option)

## Installation & Setup

1. Install dependencies:

```bash
npm install
```

2. Deploy bot commands:

```bash
node ./deploy-commands.js
```

3. Start the bot:

```bash
node .
```

## Deployment Options

You can run this bot in two ways:

1. **Locally**: Run it on your personal computer
2. **Cloud**: Deploy it to a virtual machine service (AWS, Google Cloud, DigitalOcean, etc.)

Note: When deploying to cloud services, ensure you:

- Use secure environment variable storage
- Never expose configuration files
- Keep your deployment keys private

## Dependencies

```json
{
  "@discord-player/extractor": "^7.0.0",
  "@discordjs/voice": "^0.18
```
