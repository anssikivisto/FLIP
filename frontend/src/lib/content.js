import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CACHE_KEY = "ket_content_cache_v1";

// Fetch content library; cache in localStorage for offline / flaky school wifi.
export async function loadContent() {
  try {
    const res = await axios.get(`${API}/content`, { timeout: 8000 });
    const topics = res.data.topics || [];
    localStorage.setItem(CACHE_KEY, JSON.stringify(topics));
    return topics;
  } catch (e) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    throw e;
  }
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Resolve the playable item pool for a topic (+ optional number level).
export function getPool(topic, levelId) {
  if (topic.has_levels) {
    const lvl = (topic.levels || []).find((l) => l.id === levelId) || topic.levels[0];
    return lvl ? lvl.items : [];
  }
  return topic.items || [];
}
