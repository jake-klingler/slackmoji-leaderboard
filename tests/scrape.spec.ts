import fs from "fs";
import { test, expect, chromium } from "@playwright/test";

test("run", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // listen for emoji api calls, intercept json responses, and save them to disk
  let counter = 0;
  await page.route(
    "https://honor.slack.com/api/emoji.adminList**",
    async (route) => {
      // Fetch original response.
      const response = await route.fetch();
      let data = await response.json();
      fs.writeFile(
        `data/${counter.toString().padStart(3, "0")}.json`,
        JSON.stringify(data, null, 2),
        (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        },
      );
      counter++;
      await route.fulfill({ response });
    },
  );

  await page.goto(process?.env?.SLACK_EMOJI_URL ?? "");

  await expect(page.locator("html")).toContainText("Customize Your Workspace", {
    timeout: 300_000,
  });

  await page.mouse.move(page.viewportSize()?.width ?? 1000 / 2, 600);
  await page.mouse.wheel(0, 10000);
});
