const express = require('express');
const app = express();
app.use(express.json());

let bets = []; // Store each user's bet
let gameResult = null; // This will be set by the admin

// 1. Place Bet API
app.post('/user/placeBet', (req, res) => {
  const { userId, betType, betValue } = req.body;

  // Check if game is active and accepting bets
  if (!isGameActive) {
    return res.status(400).json({ message: 'Betting is closed' });
  }

  // Validate bet type
  const validBetTypes = ['green', 'red', 'violet', 'number', 'big', 'small'];
  if (!validBetTypes.includes(betType)) {
    return res.status(400).json({ message: 'Invalid bet type' });
  }

  // Validate bet value (required only for 'number' bet type)
  if (betType === 'number' && (betValue < 0 || betValue > 9)) {
    return res.status(400).json({ message: 'Invalid number selection. Choose between 0-9' });
  }

  // Store the bet
  bets.push({ userId, betType, betValue });
  res.json({ message: 'Bet placed successfully' });
});

// 2. Set Game Result (Admin Only)
// This API is used by the admin to set the final game result
app.post('/admin/setResult', (req, res) => {
  const { result } = req.body;

  if (result < 0 || result > 9) {
    return res.status(400).json({ message: 'Result must be a number between 0 and 9' });
  }

  gameResult = result;
  calculateWinnings();
  res.json({ message: 'Game result set and winnings calculated' });
});

// 3. Calculate Winnings
const calculateWinnings = () => {
  bets.forEach(bet => {
    const { userId, betType, betValue } = bet;
    let payout = 0;

    switch (betType) {
      case 'green':
        payout = [1, 3, 7, 9].includes(gameResult) ? 98 * 2 : (gameResult === 5 ? 98 * 1.5 : 0);
        break;
      case 'red':
        payout = [2, 4, 6, 8].includes(gameResult) ? 98 * 2 : (gameResult === 0 ? 98 * 1.5 : 0);
        break;
      case 'violet':
        payout = [0, 5].includes(gameResult) ? 98 * 2 : 0;
        break;
      case 'number':
        payout = (gameResult === betValue) ? 98 * 9 : 0;
        break;
      case 'big':
        payout = [5, 6, 7, 8, 9].includes(gameResult) ? 98 * 2 : 0;
        break;
      case 'small':
        payout = [0, 1, 2, 3, 4].includes(gameResult) ? 98 * 2 : 0;
        break;
      default:
        payout = 0;
    }

    // Log payout or save to database
    console.log(`User ${userId} - Bet Type: ${betType} - Winnings: ${payout}`);
  });

  // Clear bets after calculation (reset for next game round)
  bets = [];
};

// Dummy game control variable for checking game status
let isGameActive = true;

// Middleware to simulate game timer and toggle game status
setInterval(() => {
  isGameActive = !isGameActive; // Toggle game status every interval (e.g., simulate game rounds)
}, 60000); // For example, every minute

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
