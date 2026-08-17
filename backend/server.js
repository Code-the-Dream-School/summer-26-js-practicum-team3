import app from './src/app.js';
import { prisma } from './src/db.js';
import { DB_CONNECTION_ERROR_CODES } from './src/middleware/error-handler.middleware.js'

const PORT = process.env.PORT || 8081;

//Protects against: server coming up "healtly" while the DB is actually unreachable.
// Prisma connects lazily by default, so without this, the process would only discover 
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

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code == 'EADDRINUSE') {
     console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', err)
  }
  process.exit(1);
})

// Shuts the server down safely when it's stoped (Ctrl+C, docker stop, etc).
let isShuttingDown = false;
async function shutdown(code = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('Shutting down gracefully...');
  try{
    // server.close() only stops NEW connections - it waits for existing
    // ones (including idle keep-alive sockets) to close on their own,
    // which can hang forever if a client keeps a connection open.
    // closeIdleConnections() forces those idle sockets shut immediately.
    server.closeIdleConnections();
    await new Promise((resolve) => server.close(resolve));
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Prisma disconnected');
  } catch (err) {
     console.error('Error during shutdown:', err);
     code = 1;
  } finally {
    console.log('Exiting process...');
    process.exit(code);
  }
}

process.on('SIGINT', () => shutdown(0)); //Ctrl+c
process.on('SIGTERM', () => shutdown(0));  // e.g. `docker stop`

// Catches errors that happen outside a normal request (for example in a background job or a timer). 
// Errors inside route handlers are already handled by Express and errorHandler,
// this is just a backup for everything else, so the app doesn't crash with no logs.
process.on('uncaughtException', (err) => {
   console.error('Uncaught exception:', err);
   shutdown(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  shutdown(1);
});
