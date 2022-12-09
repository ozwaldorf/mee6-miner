const chalk = require("chalk");
const puppeteer = require("puppeteer");
const { server, channel, delay, maxRandomDelay } = require("./config.js");
const arg = process.argv[2] || 0;

let page;

// send message to current channel
const send = async (message) => {
  await page.type(
    ".inner-NQg18Y > .textArea-2CLwUE > div > .markup-eYLPri > div",
    message,
    {
      delay: 100,
    }
  );
  await page.keyboard.press("Enter");
  console.debug(`[${new Date().toLocaleTimeString()}] Sent ${message}`);
};

const run = async () => {
  // go to /server/channel
  await page.goto(`https://discord.com/channels/${server}/${channel}`, {
    waitUntil: "networkidle2",
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
  if (arg === "login") {
    console.debug(`[${new Date().toLocaleTimeString()}] Login mode`);
    headless = false;
  }

  let browser = await puppeteer.launch({
    headless,
    userDataDir: `${process.cwd()}/.userdata`,
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

  console.debug(`[${new Date().toLocaleTimeString()}] Logged in!`);

  if (headless) {
    // run if not in login mode, after pre-delay
    setTimeout(run, arg * 60000);
  } else {
    browser.close();
  }
  debugger;
})().catch((e) => {
  console.error(`Error: ${e}\n\n Try running "npm start login"`);
});
