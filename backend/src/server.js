import app from "./app.js";
import { DEFAULT_PORT } from "./config/constants.js";

console.log('Starting Northbridge FAQ backend...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('PORT:', process.env.PORT || DEFAULT_PORT);

const port = Number(process.env.PORT) || DEFAULT_PORT;
app.listen(port, '0.0.0.0', () => {
  console.log(`Northbridge FAQ backend running on http://${process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost'}:${port}`);
});
