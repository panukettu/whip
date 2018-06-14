#! /usr/bin/env node

const whip = require("commander");
const JiraHelper = require("./jira");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./storage");
}

var jira = new JiraHelper("boo");
_auth = "bobo";

whip
  .version("1.0.0")
  .option("-u, --username [username]", "jira [username]", "username");

whip
  .command("work <issueId> <hours> <description>")
  .description("add a worklog to a jira issue")
  .action((work, issueId, description) => {
    if (jira.isAuthenticated()) {
      jira.logWork(work, issueId, description);
    } else {
      console.info(
        `You must authenticate to JIRA using 'whip login [username] [password]'`
      );
    }
  });

whip
  .command("login <username> <password>")
  .description("login to jira")
  .action(jira.login);

whip
  .command("who")
  .description("login to jira")
  .action(jira.who);

whip
  .command("clear")
  .description("reset saved data")
  .action(() => {
    localStorage.clear();
    console.info(`Removed items from localStorage`);
  });

whip.parse(process.argv);

if (!whip.args.length) {
  whip.help();
}
