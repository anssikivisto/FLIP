// Reward stickers. Star-threshold stickers unlock as total stars grow;
// mastery stickers unlock by finishing a topic's games enough times.

export const MASTERY_TIMES = 3;

export const STAR_STICKERS = [
  { id: "star", emoji: "🌟", name_fi: "Tähti", cost: 5 },
  { id: "rainbow", emoji: "🌈", name_fi: "Sateenkaari", cost: 10 },
  { id: "lollipop", emoji: "🍭", name_fi: "Tikkari", cost: 20 },
  { id: "rocket", emoji: "🚀", name_fi: "Raketti", cost: 35 },
  { id: "unicorn", emoji: "🦄", name_fi: "Yksisarvinen", cost: 50 },
  { id: "crown", emoji: "👑", name_fi: "Kruunu", cost: 75 },
  { id: "dragon", emoji: "🐉", name_fi: "Lohikäärme", cost: 100 },
  { id: "trophy", emoji: "🏆", name_fi: "Pokaali", cost: 150 },
  { id: "diamond", emoji: "💎", name_fi: "Timantti", cost: 200 },
  { id: "world", emoji: "🌍", name_fi: "Maailma", cost: 300 },
];

export const MASTERY_STICKERS = [
  { id: "m_animals", emoji: "🦁", name_fi: "Eläinmestari", topic: "animals", topic_fi: "Eläimet" },
  { id: "m_colors", emoji: "🎨", name_fi: "Värimestari", topic: "colors", topic_fi: "Värit" },
  { id: "m_numbers", emoji: "🔢", name_fi: "Numeromestari", topic: "numbers", topic_fi: "Numerot" },
  { id: "m_foods", emoji: "🍕", name_fi: "Ruokamestari", topic: "foods", topic_fi: "Ruoat" },
  { id: "m_body", emoji: "🖐️", name_fi: "Kehomestari", topic: "body", topic_fi: "Keho" },
  { id: "m_clothes", emoji: "👕", name_fi: "Vaatemestari", topic: "clothes", topic_fi: "Vaatteet" },
  { id: "m_nature", emoji: "🌳", name_fi: "Luontomestari", topic: "nature", topic_fi: "Luonto" },
];

export const ALL_STICKERS = [...STAR_STICKERS, ...MASTERY_STICKERS];

export function getStickerById(id) {
  return ALL_STICKERS.find((s) => s.id === id);
}

function topicRoundCount(progress, topicId) {
  const c = progress.completed || {};
  return Object.entries(c)
    .filter(([k]) => k.startsWith(`${topicId}:`))
    .reduce((sum, [, v]) => sum + v, 0);
}

// Ids the player has currently earned given their progress.
export function earnedStickerIds(progress) {
  const ids = [];
  for (const s of STAR_STICKERS) {
    if ((progress.stars || 0) >= s.cost) ids.push(s.id);
  }
  for (const m of MASTERY_STICKERS) {
    if (topicRoundCount(progress, m.topic) >= MASTERY_TIMES) ids.push(m.id);
  }
  return ids;
}
