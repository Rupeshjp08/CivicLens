const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// Mock fallback users
const defaultCitizens = [
  { id: 'cit-1', name: 'John Citizen', email: 'john@example.com', role: 'CITIZEN' },
  { id: 'cit-2', name: 'Sarah Resident', email: 'sarah@example.com', role: 'CITIZEN' }
];

const defaultOfficers = [
  { id: 'off-1', name: 'Eng. Marcus Vance', email: 'officer@civiclens.gov', role: 'OFFICER', department: 'Roads & Infrastructure' },
  { id: 'off-2', name: 'Tech. Sarah Jenkins', email: 'jenkins@civiclens.gov', role: 'OFFICER', department: 'Water & Sewage' },
  { id: 'off-3', name: 'Elec. David Miller', email: 'miller@civiclens.gov', role: 'OFFICER', department: 'Electrical & Lighting' },
  { id: 'off-4', name: 'Insp. Alex Rivera', email: 'rivera@civiclens.gov', role: 'OFFICER', department: 'Sanitation & Waste' }
];

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const targetRole = (role || 'CITIZEN').toUpperCase();

    if (getIsConnected()) {
      const user = await User.findOne({ email: email?.toLowerCase() });
      if (user) {
        return res.status(200).json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
          }
        });
      }
    }

    if (targetRole === 'OFFICER') {
      const officer = defaultOfficers[0];
      return res.status(200).json({
        success: true,
        user: {
          id: officer.id,
          name: officer.name,
          email: email || officer.email,
          role: 'OFFICER',
          department: officer.department
        }
      });
    }

    const citizen = defaultCitizens[0];
    return res.status(200).json({
      success: true,
      user: {
        id: citizen.id,
        name: citizen.name,
        email: email || citizen.email,
        role: 'CITIZEN'
      }
    });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email' });
    }

    if (getIsConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const newUser = await User.create({
        name: name || 'New Citizen',
        email: email.toLowerCase(),
        password: password || 'password123',
        role: 'CITIZEN'
      });

      return res.status(201).json({
        success: true,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: 'CITIZEN'
        }
      });
    }

    return res.status(201).json({
      success: true,
      user: {
        id: `cit-${Date.now()}`,
        name: name || 'New Citizen',
        email,
        role: 'CITIZEN'
      }
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: {
      id: 'cit-1',
      name: 'John Citizen',
      email: 'john@example.com',
      role: 'CITIZEN'
    }
  });
};

module.exports = { login, register, getCurrentUser };
