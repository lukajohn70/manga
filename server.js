const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

// Always run in production mode on cPanel to serve pre-built optimized bundle
const dev = false;
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

// Resolve path to app containing .next directory
const subAppDir = path.resolve(__dirname, 'apps/web-store');
const appDir = fs.existsSync(path.join(subAppDir, '.next'))
  ? subAppDir
  : (fs.existsSync(path.join(__dirname, '.next')) ? __dirname : subAppDir);

let next;
try {
  next = require('next');
} catch {
  try {
    next = require(path.join(subAppDir, 'node_modules', 'next'));
  } catch (e) {
    console.error('Could not locate Next.js dependency:', e.message);
    process.exit(1);
  }
}

const app = next({
  dev,
  dir: appDir,
  hostname,
  port,
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, () => {
    console.log(`> MANGA Storefront is running in production mode on http://${hostname}:${port} (PID: ${process.pid})`);
  });
}).catch((err) => {
  console.error('Error starting MANGA Storefront server:', err);
  process.exit(1);
});
