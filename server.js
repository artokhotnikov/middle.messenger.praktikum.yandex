import express from "express";
import path from "path";

const __dirname = path.resolve();
const app = express();
const PORT = 3000;

app.use(express.static(path.resolve(__dirname, "dist")));

app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});
