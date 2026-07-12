import app from './src/app.js';

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
