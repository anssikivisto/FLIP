// localStorage progress (no personal data -> GDPR-K friendly).

const KEY = "ket_progress_v1";

const DEFAULT = { stars: 0, streak: 0, lastPlayDay: null, completed: {} };

export function getProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT };
  }
}

function save(p) {
  localStorage.setItem(KEY, JSON.stringify(p));
  return p;
}

export function addStars(n) {
  const p = getProgress();
  p.stars += n;
  return save(p);
}

export function completeRound(topicId, taskId) {
  const p = getProgress();
  const today = new Date().toISOString().slice(0, 10);
  // streak: increment once per new day played
  if (p.lastPlayDay !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    p.streak = p.lastPlayDay === yesterday ? p.streak + 1 : 1;
    p.lastPlayDay = today;
  }
  const key = `${topicId}:${taskId}`;
  p.completed[key] = (p.completed[key] || 0) + 1;
  return save(p);
}

export function resetProgress() {
  return save({ ...DEFAULT });
}
