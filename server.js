const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

// Resolve path to app containing .next directory
const subAppDir = path.resolve(__dirname, 'apps/web-store');

// Load .env into process.env if present
const envFiles = [path.join(__dirname, '.env'), path.join(subAppDir, '.env')];
for (const envPath of envFiles) {
  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.slice(0, idx).trim();
          let v = trimmed.slice(idx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          if (v) {
            process.env[k] = v;
          }
        }
      });
    } catch {}
  }
}

// Auto-correct invalid SMTP hostnames (cPanel outgoing mail is manga.jlm.com.ng)
if (
  process.env.SMTP_HOST === 'mail.manga.jlm.com.ng' ||
  process.env.SMTP_HOST === 'smtp.manga.jlm.com.ng' ||
  process.env.SMTP_HOST === 'mail.jlm.com.ng'
) {
  console.log('[Server] Auto-correcting SMTP_HOST to manga.jlm.com.ng');
  process.env.SMTP_HOST = 'manga.jlm.com.ng';
}

// Always run in production mode on cPanel to serve pre-built optimized bundle
const dev = false;
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

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
      // Force HTTPS when behind reverse proxy (cPanel / CloudLinux / Nginx) in production
      const proto = req.headers['x-forwarded-proto'];
      const host = req.headers['host'];
      if (proto === 'http' && host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
        res.writeHead(301, { Location: `https://${host}${req.url}` });
        res.end();
        return;
      }

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
