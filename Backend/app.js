const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>This is what the server returns</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});
