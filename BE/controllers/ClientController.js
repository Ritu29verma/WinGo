import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import MinAmount from '../models/MinAmount.js';

export const checkClient = async (req, res) => {
    const { code, password } = req.query;
  
    if (!code || !password) {
      return res.status(400).json({ error: 'Code and password are required' });
    }
  
    if (!req.mysqlPool) {
      return res.status(500).json({ error: 'MySQL connection pool not initialized' });
    }
    try {
      const [results] = await req.mysqlPool.query(
        'SELECT * FROM client WHERE code = ? AND password = ?',
        [code, password]
      );
      if (results.length === 0) {
        return res.status(404).json({ error: 'Client not found in MySQL' });
      }
      const client = results[0];
  
      // Check if the user exists in MongoDB
      let user = await User.findOne({ code, password });
  
      if (user) {
        // Generate JWT token for existing user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({
          message: 'User already exists in MongoDB',
          token,
          user: { id: user._id, phoneNo: user.phoneNo },
        });
      }
  
      // Create a new user in MongoDB
      user = new User({
        name: client.name,
        code: client.code,
        phoneNo: client.contactNumber,
        password: client.password,
      });
  
      await user.save();
  
      // Generate wallet number
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const seconds = Math.floor(now.getTime() / 1000).toString().slice(-4);
      const walletNo = `${year}${month}${day}${seconds}`;
  
      // Fetch minimum amount
      const minAmountDoc = await MinAmount.findOne();
      const minAmount = minAmountDoc ? minAmountDoc.value : 100;
  
      // Create a wallet for the user
      const walletTotalAmount = client.matkaLimit === '0' || !client.matkaLimit 
        ? minAmount 
        : parseFloat(client.matkaLimit); // Ensure matkaLimit is treated as a number

        // Create a wallet for the user
        const wallet = new Wallet({
        walletNo,
        userId: user._id,
        totalAmount: walletTotalAmount,
        });

        await wallet.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  
      res.status(201).json({
        message: 'User and wallet created successfully',
        token,
        user: { id: user._id, phoneNo: user.phoneNo },
      });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  export const syncWallet = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
  
    if (!req.mysqlPool) {
      return res.status(500).json({ error: 'MySQL connection pool not initialized' });
    }
  
    try {
      // Decode the token to get userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
      // Find the user in MongoDB
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found in MongoDB' });
      }
  
      // Find the wallet in MongoDB
      const wallet = await Wallet.findOne({ userId: user._id });
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found for the user' });
      }
  
      // Query the client table in MySQL
      const [clientResults] = await req.mysqlPool.query(
        'SELECT * FROM client WHERE code = ? AND password = ?',
        [user.code, user.password]
      );
  
      if (clientResults.length === 0) {
        return res.status(404).json({ error: 'Client not found in MySQL' });
      }
  
      const client = clientResults[0];
  
      // Compare updatedAt fields
      const walletUpdatedAt = new Date(wallet.updatedAt);
      const clientUpdatedAt = new Date(client.updated_at);
  
      if (clientUpdatedAt > walletUpdatedAt) {
        // Update MongoDB wallet totalAmount
        wallet.totalAmount = parseFloat(client.matkaLimit || 0);
        wallet.updatedAt = clientUpdatedAt;
        await wallet.save();
  
        return res.status(200).json({
          message: 'MongoDB wallet updated successfully',
          wallet,
        });
      } else if (walletUpdatedAt > clientUpdatedAt) {
        // Update MySQL client matkaLimit and updated_at
        await req.mysqlPool.query(
          'UPDATE client SET matkaLimit = ?, updated_at = ? WHERE id = ?',
          [wallet.totalAmount.toString(), walletUpdatedAt, client.Id]
        );
  
        return res.status(200).json({
          message: 'MySQL client updated successfully',
          updatedClient: {
            matkaLimit: wallet.totalAmount,
            updatedAt: walletUpdatedAt,
          },
        });
      } else {
        return res.status(200).json({
          message: 'No updates required. Both systems are synchronized.',
        });
      }
    } catch (error) {
      console.error('Error processing wallet synchronization:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



export const syncWalletByCode = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  if (!req.mysqlPool) {
    return res.status(500).json({ error: "MySQL connection pool not initialized" });
  }

  try {
    // Find the user in MongoDB by code
    const user = await User.findOne({ code });
    if (!user) {
      return res.status(404).json({ error: "User not found in MongoDB" });
    }

    // Find the wallet in MongoDB
    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found for the user" });
    }

    // Query the client table in MySQL
    const [clientResults] = await req.mysqlPool.query(
      "SELECT * FROM client WHERE code = ? AND password = ?",
      [user.code, user.password]
    );

    if (clientResults.length === 0) {
      return res.status(404).json({ error: "Client not found in MySQL" });
    }

    const client = clientResults[0];

    // Compare updatedAt fields
    const walletUpdatedAt = new Date(wallet.updatedAt);
    const clientUpdatedAt = new Date(client.updated_at);

    if (clientUpdatedAt > walletUpdatedAt) {
      // Update MongoDB wallet totalAmount
      wallet.totalAmount = parseFloat(client.matkaLimit || 0);
      wallet.updatedAt = clientUpdatedAt;
      await wallet.save();

      return res.status(200).json({
        message: "MongoDB wallet updated successfully",
        wallet,
      });
    } else if (walletUpdatedAt > clientUpdatedAt) {
      // Update MySQL client matkaLimit and updated_at
      await req.mysqlPool.query(
        "UPDATE client SET matkaLimit = ?, updated_at = ? WHERE id = ?",
        [wallet.totalAmount.toString(), walletUpdatedAt, client.Id]
      );

      return res.status(200).json({
        message: "MySQL client updated successfully",
        updatedClient: {
          matkaLimit: wallet.totalAmount,
          updatedAt: walletUpdatedAt,
        },
      });
    } else {
      return res.status(200).json({
        message: "No updates required. Both systems are synchronized.",
      });
    }
  } catch (error) {
    console.error("Error processing wallet synchronization by code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
