import User from '../models/User.js';

// Check if user exists, create if not, then return user
export const checkOrRegisterUser = async (req, res) => {
  try {
    const { phoneNumber, username, isGuest } = req.body;

    let user = await User.findOne({ where: { phoneNumber } });

    if (!user) {
      const count = await User.count();
      const finalUsername = isGuest ? `GuestUser ${count + 1}` : username; // Fixed

      user = await User.create({ phoneNumber, username: finalUsername, isGuest });
    }
    
    res.status(200).json(user);
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
