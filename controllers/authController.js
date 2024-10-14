const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and Password are required.' });

  //Find Matching Username
  const foundUser = await User.findOne({ username: user }).exec();
  console.log('Found User:', foundUser); // Check if user is found
  if (!foundUser) return res.sendStatus(401);

  //Compare Password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (!match) return res.sendStatus(401);
  if (match) {
    const roles = Object.values(foundUser.roles);
    //Create JWT
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    // Save the refresh token with the current user
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    console.log('Access Token:', accessToken); // Log the access token
    console.log('Refresh Token:', refreshToken); // Log the refresh token

    // Send refresh token in HTTP-only cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false, // should be true in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send the access token to the frontend
    res.status(200).json({ user, accessToken });
  }
};

const getProfile = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

  if (!token) return res.status(401).json({ message: 'No access token found' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid' });
    res.json(user);
  });
};

module.exports = { handleLogin, getProfile };
