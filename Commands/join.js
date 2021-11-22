const { getRows, googleSheets, updateRows } = require("../util/init_google");


// Goes the main logic for join command

module.exports = async (client, message, command, args) => {
  //1. get all the data from testing file
  const allRows = await getRows(client.config.testing_sheet_id, "Sheet1!A:Z");

  const clan = args[0];
  //2. cheking if there is any clan or not
  let rowIn = -1;
  for (let i = 1; i < allRows.length; i++) {
    if (clan == allRows[i][0]) {
      rowIn = i;
    }
  }

  if (rowIn == -1) {
    message.channel.send("No such clan exists");
    return;
  }

  //Now check weather clan is accepting user or NOT
  let IsAccepting = allRows[rowIn][4].toLowerCase();
  if (IsAccepting == "no" || IsAccepting == "n") {
    message.channel.send(
      "Sorry Admission Closed for that clan Now. Try again later or contact admin"
    );
    return;
  }
  //check weather with this message.authId already exist in that clan or not
  let clanRows = await getRows(allRows[rowIn][3], "Sheet1!A:Z");
  for (let i = 0; i < clanRows.length; i++) {
    if (message.author.id == clanRows[i][1]) {
      message.channel.send(`You are already in ${clan}`);
      return;
    }
  }

  await message.channel.send("Check your DM for email verification");

  await message.author.send("Enter your email for conformation");

  //clan is there
  let filter = (m) => m.author.id === message.author.id;
  message.author.dmChannel
    .awaitMessages(filter, {
      max: 1,
      time: 30000,
      errors: ["time"],
    })
    .then(async (dmMsg) => {
      dmMsg = dmMsg.first();
      dmMsg.channel.send(`Got your email, cheking in backend`);
      let email = dmMsg.content.trim().toLowerCase();
      //now check wether user is already part of that or not with given email

      let userRowIn = -1;
      for (let i = 0; i < clanRows.length; i++) {
        if (email == clanRows[i][0]) {
          userRowIn = i;
          break;
        }
      }
      if (userRowIn == -1) {
        dmMsg.channel.send(
          "Invalid Email Id, This email is not registered in our database. Contact for support"
        );
        return
      }
      //some row is there for user
      //now check weather he is part of already this clone or not
      if (clanRows[userRowIn].length > 1) {
        dmMsg.channel.send(
          `Your email id already is already authorized to access ${clan}, try with another email or contact for support`
        );
        return;
      }
      let newUpdatedRow = clanRows[userRowIn];
      newUpdatedRow[1] = message.author.id;
      newUpdatedRow[2] = new Date().toISOString().split("T")[0];
      clanRows[userRowIn] = newUpdatedRow;
      let res = await updateRows(allRows[rowIn][3], "Sheet1!A:Z", clanRows);

      const chennal_for_which_acess_is_asked = message.guild.channels.cache.get(
        allRows[rowIn][1]
      );
      chennal_for_which_acess_is_asked.createOverwrite(message.author, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
      });

      await dmMsg.channel.send(
        `Given access for ${clan} channal, Check Discord server`
      );

      const system_info_channel = message.guild.channels.cache.get(
        client.config.system_update_log_id
      );

      //sending message in system_infor_channel for admin to moniter all thing
      system_info_channel.send(`New User has joined a clan! Here are the details,
User Email : ${email},
User Id : ${message.author.id},
Joined Clan : ${clan}`);
      return;
    })
    .catch((res) => {
      console.log(res);
        message.author.send(`Timeout,
Joining process failed, you didnot responded within 30 seconds`)
    });
};
