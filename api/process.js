// api/process.js
const sharp = require("sharp");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { image, action, options } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Convert base64 → Buffer
    const buffer = Buffer.from(image.split(",")[1], "base64");

    let processed = sharp(buffer);

    // Apply transformations
    switch (action) {
      case "grayscale":
        processed = processed.grayscale();
        break;
      case "flipV":
        processed = processed.flip();
        break;
      case "flipH":
        processed = processed.flop();
        break;
      case "rotate":
        processed = processed.rotate(options?.angle || 90);
        break;
      case "resize":
        processed = processed.resize(
          options?.width || 300,
          options?.height || 300
        );
        break;
      case "brightness":
        processed = processed.modulate({
          brightness: options?.value || 1.2,
        });
        break;
      case "contrast":
        processed = processed.linear(options?.value || 1.2, 0);
        break;
      case "blur":
        processed = processed.blur(options?.value || 2);
        break;
      default:
        break;
    }

    // Convert processed buffer → Base64
    const outputBuffer = await processed.png().toBuffer();
    const base64Image = `data:image/png;base64,${outputBuffer.toString(
      "base64"
    )}`;

    res.status(200).json({ image: base64Image });
  } catch (err) {
    console.error("Error processing image:", err);
    res.status(500).json({ error: "Failed to process image" });
  }
};
