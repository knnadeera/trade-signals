const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { initializeCron } = require("./src/lib/cron");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  // Initialize cronjob with socket.io instance
  initializeCron(io);

  server.listen(3002, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3001");
  });
});
