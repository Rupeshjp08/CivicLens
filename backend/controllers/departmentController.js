const Department = require('../models/Department');
const { getIsConnected } = require('../config/db');

const mockDepartments = [
  { id: 'dept-1', name: 'Roads & Infrastructure', code: 'ROAD', activeCount: 14, head: 'Eng. Marcus Vance', description: 'Potholes, asphalt paving, street markings' },
  { id: 'dept-2', name: 'Electrical & Lighting', code: 'ELEC', activeCount: 8, head: 'Elec. David Miller', description: 'Streetlights, traffic signals, power lines' },
  { id: 'dept-3', name: 'Sanitation & Waste', code: 'SANI', activeCount: 19, head: 'Insp. Alex Rivera', description: 'Garbage collection, public bins, street sweeping' },
  { id: 'dept-4', name: 'Water & Sewage', code: 'WATR', activeCount: 11, head: 'Tech. Sarah Jenkins', description: 'Main leaks, drainage blockage, water supply' }
];

const getDepartments = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const depts = await Department.find({}).lean();
      if (depts.length > 0) {
        return res.status(200).json({ success: true, data: depts });
      }
    }
    res.status(200).json({ success: true, data: mockDepartments });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDepartments };
