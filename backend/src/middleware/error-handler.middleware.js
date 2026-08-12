import { StatusCodes } from 'http-status-codes';

// Prisma error codes for "the database itself is unreachable", not a bad query. 
// These come from Prisma's own normalized layer (P1xxx = "common" errors) 
// and work the same whether we're on PrismaNeon or PrismaPg - unlike err.name, 
// which with driver adapters is always PrismaClientKnownRequestError, never PrismaClientInitializationError
const DB_CONNECTION_ERROR_CODES = new Set([
  'P1000',        // authentication failed
  'P1001',        // can't reach database server
  'P1002',        // database server was reached but timed out
  'P1003',        // database does not exist
  'P1008',        // operation timed out
  'P1017',        // server closed the connection
  'ECONNREFUSED', // raw driver code, seen with PrismaPg against a closed port
]);

const errorHandler = (err, req, res, next) => {
  if (DB_CONNECTION_ERROR_CODES.has(err.code)) {
    console.error(
      `DB connection error (${err.code}) - is the database running/reachable?`,
    );
  }

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  if (statusCode >= 400 && statusCode < 500) {
    console.warn(`WARN: ${err.name} - ${err.message}`);
  } else {
    console.error(`ERROR: ${err.name} - ${err.message}`, err.stack);
  }

  const message =
    statusCode === StatusCodes.INTERNAL_SERVER_ERROR
      ? 'Something went wrong, please try again'
      : err.message;

  if (res.headersSent) return next(err);
  res.status(statusCode).json({ message });
};

export default errorHandler;
