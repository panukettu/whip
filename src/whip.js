#! /usr/bin/env node

const whip = require("commander");
const JiraHelper = require("./jira");
const { speak, warn, error } = require("./helpers");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./storage");
}

var jira = new JiraHelper();

whip.version("1.0.0");

whip
  .command("work <issueId> <hours> <description>")
  .description("adds a worklog to a jira issue")
  .action((work, issueId, description) => {
    if (jira.isAuthenticated() && jira.hasApiUrl()) {
      jira.logWork(work, issueId, description);
    } else {
      !jira.isAuthenticated() &&
        warn(
          `You must authenticate to JIRA using 'whip login [username] [password]'`
        );
      !jira.hasApiUrl() && warn(`You must set an API url for JIRA`);
    }
  });

whip
  .command("login <username> <password>")
  .description("make a base64 hash for authentication from your login info")
  .action(jira.login);

whip
  .command("api <url>")
  .description("set api url")
  .action(jira.setApi);

whip
  .command("storage <key>")
  .description("check storage values for [key]")
  .action(key => {
    speak(localStorage.getItem(key));
  });

whip
  .command("clear")
  .description("clear storage")
  .action(() => {
    localStorage.clear();
    speak(`*  Removed items from localStorage`);
  });

whip.parse(process.argv);

if (!whip.args.length) {
  whip.help();
}
