const User = require('../model/User');

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    // Find user with the given refreshToken
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (foundUser) {
      // Clear the refreshToken for this user
      await foundUser.updateOne(
        { _id: foundUser._id },
        { $unset: { refreshToken: ''} }
      );
    }

    // Clear the cookie
    res.clearCookie('jwt', {
      httpOnly: true, // Secure should be set to true in production
      secure: false,
      sameSite: 'lax', // Adjust according to your needs
    });

    res.sendStatus(204); // No Content
  } catch (error) {
    console.error('Logout error:', error);
    res.sendStatus(500); // Internal Server Error
  }
};
module.exports = { handleLogout };
