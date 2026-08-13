import { Prisma } from '../generated/prisma/client.ts';
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

// Query-level Prisma errors: the DB responded, but rejected the query semantically.
const PRISMA_QUERY_ERROR_STATUS = {
  P2002: StatusCodes.CONFLICT,      // unique constraint
  P2014: StatusCodes.CONFLICT,      // relation violation
  P2001: StatusCodes.NOT_FOUND,     // record in where clause not found
  P2015: StatusCodes.NOT_FOUND,
  P2018: StatusCodes.NOT_FOUND,
  P2025: StatusCodes.NOT_FOUND,     // record required for update/delete not found
  P2003: StatusCodes.BAD_REQUEST,   // foreign key
  P2004: StatusCodes.BAD_REQUEST,
  P2006: StatusCodes.BAD_REQUEST,
  P2007: StatusCodes.BAD_REQUEST,
  P2011: StatusCodes.BAD_REQUEST,   // null violation
  P2012: StatusCodes.BAD_REQUEST,
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let clientMessage = err.message;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (DB_CONNECTION_ERROR_CODES.has(err.code)) {
      console.error(
        `DB connection error (${err.code}) - is the database running/reachable?`,
      );
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    } else if (PRISMA_QUERY_ERROR_STATUS[err.code]) {
      statusCode = PRISMA_QUERY_ERROR_STATUS[err.code];
      clientMessage = 'Request could not be completed'; // don't leak table/column names from err.message
    } else {
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
  }

  if (statusCode >= 400 && statusCode < 500) {
    console.warn(`WARN: ${err.name} - ${err.message}`);
  } else {
    console.error(`ERROR: ${err.name} - ${err.message}`, err.stack);
  }

  const message =
    statusCode === StatusCodes.INTERNAL_SERVER_ERROR
      ? 'Something went wrong, please try again'
      : clientMessage;

  res.status(statusCode).json({ message });
};

export default errorHandler;
