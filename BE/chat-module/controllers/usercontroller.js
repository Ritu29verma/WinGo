import User from '../models/User.js';

// Register a user
export const registerUser = async (req, res) => {
  try {
    const { phoneNumber, isGuest } = req.body;
    const count = await User.count();
    const username = isGuest ? `Guest ${count + 1}` : `User ${count + 1}`;

    const user = await User.create({ phoneNumber, username, isGuest });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
