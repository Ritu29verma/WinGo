let bets = [];
let gameResult = null;
let isGameActive = true;

export const placeBet = (req, res) => {
  const { userId, betType, betValue } = req.body;

  if (!isGameActive) {
    return res.status(400).json({ message: "Betting is closed" });
  }

  const validBetTypes = ["green", "red", "violet", "number", "big", "small"];
  if (!validBetTypes.includes(betType)) {
    return res.status(400).json({ message: "Invalid bet type" });
  }

  if (betType === "number" && (betValue < 0 || betValue > 9)) {
    return res.status(400).json({ message: "Invalid number selection. Choose between 0-9" });
  }

  bets.push({ userId, betType, betValue });
  res.json({ message: "Bet placed successfully" });
};

export const setGameResult = (req, res) => {
  const { result } = req.body;

  if (result < 0 || result > 9) {
    return res.status(400).json({ message: "Result must be a number between 0 and 9" });
  }

  gameResult = result;
  calculateWinnings();
  res.json({ message: "Game result set and winnings calculated" });
};

const calculateWinnings = () => {
  bets.forEach(({ userId, betType, betValue }) => {
    let payout = 0;

    switch (betType) {
      case "green":
        payout = [1, 3, 7, 9].includes(gameResult) ? 98 * 2 : gameResult === 5 ? 98 * 1.5 : 0;
        break;
      case "red":
        payout = [2, 4, 6, 8].includes(gameResult) ? 98 * 2 : gameResult === 0 ? 98 * 1.5 : 0;
        break;
      case "violet":
        payout = [0, 5].includes(gameResult) ? 98 * 2 : 0;
        break;
      case "number":
        payout = gameResult === betValue ? 98 * 9 : 0;
        break;
      case "big":
        payout = [5, 6, 7, 8, 9].includes(gameResult) ? 98 * 2 : 0;
        break;
      case "small":
        payout = [0, 1, 2, 3, 4].includes(gameResult) ? 98 * 2 : 0;
        break;
    }

    console.log(`User ${userId} - Bet Type: ${betType} - Winnings: ${payout}`);
  });

  bets = [];
};

setInterval(() => {
  isGameActive = !isGameActive;
}, 60000);
