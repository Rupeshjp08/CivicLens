const STORAGE_KEY = 'civiclens_my_report_ids';

export function getMyReportIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rememberReportId(id) {
  if (!id) return;
  const next = [id, ...getMyReportIds().filter((item) => item !== id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 40)));
}

export function seedDemoReports() {
  const existing = getMyReportIds();
  if (existing.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['CIV-3913']));
  }
}
