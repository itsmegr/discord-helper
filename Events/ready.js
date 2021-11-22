module.exports = async (client) => {
  console.log("Bot is available for supprt");
  client.user.setPresence({
    activity: { name: "Here to help", type: "WATCHING" },
    status: "online",
  });
};
