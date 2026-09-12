// Speech synthesis (English words) + Web Audio sound effects + mute handling.

const MUTE_KEY = "ket_muted";
const VOICE_KEY = "ket_voice_v1";
const DEFAULT_VOICE = { accent: "gb", rate: 0.85 };

export function isMuted() {
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(muted) {
  localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

export function getVoiceSettings() {
  try {
    return { ...DEFAULT_VOICE, ...JSON.parse(localStorage.getItem(VOICE_KEY) || "{}") };
  } catch (e) {
    return { ...DEFAULT_VOICE };
  }
}

export function setVoiceSettings(patch) {
  const merged = { ...getVoiceSettings(), ...patch };
  localStorage.setItem(VOICE_KEY, JSON.stringify(merged));
  return merged;
}

let _voices = [];
function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  _voices = window.speechSynthesis.getVoices() || [];
}
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickEnglishVoice(accent) {
  if (!_voices.length) loadVoices();
  const gb = _voices.find((v) => /en[-_]GB/i.test(v.lang));
  const us = _voices.find((v) => /en[-_]US/i.test(v.lang));
  const anyEn = _voices.find((v) => /^en/i.test(v.lang));
  if (accent === "us") return us || gb || anyEn || null;
  return gb || us || anyEn || null;
}

// Read an English word aloud. Fallback-safe across browsers.
export function speak(text, { onEnd } = {}) {
  if (isMuted() || !("speechSynthesis" in window) || !text) {
    if (onEnd) setTimeout(onEnd, 250);
    return;
  }
  try {
    const { accent, rate } = getVoiceSettings();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickEnglishVoice(accent);
    if (voice) u.voice = voice;
    u.lang = accent === "us" ? "en-US" : "en-GB";
    u.rate = Math.min(1.5, Math.max(0.5, rate || 0.85));
    u.pitch = 1.08;
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  } catch (e) {
    if (onEnd) setTimeout(onEnd, 250);
  }
}

let _ctx = null;
function ctx() {
  if (isMuted()) return null;
  try {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (_ctx.state === "suspended") _ctx.resume();
    return _ctx;
  } catch (e) {
    return null;
  }
}

function tone(freq, start, dur, type = "sine", gain = 0.18) {
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  g.gain.setValueAtTime(0.0001, ac.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.02);
}

// Happy ascending chime (C5 -> E5 -> G5)
export function playCorrect() {
  tone(523.25, 0, 0.16, "triangle");
  tone(659.25, 0.12, 0.16, "triangle");
  tone(783.99, 0.24, 0.28, "triangle");
}

// Gentle "try again" boing — never harsh
export function playTryAgain() {
  tone(392.0, 0, 0.14, "sine", 0.14);
  tone(329.63, 0.1, 0.2, "sine", 0.14);
}

// Star fanfare
export function playStar() {
  tone(659.25, 0, 0.12, "square", 0.12);
  tone(783.99, 0.1, 0.12, "square", 0.12);
  tone(1046.5, 0.2, 0.32, "square", 0.12);
}
