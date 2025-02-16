import  Agent  from '../models/Agent.js';

// Register an agent
export const checkOrRegisterAgent = async (req, res) => {
  try {
    const { phoneNumber, isGuest } = req.body;

    let agent = await Agent.findOne({ where: { phoneNumber } });

    if (!agent) {
      const count = await Agent.count();
      const username = isGuest ? `GuestAgent ${count + 1}` : `Agent ${count+1}`;
      agent = await Agent.create({ phoneNumber, username, isGuest });
    }
    res.status(200).json(agent);
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
