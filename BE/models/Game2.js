import mongoose from 'mongoose';


const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true },
  color: { type: [String], required: true }, 
  number: { type: Number, required: true },
  bigOrSmall: { type: String, required: true },
  duration: { type: String, required: true }, 
  timestamp: { type: Date, default: Date.now },
});

const Game2 = mongoose.model('Game2', gameSchema);
export default Game2;