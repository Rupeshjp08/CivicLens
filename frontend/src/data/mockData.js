export const mockComplaints = [
  {
    _id: 'c101',
    complaintId: 'CL-2026-00101',
    title: 'Deep Hazardous Pothole near Sector 4 Intersection',
    category: 'Pothole',
    location: 'Sector 4, Main Rd Junction (37.7749° N, 122.4194° W)',
    description: 'Crater dimensions approx 3ft wide and 6in deep creating severe wheel damage and night hazard for two-wheelers.',
    priority: 'High',
    status: 'In Progress',
    supportCount: 42,
    createdAt: '2026-08-20T08:30:00.000Z',
    updatedAt: '2026-08-22T10:15:00.000Z',
    department: 'Roads & Infrastructure',
    assignedOfficerId: 'off-1',
    assignedOfficerName: 'Eng. Marcus Vance',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
    resolutionImage: null,
    fieldNotes: [
      { timestamp: '2026-08-20 08:35 AM', author: 'AI System', note: 'Auto-triaged as HIGH priority due to high traffic volume.' },
      { timestamp: '2026-08-21 09:00 AM', author: 'Roads Dept Dispatch', note: 'Assigned to Officer Marcus Vance. Work Order #WO-402 generated.' },
      { timestamp: '2026-08-22 10:15 AM', author: 'Eng. Marcus Vance', note: 'Site inspected. Asphalt patching crew en route with heavy roller.' }
    ]
  },
  {
    _id: 'c102',
    complaintId: 'CL-2026-00102',
    title: 'Main Water Line Burst Overflowing onto Street',
    category: 'Water Leakage',
    location: 'Sector 5, Utility Belt near Bank (37.7812° N, 122.4089° W)',
    description: 'High-pressure clean water main burst flooding lower sidewalk and threatening electrical junction box.',
    priority: 'Critical',
    status: 'In Review',
    supportCount: 88,
    createdAt: '2026-08-21T14:20:00.000Z',
    updatedAt: '2026-08-21T14:45:00.000Z',
    department: 'Water & Utilities',
    assignedOfficerId: 'off-2',
    assignedOfficerName: 'Tech. Sarah Jenkins',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=60',
    resolutionImage: null,
    fieldNotes: [
      { timestamp: '2026-08-21 02:22 PM', author: 'AI Emergency Triage', note: 'CRITICAL Emergency Triggered: Clean water burst near power lines.' },
      { timestamp: '2026-08-21 02:45 PM', author: 'Water Operations', note: 'Valve isolation team dispatched. Priority 1 escalation.' }
    ]
  },
  {
    _id: 'c103',
    complaintId: 'CL-2026-00103',
    title: 'Uncollected Sanitation Overflow behind Central Market',
    category: 'Garbage Accumulation',
    location: 'Sector 3, Downtown Market Square',
    description: 'Dumpster overflow spanning 20 feet creating public odor and pest hazard near food vendors.',
    priority: 'Medium',
    status: 'Pending',
    supportCount: 19,
    createdAt: '2026-08-22T06:10:00.000Z',
    updatedAt: '2026-08-22T06:10:00.000Z',
    department: 'Sanitation & Waste Management',
    assignedOfficerId: null,
    assignedOfficerName: 'Unassigned',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=60',
    resolutionImage: null,
    fieldNotes: [
      { timestamp: '2026-08-22 06:10 AM', author: 'Citizen Reporter', note: 'Complaint logged into municipal queue.' }
    ]
  },
  {
    _id: 'c104',
    complaintId: 'CL-2026-00104',
    title: 'Streetlight Blackout across Sector 2 Pedestrian Walkway',
    category: 'Broken Streetlight',
    location: 'Sector 2, Commercial Hub Walkway',
    description: 'Four consecutive LED streetlights out, rendering 200m stretch dark during evening transit hours.',
    priority: 'Medium',
    status: 'Resolved',
    supportCount: 31,
    createdAt: '2026-08-18T19:00:00.000Z',
    updatedAt: '2026-08-20T16:30:00.000Z',
    department: 'Electrical Services',
    assignedOfficerId: 'off-3',
    assignedOfficerName: 'Elec. David Miller',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=60',
    resolutionImage: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&auto=format&fit=crop&q=60',
    fieldNotes: [
      { timestamp: '2026-08-18 07:05 PM', author: 'AI System', note: 'Triaged to Electrical Services.' },
      { timestamp: '2026-08-19 11:00 AM', author: 'Elec. David Miller', note: 'Replaced failed circuit breaker and LED driver. Testing complete.' },
      { timestamp: '2026-08-20 04:30 PM', author: 'Admin Dispatch', note: 'Verified operational. Marked RESOLVED.' }
    ]
  },
  {
    _id: 'c105',
    complaintId: 'CL-2026-00105',
    title: 'Live Transformer Wire Hazard near Bus Terminal',
    category: 'Damaged Road',
    location: 'Sector 1, Bus Terminal Gate 3',
    description: 'Exposed wiring hanging low following storm damage. Requires immediate electrical isolation.',
    priority: 'Critical',
    status: 'In Progress',
    supportCount: 64,
    createdAt: '2026-08-22T09:00:00.000Z',
    updatedAt: '2026-08-22T09:30:00.000Z',
    department: 'Electrical Services',
    assignedOfficerId: 'off-3',
    assignedOfficerName: 'Elec. David Miller',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=60',
    resolutionImage: null,
    fieldNotes: [
      { timestamp: '2026-08-22 09:02 AM', author: 'AI Emergency Triage', note: 'CRITICAL Electrical Hazard Auto-Escalated.' },
      { timestamp: '2026-08-22 09:30 AM', author: 'Elec. David Miller', note: 'Perimeter cordoned off. Power cut initiated for Safety Zone A.' }
    ]
  }
];

