import  Agent  from '../models/Agent.js';

// Register an agent
export const registerAgent = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const count = await Agent.count();
    const username = `Agent ${count + 1}`;

    const agent = await Agent.create({ phoneNumber, username });
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all agents
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};
