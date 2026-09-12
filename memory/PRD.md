# Kid English Trainer (Finnish → English) — PRD

## Original Problem Statement
Pelillistetty sanastopeli suomenkielisille 7–8-vuotiaille (Finnish → English). Web-sovellus, responsiivinen, toimii koulun tableteilla ja kotikoneilla. Ei tilejä, ei henkilötietoja, ei puheen arvostelua.

## Architecture
- **Frontend:** React (JSX) + Tailwind, single-page state machine (menu → levels → tasks → game → complete). No URL routing.
- **Backend:** FastAPI serving the content library as JSON (`/api/content`, `/api/topics`, `/api/topics/{id}`). Content editable in `/app/backend/content_data.py`.
- **DB:** MongoDB `content_topics` collection, idempotently seeded on startup.
- **Audio:** Browser `SpeechSynthesis` (English word playback) + `MediaRecorder` (Speak task) + Web Audio sound effects.
- **Progress:** browser `localStorage` (stars, streak) — no server-side personal data (GDPR-K).
- Content cached in `localStorage` for offline / flaky school wifi.

## User Personas
- Primary: 7–8-year-old Finnish early readers, touch-first.
- Secondary: parents/teachers who just open the app and hand over the device.

## Core Requirements (static)
- Topics: Eläimet (25), Värit (10), Numerot (levels 1-10 / 11-20 / 21-100), Ruoat (25).
- Task types: Tunnista, Yhdistä, Puhu, Kirjoita sana.
- Fixed top back-button; forward arrow (→); star rewards; mute toggle; Finnish instructions, English target words.
- No accounts, no personal data, no speech scoring.

## Implemented (2026-06-12)
- Backend content library + 3 read endpoints, MongoDB seeding. (tested 100%)
- Topic menu, number-level select, task menu, round-complete screen with mascot (Koko Pöllö 🦉).
- All 4 task components: Recognize (10 Q), Match (tap + drag, batches of 4), Speak (record/playback, mic fallback, no scoring), Write (live green letters, case-insensitive, hint, TTS on complete).
- Sticky top back-button, → NextArrow, star + streak counters, mute toggle, reset progress.
- localStorage progress + content caching. Warm playful palette, Fredoka/Nunito fonts, tactile 3D buttons, staggered animations.
- Full e2e tested: backend 9/9 pytest, frontend all flows pass.

## Backlog / Future (not now)
- P2: More topics (Perhe, Keho, Sää, Vaatteet).
- P2: Content-driven session length (Match currently fixed at 8 items).
- P2: Shareable link for colleagues to get latest content pack.
- P2: Sentence-level practice once vocabulary is mastered.
