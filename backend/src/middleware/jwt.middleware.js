import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const send401 = (res) => {
  res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ message: 'No user is authenticated.' });
}

export default (req, res, next) => {
  const token = req?.cookies?.jwt;
  if (!token) {
      return send401(res);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return send401(res);
    }
    // put id into req.user, now controllers, for example, recipe.controller.js
    // they can read req.user.id instead of hard-coded user_id = 1
    req.user = { id: decoded.id };
    // for these operations we have to check for cross site request forgery
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
      // the frontend must send the same csrfToken in a separate header (not in the cookie!)
      if (req.get('X-CSRF-TOKEN') !== decoded.csrfToken) {
        return send401(res);
      }
    }
    next();
  })
}