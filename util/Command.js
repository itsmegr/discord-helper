/*
Here automating the new command adding process
To add new command just add a new file for that command in Commands folder and start writing code
there, no need to write if/else of switch for this 
*/

const fs = require("fs");

const cmdFunctionsAll = {};
/*
  {
        joinFunction : () => {}
  }
*/

const files = fs
  .readdirSync("./Commands/")
  .filter((file) => file.endsWith(".js"));

const cmdsAll = files.map((x) => x.split(".")[0]);
//[join]

for (const file of files) {
  const cmdFunction = require(`../Commands/${file}`);
  const cmdName = file.split(".")[0];

  cmdFunctionsAll[`${cmdName}Function`] = cmdFunction;
}

class Command {
  constructor(key, args) {
    this.key = key;
    this.args = args;
  }
  execute(client, message) {
    cmdFunctionsAll[`${this.key}Function`](
      client,
      message,
      this.key,
      this.args
    );
  }
}
module.exports = {
  Command,
  cmdsAll,
};
