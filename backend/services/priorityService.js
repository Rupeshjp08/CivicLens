/**
 * Priority Calculation Service
 * 
 * Developer 2 Scope: Smart priority logic calculation based on:
 * - Issue category severity
 * - Citizen support count (upvotes)
 * - Time elapsed since creation
 */

const CATEGORY_WEIGHTS = {
  'Water Leakage': 3,
  'Pothole': 3,
  'Damaged Road': 2,
  'Garbage Accumulation': 2,
  'Broken Streetlight': 1,
  'Other': 1
};

/**
 * Calculates priority string level ('Low', 'Medium', 'High', 'Critical')
 * @param {Object} complaint 
 * @returns {String} priority level
 */
const calculatePriority = (complaint) => {
  const categoryWeight = CATEGORY_WEIGHTS[complaint.category] || 1;
  const supportScore = Math.min((complaint.supportCount || 0) * 0.5, 5); // Max 5 bonus points from upvotes
  
  const totalScore = categoryWeight * 2 + supportScore;

  if (totalScore >= 9) return 'Critical';
  if (totalScore >= 7) return 'High';
  if (totalScore >= 4) return 'Medium';
  return 'Low';
};

module.exports = {
  calculatePriority,
  CATEGORY_WEIGHTS
};
