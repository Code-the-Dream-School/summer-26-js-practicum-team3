import app from './src/app.js';
import { prisma } from './src/db.js';
import { DB_CONNECTION_ERROR_CODES } from './src/middleware/error-handler.middleware.js'

const PORT = process.env.PORT || 8081;

//Protects against: server coming up "healtly" while the DB is actually unreachable.
// Prisma connects lazily by default, so without this, the pocess would only discover 
// a broken DB on the first real request.
async function checkDatabaseConnection() {
  try {
    // await prisma.$connect(); $connect() only sets up the driver adapter - it doesn't actually
    // reach the database (confirmed: it "succeeds" even against a nonexistent database name, 
    // with both PrismaPg and PrismaNeon). A real query is the only way to force an actual
    // round-trip and catch a broken connection here.
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connected successfully');
  } catch (err) {
    if (DB_CONNECTION_ERROR_CODES.has(err.code)) {
      console.error(
        `Couldn't connect to the database (${err.code}). Is it running?`,
      );
    } else {
      console.error('Database connection error:', err);
    }
    process.exit(1);
  }
}
// We wait for the DB check to finish (await) before starting the server
// Otherwise the server could start taking requests while the check is still running.
await checkDatabaseConnection();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
