const CATEGORY_WEIGHTS = {
  'Water Leakage': 3,
  Pothole: 3,
  'Damaged Road': 2,
  'Garbage Accumulation': 2,
  'Broken Streetlight': 1,
  Other: 1
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

export function extractArea(location = '') {
  const sector = String(location).match(/sector\s*\d/i);
  if (sector) return sector[0];
  return String(location).split(',')[0].trim() || 'Unspecified area';
}

export function relatedComplaints(complaint, allComplaints = []) {
  if (!complaint) return [];
  const area = extractArea(complaint.location).toLowerCase();
  return allComplaints.filter((other) => {
    if (!other || other.complaintId === complaint.complaintId) return false;
    if (other.category !== complaint.category) return false;
    return extractArea(other.location).toLowerCase() === area;
  });
}

export function calculatePriorityScore(complaint, allComplaints = []) {
  if (!complaint) {
    return { total: 0, factors: [], level: 'Low', explanations: [] };
  }

  if (typeof complaint.priorityScore === 'number' && Array.isArray(complaint.priorityFactors)) {
    return {
      total: complaint.priorityScore,
      factors: complaint.priorityFactors,
      level: complaint.priorityEngineLevel || levelFromScore(complaint.priorityScore),
      explanations: complaint.priorityExplanations || []
    };
  }

  const categoryWeight = CATEGORY_WEIGHTS[complaint.category] || 1;
  const categoryScore = Math.min(categoryWeight * 15, 45);
  const supportScore = Math.min((complaint.supportCount || 0) * 0.6, 20);
  const createdAt = complaint.createdAt ? new Date(complaint.createdAt) : new Date();
  const hoursPending = Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
  const timeScore = Math.min(hoursPending * 0.3, 20);
  const locationText = String(complaint.location || '').toLowerCase();
  const sensitive = SENSITIVE_LOCATION_TERMS.some((term) => locationText.includes(term));
  const locationScore = sensitive ? 8 : 2;
  const related = relatedComplaints(complaint, allComplaints);
  const duplicateScore = Math.min(related.length * 4, 12);
  const total = Math.round(
    Math.min(categoryScore + supportScore + timeScore + locationScore + duplicateScore, 100)
  );

  const explanations = [];
  if (categoryWeight >= 3) explanations.push('High-severity category');
  if ((complaint.supportCount || 0) >= 10) explanations.push('Multiple citizens have supported this report');
  if (sensitive) explanations.push('Near a sensitive or high-traffic location');
  if (hoursPending >= 48) explanations.push('Pending for several days');
  if (related.length > 0) {
    explanations.push(
      `${related.length} related report${related.length === 1 ? '' : 's'} in the same area`
    );
  }

  return {
    total,
    level: levelFromScore(total),
    explanations,
    related,
    factors: [
      { key: 'category', label: 'Category', value: Math.round(categoryScore), max: 45, color: '#C2410C' },
      { key: 'support', label: 'Affected citizens', value: Math.round(supportScore), max: 20, color: '#1D4ED8' },
      { key: 'location', label: 'Location sensitivity', value: locationScore, max: 8, color: '#0E7490' },
      { key: 'time', label: 'Time pending', value: Math.round(timeScore), max: 20, color: '#B45309' },
      { key: 'related', label: 'Related reports', value: duplicateScore, max: 12, color: '#6D28D9' }
    ]
  };
}

export function levelFromScore(total) {
  if (total >= 80) return 'Critical';
  if (total >= 60) return 'High';
  if (total >= 35) return 'Medium';
  return 'Low';
}

export function priorityRank(priority) {
  return { Critical: 4, High: 3, Medium: 2, Low: 1 }[priority] || 0;
}

export function daysPending(createdAt) {
  if (!createdAt) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)));
}

export function clusterComplaints(complaints = []) {
  const groups = {};
  complaints.forEach((item) => {
    const key = `${item.category}::${extractArea(item.location).toLowerCase()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return Object.entries(groups)
    .map(([key, items]) => {
      const [category, area] = key.split('::');
      const top = [...items].sort(
        (a, b) => calculatePriorityScore(b, complaints).total - calculatePriorityScore(a, complaints).total
      )[0];
      return {
        id: key,
        category,
        area: extractArea(items[0]?.location),
        complaints: items,
        reportCount: items.length,
        affectedCitizens: items.reduce((sum, c) => sum + (c.supportCount || 0), 0),
        priority: top?.priority || 'Medium',
        status: top?.status || 'Pending',
        title: top?.title || category
      };
    })
    .filter((cluster) => cluster.reportCount >= 2)
    .sort((a, b) => b.reportCount - a.reportCount);
}