export const mockDepartments = [
  { id: 'dept-1', name: 'Roads & Infrastructure', head: 'Director Robert Chen', activeComplaints: 24, resolvedComplaints: 310, slaPerformance: '94%', officersCount: 12 },
  { id: 'dept-2', name: 'Water & Utilities', head: 'Director Elena Rostova', activeComplaints: 18, resolvedComplaints: 245, slaPerformance: '88%', officersCount: 9 },
  { id: 'dept-3', name: 'Sanitation & Waste Management', head: 'Director James Hayes', activeComplaints: 12, resolvedComplaints: 412, slaPerformance: '91%', officersCount: 15 },
  { id: 'dept-4', name: 'Electrical Services', head: 'Director Priya Patel', activeComplaints: 8, resolvedComplaints: 198, slaPerformance: '96%', officersCount: 8 },
  { id: 'dept-5', name: 'Public Safety & Hazards', head: 'Chief Arthur Morgan', activeComplaints: 6, resolvedComplaints: 156, slaPerformance: '97%', officersCount: 10 }
];

export const mockOfficers = [
  { id: 'off-1', name: 'Eng. Marcus Vance', department: 'Roads & Infrastructure', activeTasks: 3, completedTasks: 84, slaRate: '96%', status: 'On Field', phone: '+1 (555) 019-2831', email: 'marcus.vance@govtech.city' },
  { id: 'off-2', name: 'Tech. Sarah Jenkins', department: 'Water & Utilities', activeTasks: 2, completedTasks: 62, slaRate: '91%', status: 'Busy', phone: '+1 (555) 019-4820', email: 'sarah.jenkins@govtech.city' },
  { id: 'off-3', name: 'Elec. David Miller', department: 'Electrical Services', activeTasks: 4, completedTasks: 110, slaRate: '98%', status: 'On Field', phone: '+1 (555) 019-9182', email: 'david.miller@govtech.city' },
  { id: 'off-4', name: 'Insp. Alex Rivera', department: 'Sanitation & Waste Management', activeTasks: 1, completedTasks: 75, slaRate: '94%', status: 'Available', phone: '+1 (555) 019-3829', email: 'alex.rivera@govtech.city' }
];

export const mockCitizens = [
  { id: 'cit-1', name: 'John Citizen', email: 'john.citizen@example.com', complaintsCount: 3, resolvedCount: 2, status: 'Active', joinedDate: '2025-11-10' },
  { id: 'cit-2', name: 'Maria Santos', email: 'maria.santos@example.com', complaintsCount: 5, resolvedCount: 4, status: 'Active', joinedDate: '2026-01-15' },
  { id: 'cit-3', name: 'Liam Chen', email: 'liam.chen@example.com', complaintsCount: 2, resolvedCount: 1, status: 'Active', joinedDate: '2026-03-04' }
];

export const mockAnalytics = {
  totalComplaints: 1420,
  resolutionRate: '88.4%',
  avgResponseVelocityHours: 36,
  slaBreaches: 4,
  communityUpvotes: 840,
  categoryBreakdown: [
    { category: 'Potholes & Hazards', count: 480, percentage: 34 },
    { category: 'Sanitation Overflow', count: 350, percentage: 25 },
    { category: 'Water Main Bursts', count: 240, percentage: 17 },
    { category: 'Lighting & Power', count: 210, percentage: 15 },
    { category: 'Other Utilities', count: 140, percentage: 9 }
  ],
  sectorWorkload: [
    { sector: 'Sector 1 (North District)', count: 24, percent: 80 },
    { sector: 'Sector 2 (Commercial Hub)', count: 18, percent: 60 },
    { sector: 'Sector 3 (Downtown Metro)', count: 28, percent: 92 },
    { sector: 'Sector 4 (Civic South)', count: 12, percent: 40 },
    { sector: 'Sector 5 (East Utility Belt)', count: 32, percent: 98 }
  ]
};

export const mockAuditLogs = [
  { id: 'log-1', timestamp: '2026-08-22 10:15:00', actor: 'Eng. Marcus Vance', action: 'Field status updated to IN_PROGRESS for complaint #CL-2026-00101', role: 'OFFICER' },
  { id: 'log-2', timestamp: '2026-08-22 09:30:00', actor: 'Admin Operations', action: 'Assigned complaint #CL-2026-00105 to Officer David Miller', role: 'ADMIN' },
  { id: 'log-3', timestamp: '2026-08-22 09:02:00', actor: 'AI Emergency System', action: 'CRITICAL Emergency Escalation triggered for #CL-2026-00105', role: 'SYSTEM' },
  { id: 'log-4', timestamp: '2026-08-22 06:10:00', actor: 'John Citizen', action: 'Logged new complaint ticket #CL-2026-00103', role: 'CITIZEN' },
  { id: 'log-5', timestamp: '2026-08-20 16:30:00', actor: 'Director Priya Patel', action: 'Marked complaint #CL-2026-00104 as VERIFIED RESOLVED', role: 'ADMIN' }
];
