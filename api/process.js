const sharp = require("sharp");
const formidable = require("formidable");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Form parse error" });
    }

    try {
      const file = files.image;
      const buffer = require("fs").readFileSync(file.filepath);

      let processed = sharp(buffer).grayscale(); // example
      const outputBuffer = await processed.toBuffer();

      res.setHeader("Content-Type", "image/png");
      res.send(outputBuffer);
    } catch (e) {
      console.error("Processing error", e);
      res.status(500).json({ error: "Image processing failed" });
    }
  });
};
