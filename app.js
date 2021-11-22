require("dotenv").config();
const { Client } = require("discord.js");
const fs = require("fs");

const config = require("./config.json");
const { initGoogle } = require("./util/init_google");

const client = new Client({ disableMentions: "everyone" });
client.config = config;

async function start() {
  try {
    // Loading Discordjs Events
    const eventFiles = fs
      .readdirSync("./Events/")
      .filter((file) => file.endsWith(".js"));

    //registering events
    for (const file of eventFiles) {
      const event = require(`./Events/${file}`);
      const eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    }

    //logging in discord
    await client.login(config.botToken);

    //initializing google client for using google apis
    await initGoogle();
  } catch (err) {
    console.log(err);
  }
}

start();
