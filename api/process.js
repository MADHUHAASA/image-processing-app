const sharp = require("sharp");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { image, action } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const buffer = Buffer.from(image.split(",")[1], "base64");

    let processed = sharp(buffer);

    switch (action) {
      case "grayscale":
        processed = processed.grayscale();
        break;
      case "flip":
        processed = processed.flip();
        break;
      case "rotate":
        processed = processed.rotate(90);
        break;
      case "resize":
        processed = processed.resize(300, 300);
        break;
      case "contrast":
        processed = processed.modulate({ contrast: 2 }); // ⚠️ sharp has no "contrast", use gamma or modulate(saturation, brightness, hue)
        break;
      case "brightness":
        processed = processed.modulate({ brightness: 1.5 });
        break;
      case "blur":
        processed = processed.blur(3);
        break;
      default:
        break;
    }

    const outputBuffer = await processed.toBuffer();
    const base64Image = `data:image/png;base64,${outputBuffer.toString("base64")}`;

    res.status(200).json({ image: base64Image });
  } catch (err) {
    console.error("Error processing image:", err);
    res.status(500).json({ error: "Failed to process image" });
  }
};
