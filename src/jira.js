const fetch = require("node-fetch");

class JiraHelper {
  login(username, password) {
    console.info(`Encoding user login info..`);
    try {
      const string = `${username}:${password}`;
      const encoded = Buffer.from(string).toString("base64");

      localStorage.setItem("jiraAuth", `Basic ${encoded}`);

      console.info(`Stored authentication info to localstorage`);
    } catch (err) {
      console.info(`Error trying to store authentication info: ${err}`);
    }
  }

  logWork(issueId, hours, description) {
    console.info(
      `Adding worklog: ${issueId} | ${hours} hours | ${description}`
    );

    // TODO: count starting time from hours..
    const date = new Date();

    const inputData = {
      comment: description,
      started: new Date(date).toISOString,
      timeSpentSeconds: hours * 60 * 60
    };

    const reqOptions = {
      headers: {
        Authorization: localStorage.getItem("jiraAuth"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputData),
      method: "POST"
    };

    const url = `${localStorage.getItem(
      "jiraApiUrl"
    )}/issue/${issueId}/worklog`;

    fetch(url, reqOptions)
      .then(res => res.json())
      .then(json => {
        console.info(
          `Created worklog at: ${localStorage.getItem(
            "jiraUrl"
          )}/browse/${issueId}`
        );
      })
      .catch(err => console.log(err));
  }

  setApi(apiUrl) {
    localStorage.setItem("jiraApiUrl", apiUrl);
    console.info(`Set JIRA API as ${apiUrl}`);
    const array = apiUrl.split("/");

    const baseUrl = `${array[0]}//${array[2]}`;
    localStorage.setItem("jiraUrl", baseUrl);
    console.info(`Set JIRA API as ${apiUrl} - Base URL ${baseUrl}`);
  }

  isAuthenticated() {
    return !!localStorage.getItem("jiraAuth");
  }

  hasApiUrl() {
    return !!localStorage.getItem("jiraApiUrl");
  }
}

module.exports = JiraHelper;
