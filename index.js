require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const url = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const urlDatabase = {};
let shortUrlCounter = 1;

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  let originalUrl = req.body.url;

  try {
    const parsedUrl = new URL(originalUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }

    // Create short URL
    const shortUrl = shortUrlCounter++;
    urlDatabase[shortUrl] = originalUrl;

    console.log("URL shortened:", originalUrl, "to", shortUrl);
    res.json({ original_url: originalUrl, short_url: shortUrl });
  } catch (error) {
    console.error("Invalid URL:", originalUrl, error.message);
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = parseInt(req.params.short_url);
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    console.log("Redirecting", shortUrl, "to", originalUrl);
    res.redirect(originalUrl);
  } else {
    console.log("Short URL not found:", shortUrl);
    res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
