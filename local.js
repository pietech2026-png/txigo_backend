import app from "./server.js";

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
});
