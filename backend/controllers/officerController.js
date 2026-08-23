const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const mockOfficers = [
  { id: 'off-1', name: 'Eng. Marcus Vance', email: 'officer@civiclens.gov', department: 'Roads & Infrastructure', designation: 'Senior Civil Engineer', status: 'Active', activeTickets: 4 },
  { id: 'off-2', name: 'Tech. Sarah Jenkins', email: 'jenkins@civiclens.gov', department: 'Water & Sewage', designation: 'Water Network Specialist', status: 'Active', activeTickets: 3 },
  { id: 'off-3', name: 'Elec. David Miller', email: 'miller@civiclens.gov', department: 'Electrical & Lighting', designation: 'Grid Maintenance Lead', status: 'Active', activeTickets: 2 },
  { id: 'off-4', name: 'Insp. Alex Rivera', email: 'rivera@civiclens.gov', department: 'Sanitation & Waste', designation: 'Sanitation Inspector', status: 'Active', activeTickets: 5 }
];

const getOfficers = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const users = await User.find({ role: 'OFFICER' }).lean();
      if (users.length > 0) {
        return res.status(200).json({ success: true, data: users });
      }
    }
    res.status(200).json({ success: true, data: mockOfficers });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOfficers };
