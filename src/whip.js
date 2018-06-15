#! /usr/bin/env node

const whip = require("commander");
const JiraHelper = require("./jira");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./storage");
}

var jira = new JiraHelper();

whip.version("1.0.0");

whip
  .command("work <issueId> <hours> <description>")
  .description("add a worklog to a jira issue")
  .action((work, issueId, description) => {
    if (jira.isAuthenticated() && jira.hasApiUrl()) {
      jira.logWork(work, issueId, description);
    } else {
      !jira.isAuthenticated() &&
        console.info(
          `You must authenticate to JIRA using 'whip login [username] [password]'`
        );
      !jira.hasApiUrl() && console.info(`You must set an API url for JIRA`);
    }
  });

whip
  .command("login <username> <password>")
  .description("make a base64 hash for authentication from your login info")
  .action(jira.login);

whip
  .command("api <url>")
  .description("set api url")
  .action(apiUrl => {
    localStorage.setItem("jiraApiUrl", apiUrl);
    console.info(`Set JIRA API as ${apiUrl}`);
  });

whip
  .command("storage <key>")
  .description("check storage values for [key]")
  .action(key => {
    console.info(localStorage.getItem(key));
  });

whip
  .command("clear")
  .description("clear storage")
  .action(() => {
    localStorage.clear();
    console.info(`Removed items from localStorage`);
  });

whip.parse(process.argv);

if (!whip.args.length) {
  whip.help();
}
