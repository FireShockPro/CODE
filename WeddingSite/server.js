const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const rsvpFile = path.join(__dirname, 'rsvps.json');

const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'certificate.crt'))
};

function send404(res) {
  res.statusCode = 404;
  res.end('Not found');
}

const server = https.createServer(options, (req, res) => {
  const parsed = url.parse(req.url, true);
  if (req.method === 'GET') {
    let filePath = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
    filePath = path.join(publicDir, decodeURIComponent(filePath));
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) return send404(res);
      const ext = path.extname(filePath).toLowerCase();
      const map = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      };
      res.setHeader('Content-Type', map[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    });
    return;
  } else if (req.method === 'POST' && parsed.pathname === '/rsvp') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        data.timestamp = new Date().toISOString();
        fs.readFile(rsvpFile, 'utf8', (err, content) => {
          let arr = [];
          if (!err) {
            try { arr = JSON.parse(content); } catch (e) { arr = []; }
          }
          arr.push(data);
          fs.writeFile(rsvpFile, JSON.stringify(arr, null, 2), (err2) => {
            if (err2) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: err2.message }));
              return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          });
        });
      } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: 'invalid json' }));
      }
    });
    return;
  } else {
    send404(res);
  }
});

server.listen(PORT, () => console.log(`Server listening on https://localhost:${PORT}`));
