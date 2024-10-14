const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.header.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('No authorization header found or incorrect format');
    console.log('Authorization Header:', authHeader);
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed', err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};
module.exports = verifyJWT;
