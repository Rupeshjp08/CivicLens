const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');

const seedData = async () => {
  try {
    const count = await Complaint.countDocuments();
    if (count > 0) {
      console.log(`ℹ️ MongoDB already populated with ${count} complaints. Skipping seed.`);
      return;
    }

    console.log('🌱 Seeding initial CivicLens database records...');

    // Seed Departments
    await Department.deleteMany({});
    await Department.insertMany([
      { name: 'Roads & Infrastructure', code: 'ROAD', description: 'Potholes, asphalt paving, street markings', head: 'Eng. Marcus Vance', activeCount: 14 },
      { name: 'Electrical & Lighting', code: 'ELEC', description: 'Streetlights, traffic signals, power lines', head: 'Elec. David Miller', activeCount: 8 },
      { name: 'Sanitation & Waste', code: 'SANI', description: 'Garbage collection, public bins, street sweeping', head: 'Insp. Alex Rivera', activeCount: 19 },
      { name: 'Water & Sewage', code: 'WATR', description: 'Main leaks, drainage blockage, water supply', head: 'Tech. Sarah Jenkins', activeCount: 11 }
    ]);

    // Seed Users
    await User.deleteMany({});
    await User.insertMany([
      { name: 'John Citizen', email: 'john@example.com', password: 'password123', role: 'CITIZEN' },
      { name: 'Sarah Resident', email: 'sarah@example.com', password: 'password123', role: 'CITIZEN' },
      { name: 'Eng. Marcus Vance', email: 'officer@civiclens.gov', password: 'officerpassword', role: 'OFFICER', department: 'Roads & Infrastructure' },
      { name: 'Tech. Sarah Jenkins', email: 'jenkins@civiclens.gov', password: 'officerpassword', role: 'OFFICER', department: 'Water & Sewage' },
      { name: 'Insp. Alex Rivera', email: 'rivera@civiclens.gov', password: 'officerpassword', role: 'OFFICER', department: 'Sanitation & Waste' },
      { name: 'Elec. David Miller', email: 'miller@civiclens.gov', password: 'officerpassword', role: 'OFFICER', department: 'Electrical & Lighting' }
    ]);

    // Seed Complaints
    await Complaint.deleteMany({});
    await Complaint.insertMany([
      {
        complaintId: 'CIV-3913',
        title: 'Major pothole on Main Road',
        description: 'Deep hazardous crater in left lane causing heavy traffic backup and tire damage.',
        category: 'Pothole',
        location: 'Oak Avenue & 5th Street, Sector 4',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        status: 'Pending',
        priority: 'Critical',
        supportCount: 28,
        assignedOfficerId: 'off-1',
        assignedOfficerName: 'Eng. Marcus Vance',
        mapX: 62,
        mapY: 58,
        fieldNotes: [
          { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), author: 'CivicLens intake', note: 'Complaint logged into municipal queue and assigned to engineering triage.' }
        ]
      },
      {
        complaintId: 'CIV-1001',
        title: 'Severe Pothole on Oak Avenue',
        description: 'Deep pothole causing vehicle damage near the central intersection.',
        category: 'Pothole',
        location: 'Oak Avenue & 5th Street, Sector 4',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        status: 'In Progress',
        priority: 'High',
        supportCount: 14,
        assignedOfficerId: 'off-1',
        assignedOfficerName: 'Eng. Marcus Vance',
        mapX: 64,
        mapY: 55,
        fieldNotes: [
          { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), author: 'Roads desk', note: 'Assigned to field crew. Temporary cones requested.' }
        ]
      },
      {
        complaintId: 'CIV-1002',
        title: 'Broken Streetlight outside Public Library',
        description: 'Streetlight has been flickering and completely off for the last 3 days.',
        category: 'Broken Streetlight',
        location: 'Central Library Road, Block B',
        image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
        status: 'Pending',
        priority: 'Medium',
        supportCount: 8,
        mapX: 38,
        mapY: 32,
        fieldNotes: []
      },
      {
        complaintId: 'CIV-1003',
        title: 'Garbage Overflow near Metro Station',
        description: 'Uncollected municipal garbage bin overflowing on sidewalk.',
        category: 'Garbage Accumulation',
        location: 'City Metro Station Gate 2',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        status: 'In Review',
        priority: 'High',
        supportCount: 22,
        assignedOfficerId: 'off-4',
        assignedOfficerName: 'Insp. Alex Rivera',
        mapX: 48,
        mapY: 40,
        fieldNotes: [
          { timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), author: 'Sanitation desk', note: 'Pickup scheduled for next collection shift.' }
        ]
      },
      {
        complaintId: 'CIV-1004',
        title: 'Major Water Pipeline Leakage',
        description: 'Fresh water leaking continuously onto main road for 12 hours.',
        category: 'Water Leakage',
        location: 'Green Park Housing Complex Gate 1',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
        status: 'In Progress',
        priority: 'Critical',
        supportCount: 35,
        assignedOfficerId: 'off-2',
        assignedOfficerName: 'Tech. Sarah Jenkins',
        mapX: 78,
        mapY: 28,
        fieldNotes: [
          { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), author: 'Water operations', note: 'Valve isolation crew dispatched.' }
        ]
      },
      {
        complaintId: 'CIV-1006',
        title: 'Streetlight blackout on pedestrian walkway',
        description: 'Two consecutive lights out along the evening walkway.',
        category: 'Broken Streetlight',
        location: 'Commercial Hub Walkway, Sector 2',
        image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
        status: 'Resolved',
        priority: 'Medium',
        supportCount: 11,
        assignedOfficerId: 'off-3',
        assignedOfficerName: 'Elec. David Miller',
        mapX: 30,
        mapY: 70,
        fieldNotes: [
          { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), author: 'Electrical services', note: 'Fixture replaced and verified after dark.' }
        ]
      }
    ]);

    // Seed Audit Logs
    await AuditLog.deleteMany({});
    await AuditLog.insertMany([
      { actor: 'Eng. Marcus Vance', role: 'OFFICER', action: 'STATUS_UPDATE', target: '#CIV-3913', details: 'Updated status to Pending Triage' },
      { actor: 'System Auto-Engine', role: 'SYSTEM', action: 'PRIORITY_CALCULATED', target: '#CIV-1004', details: 'Assigned Critical Priority (Score 92)' },
      { actor: 'John Citizen', role: 'CITIZEN', action: 'REPORT_CREATED', target: '#CIV-3913', details: 'Submitted pothole ticket with photo proof' }
    ]);

    console.log('✅ Database seed completed successfully.');
  } catch (err) {
    console.warn('⚠️ Seeding error:', err.message);
  }
};

module.exports = seedData;
