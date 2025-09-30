const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Enable CORS
app.use(cors());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Your existing API or image processing routes can stay below this if needed
// Example:
// app.post("/process-image", async (req, res) => {
//   // your logic
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
