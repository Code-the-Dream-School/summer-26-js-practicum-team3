import { StatusCodes } from 'http-status-codes';

const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: `No route found for ${req.method} ${req.path}`,
  });
};

export default notFound;
