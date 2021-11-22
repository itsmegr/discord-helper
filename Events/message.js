const { Command, cmdsAll } = require("../util/command");

module.exports = async (client, message) => {
  try {
    if (message.author.bot) return; // Return if author is bot

    //getting prefix of message
    if (message.content.indexOf(client.config.prefix) !== 0) return;

    const args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log("New command ran ",command, args);
    if (cmdsAll.indexOf(command) == -1) {
      message.channel.send("invalid command");
    }
    new Command(command, args).execute(client, message);
  } catch (err) {
    console.log(err);
  }
};
