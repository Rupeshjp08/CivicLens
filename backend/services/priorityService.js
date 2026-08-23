/**
 * Smart Priority Engine
 *
 * Factors:
 * - Issue category severity
 * - Citizen support (related/affected reports)
 * - Time pending
 * - Location sensitivity (schools, hospitals, transit, junctions)
 * - Related reports in the same area and category
 */

const CATEGORY_WEIGHTS = {
  'Water Leakage': 3,
  'Pothole': 3,
  'Damaged Road': 2,
  'Garbage Accumulation': 2,
  'Broken Streetlight': 1,
  'Other': 1
};

const SENSITIVE_LOCATION_TERMS = [
  'school',
  'hospital',
  'metro',
  'library',
  'intersection',
  'junction',
  'park',
  'terminal',
  'housing',
  'walkway'
];

const extractArea = (location = '') => {
  const sector = String(location).match(/sector\s*\d/i);
  if (sector) return sector[0].toLowerCase();
  return String(location).split(',')[0].trim().toLowerCase();
};

const isSensitiveLocation = (location = '') => {
  const text = String(location).toLowerCase();
  return SENSITIVE_LOCATION_TERMS.some((term) => text.includes(term));
};

const relatedCount = (complaint, allComplaints = []) => {
  const area = extractArea(complaint.location);
  return allComplaints.filter((other) => {
    if (!other || other.complaintId === complaint.complaintId) return false;
    if (other.category !== complaint.category) return false;
    return extractArea(other.location) === area;
  }).length;
};

const hoursPending = (createdAt) => {
  const created = createdAt ? new Date(createdAt) : new Date();
  return Math.max(0, (Date.now() - created.getTime()) / (1000 * 60 * 60));
};

/**
 * Numeric 0–100 score plus factor breakdown.
 */
const analyzePriority = (complaint, allComplaints = []) => {
  const categoryWeight = CATEGORY_WEIGHTS[complaint.category] || 1;
  const categoryScore = Math.min(categoryWeight * 15, 45);
  const supportScore = Math.min((complaint.supportCount || 0) * 0.6, 20);
  const timeScore = Math.min(hoursPending(complaint.createdAt) * 0.3, 20);
  const locationScore = isSensitiveLocation(complaint.location) ? 8 : 2;
  const related = relatedCount(complaint, allComplaints);
  const duplicateScore = Math.min(related * 4, 12);

  const total = Math.round(
    Math.min(categoryScore + supportScore + timeScore + locationScore + duplicateScore, 100)
  );

  let engineLevel = 'Low';
  if (total >= 80) engineLevel = 'Critical';
  else if (total >= 60) engineLevel = 'High';
  else if (total >= 35) engineLevel = 'Medium';

  const explanations = [];
  if (categoryWeight >= 3) explanations.push('High-severity category');
  if ((complaint.supportCount || 0) >= 10) explanations.push('Multiple citizens have supported this report');
  if (isSensitiveLocation(complaint.location)) explanations.push('Near a sensitive or high-traffic location');
  if (hoursPending(complaint.createdAt) >= 48) explanations.push('Pending for several days');
  if (related > 0) explanations.push(`${related} related report${related === 1 ? '' : 's'} in the same area`);

  return {
    score: total,
    engineLevel,
    relatedReports: related,
    factors: [
      { key: 'category', label: 'Category', value: Math.round(categoryScore), max: 45 },
      { key: 'support', label: 'Affected citizens', value: Math.round(supportScore), max: 20 },
      { key: 'location', label: 'Location sensitivity', value: locationScore, max: 8 },
      { key: 'time', label: 'Time pending', value: Math.round(timeScore), max: 20 },
      { key: 'related', label: 'Related reports', value: duplicateScore, max: 12 }
    ],
    explanations
  };
};

/**
 * Legacy string level used when a complaint is first created.
 */
const calculatePriority = (complaint, allComplaints = []) => {
  return analyzePriority(complaint, allComplaints).engineLevel;
};

const attachPriorityAnalysis = (complaint, allComplaints = []) => {
  const analysis = analyzePriority(complaint, allComplaints);
  return {
    ...complaint,
    priorityScore: analysis.score,
    priorityEngineLevel: analysis.engineLevel,
    priorityFactors: analysis.factors,
    priorityExplanations: analysis.explanations,
    relatedReportCount: analysis.relatedReports
  };
};

module.exports = {
  calculatePriority,
  analyzePriority,
  attachPriorityAnalysis,
  CATEGORY_WEIGHTS,
  extractArea
};
