import sharp from "sharp";
export default async function handler(req, res) {
  if (req.method !== "POST") { return res.status(405).json({ error: "Only POST requests allowed" }); 
                             } try { // Get the image as base64 from frontend const { image, action } = req.body; if (!image)
    { return res.status(400).json({ error: "No image provided" }); }
    // Convert base64 to buffer
    const buffer = Buffer.from(image.split(",")[1], "base64");
    let processed = sharp(buffer); // Apply transformations switch (action) 
    { case "grayscale": processed = processed.grayscale();
     break; 
     case "flip": processed = processed.flip(); 
     break; 
     case "rotate": processed = processed.rotate(90);
     break;
     case "resize": processed = processed.resize(300, 300);
     break;
     case "contrast": processed = processed.modulate({ contrast: 2 });
     break;
     case "brightness": processed = processed.modulate({ brightness: 1.5 });
     break; 
     case "blur": processed = processed.blur(3); 
     break;
     default: break;
    } // Convert back to base64
    const outputBuffer = await processed.toBuffer(); 
    const base64Image = data:image/png;base64,${outputBuffer.toString("base64")};
    res.status(200).json({ image: base64Image }); 
  } catch (err) { console.error("Error processing image:", err); res.status(500).json({ error: "Failed to process image" }); } }


