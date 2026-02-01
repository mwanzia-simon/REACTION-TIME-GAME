const express = require("express");
const app = express();
const PORT = 3000;
app.use(cors());



app.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});
