const express = require("express");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Always serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Image processing API
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
app.post("/api/process", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No image uploaded");
    const options = JSON.parse(req.body.options || "{}");
    let image = sharp(req.file.buffer);
    if (options.grayscale) image = image.grayscale();
    if (options.flip) image = image.flip();
    if (options.flop) image = image.flop();
    if (options.rotate) image = image.rotate(parseInt(options.rotate));
    if (options.resizeWidth && options.resizeHeight) {
      image = image.resize({ width: parseInt(options.resizeWidth), height: parseInt(options.resizeHeight) });
    } else if (options.resizeWidth) {
      image = image.resize({ width: parseInt(options.resizeWidth) });
    } else if (options.resizeHeight) {
      image = image.resize({ height: parseInt(options.resizeHeight) });
    }
    if (options.blur) image = image.blur(parseFloat(options.blur));
    if (options.brightness || options.contrast) {
      image = image.modulate({
        brightness: parseFloat(options.brightness) || 1,
        saturation: parseFloat(options.contrast) || 1,
      });
    }
    let output = await image.png().toBuffer();
    // If maxSize is set, compress until under maxSize (KB)
    if (options.maxSize && output.length > options.maxSize * 1024) {
      let quality = 90;
      while (output.length > options.maxSize * 1024 && quality > 10) {
        output = await image.png({ quality }).toBuffer();
        quality -= 10;
      }
    }
    res.setHeader("Content-Type", "image/png");
    res.send(output);
  } catch (err) {
    res.status(500).send("Error processing image");
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));