import app from "./app.js";
import { DEFAULT_PORT } from "./config/constants.js";

app.listen(DEFAULT_PORT, () => {
  console.log(`Northbridge FAQ backend running on http://localhost:${DEFAULT_PORT}`);
});
