const chalk = require("chalk");
const puppeteer = require("puppeteer");
const { server, channel, delay, maxRandomDelay } = require("./config.js");
const arg = process.argv[2] || 0;

let page;

const log = (message) => {
  console.debug(`[${new Date().toLocaleTimeString()}] ${message}`);
};

// send message to current channel
const send = async (message) => {
  await page.type(".textArea-2CLwUE", message, {
    delay: 100,
  });
  log(`Sent ${message}`);
  if (arg !== "dry") {
    await page.keyboard.press("Enter");
  }
};

const run = async () => {
  // go to /server/channel
  await page.goto(`https://discord.com/channels/${server}/${channel}`, {
    waitUntil: "networkidle2",
  });
  await page.waitForSelector(".textArea-2CLwUE", {
    timeout: 0,
  });
  // send messages
  await send("!work");
  await send("!dice 50");

  // wait x minutes + random delay with max
  setTimeout(run, (Math.random() * maxRandomDelay + delay) * 60000);
};

(async () => {
  console.log(
    chalk.hex("#AA4444")(`
    ███╗   ███╗███████╗███████╗ ██████╗       ███╗   ███╗██╗███╗   ██╗███████╗██████╗ 
    ████╗ ████║██╔════╝██╔════╝██╔════╝       ████╗ ████║██║████╗  ██║██╔════╝██╔══██╗
    ██╔████╔██║█████╗  █████╗  ███████╗ █████╗██╔████╔██║██║██╔██╗ ██║█████╗  ██████╔╝
    ██║╚██╔╝██║██╔══╝  ██╔══╝  ██╔═══██╗╚════╝██║╚██╔╝██║██║██║╚██╗██║██╔══╝  ██╔══██╗
    ██║ ╚═╝ ██║███████╗███████╗╚██████╔╝      ██║ ╚═╝ ██║██║██║ ╚████║███████╗██║  ██║
    ╚═╝     ╚═╝╚══════╝╚══════╝ ╚═════╝       ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝                                                                
    `)
  );

  let headless = true;
  switch (arg) {
    case "dry":
      log("Dry run mode");
      headless = false;
      break;
    case "login":
      log("Login mode");
      headless = false;
      break;
    default:
      log(`Running miner ${arg > 0 ? `with ${arg} minutes pre-delay` : ""}`);
      break;
  }

  let browser = await puppeteer.launch({
    headless,
    userDataDir: `${process.cwd()}/.userdata`, // must be a full path
    defaultViewport: null,
  });
  page = await browser.newPage();

  await page.goto("https://discord.com/login", {
    waitUntil: "networkidle2",
  });

  // wait for us to be logged in
  await page.waitForSelector(".privateChannels-oVe7HL", {
    timeout: headless ? 30000 : 0,
  });

  log(`Logged in!`);

  if (arg !== "login") {
    // run miner with initial delay
    setTimeout(run, arg > 0 ? arg * 60000 : 0);
  } else {
    browser.close();
  }
  debugger;
})().catch((e) => {
  log(`Error: ${e}\n\n Try running "npm start login"`);
});
