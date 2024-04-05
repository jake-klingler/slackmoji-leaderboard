import path from "path";
import fs from "node:fs/promises";

const directoryPath = "./data";

const leaderboard = {};

async function processFiles() {
  // read all the json files in data folder
  const files = await fs.readdir(directoryPath);
  // load, parse, and examine each json file, counting
  // the number of emojis each user has added
  const filePromises = files.map(async (file) => {
    if (path.extname(file) === ".json") {
      const data = await fs.readFile(path.join(directoryPath, file), "utf-8");
      const jsonData = JSON.parse(data);

      jsonData?.emoji?.forEach((emoji) => {
        const user = emoji?.user_display_name;
        if (user in leaderboard) {
          leaderboard[user] = leaderboard[user] + 1;
        } else {
          leaderboard[user] = 1;
        }
      });
      console.log(`processed: ${file}`);
    }
  });
  await Promise.all(filePromises);

  const entries = Object.entries(leaderboard);
  const sortedLeaderboard = entries.sort(
    ([, valueA], [, valueB]) => valueB - valueA,
  );
  const leaderboardTable = sortedLeaderboard.map(([user, count]) => ({
    user,
    count,
  }));
  console.table(leaderboardTable);

  let total = 0;
  leaderboardTable.forEach(({ user, count }) => {
    total += count;
  });
  console.log("total: ", total);

  // save formatted table to txt file on disk
  let consoleOutput = "";
  const originalLog = console.log;
  console.log = (output) => {
    consoleOutput += output + "\n";
  };
  console.table(leaderboardTable);
  console.log = originalLog;
  // remove terminal escape codes for coloring
  consoleOutput = consoleOutput.replace(/\x1B[[(]?.*?[a-zA-Z]/g, "");
  await fs.writeFile("leaderboard.txt", consoleOutput);
}

await processFiles();
