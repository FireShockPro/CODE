# Kelby & Andrew — Wedding Site

Local dev instructions

1. Install Node.js (if you don't have it).
2. From the project root run:

```bash
node server.js
```

3. Open http://localhost:3000 in your browser.

What it does
- Serves a static website from `/public`.
- Includes wedding details, story, and images.
- Links to a Google Form for RSVPs.

Notes
- No external dependencies — simple Node built-in server.
- Replace placeholder images and text with your own.
- Update the Google Form URL in `public/index.html`.
- To deploy, adapt to a static host or add serverless functions if needed.
