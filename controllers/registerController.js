const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, roles, pwd } = req.body;
  if (!user || !roles || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and Role and Password are required.' });

  //Check for duplicate usernames
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate)
    return res.status(409).json({ message: 'Username already used' });
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user
    const newUser = await User.create({
      username: user,
      password: hashedPwd,
      roles: roles.reduce((acc, role) => {
        acc[role] =
          role === 'User'
            ? 2001
            : role === 'Editor'
            ? 1984
            : role === 'Admin'
            ? 5150
            : 2001;
        return acc;
      }, {}),
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
