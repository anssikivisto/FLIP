"""Content library for Kid English Trainer (Finnish -> English).
Emoji-based vocabulary + number generators. Edit here to add words/topics."""

ANIMALS = [
    {"en": "dog", "fi": "koira", "emoji": "🐶"},
    {"en": "cat", "fi": "kissa", "emoji": "🐱"},
    {"en": "bear", "fi": "karhu", "emoji": "🐻"},
    {"en": "lion", "fi": "leijona", "emoji": "🦁"},
    {"en": "rabbit", "fi": "pupu", "emoji": "🐰"},
    {"en": "fox", "fi": "kettu", "emoji": "🦊"},
    {"en": "elephant", "fi": "norsu", "emoji": "🐘"},
    {"en": "monkey", "fi": "apina", "emoji": "🐒"},
    {"en": "bird", "fi": "lintu", "emoji": "🐦"},
    {"en": "duck", "fi": "sorsa", "emoji": "🦆"},
    {"en": "horse", "fi": "hevonen", "emoji": "🐴"},
    {"en": "pig", "fi": "possu", "emoji": "🐷"},
    {"en": "frog", "fi": "sammakko", "emoji": "🐸"},
    {"en": "fish", "fi": "kala", "emoji": "🐟"},
    {"en": "owl", "fi": "pöllö", "emoji": "🦉"},
    {"en": "wolf", "fi": "susi", "emoji": "🐺"},
    {"en": "mouse", "fi": "hiiri", "emoji": "🐭"},
    {"en": "turtle", "fi": "kilpikonna", "emoji": "🐢"},
    {"en": "bee", "fi": "mehiläinen", "emoji": "🐝"},
    {"en": "butterfly", "fi": "perhonen", "emoji": "🦋"},
    {"en": "penguin", "fi": "pingviini", "emoji": "🐧"},
    {"en": "dolphin", "fi": "delfiini", "emoji": "🐬"},
    {"en": "giraffe", "fi": "kirahvi", "emoji": "🦒"},
    {"en": "koala", "fi": "koala", "emoji": "🐨"},
    {"en": "tiger", "fi": "tiikeri", "emoji": "🐯"},
]

FOODS = [
    {"en": "apple", "fi": "omena", "emoji": "🍎"},
    {"en": "banana", "fi": "banaani", "emoji": "🍌"},
    {"en": "pizza", "fi": "pitsa", "emoji": "🍕"},
    {"en": "milk", "fi": "maito", "emoji": "🥛"},
    {"en": "bread", "fi": "leipä", "emoji": "🍞"},
    {"en": "cheese", "fi": "juusto", "emoji": "🧀"},
    {"en": "ice cream", "fi": "jäätelö", "emoji": "🍦"},
    {"en": "strawberry", "fi": "mansikka", "emoji": "🍓"},
    {"en": "carrot", "fi": "porkkana", "emoji": "🥕"},
    {"en": "cake", "fi": "kakku", "emoji": "🎂"},
    {"en": "cookie", "fi": "keksi", "emoji": "🍪"},
    {"en": "water", "fi": "vesi", "emoji": "💧"},
    {"en": "orange", "fi": "appelsiini", "emoji": "🍊"},
    {"en": "watermelon", "fi": "vesimeloni", "emoji": "🍉"},
    {"en": "egg", "fi": "muna", "emoji": "🥚"},
    {"en": "chicken", "fi": "kana", "emoji": "🍗"},
    {"en": "hamburger", "fi": "hampurilainen", "emoji": "🍔"},
    {"en": "fries", "fi": "ranskalaiset", "emoji": "🍟"},
    {"en": "donut", "fi": "donitsi", "emoji": "🍩"},
    {"en": "candy", "fi": "karkki", "emoji": "🍬"},
    {"en": "pineapple", "fi": "ananas", "emoji": "🍍"},
    {"en": "grapes", "fi": "viinirypäleet", "emoji": "🍇"},
    {"en": "corn", "fi": "maissi", "emoji": "🌽"},
    {"en": "pancake", "fi": "ohukainen", "emoji": "🥞"},
    {"en": "honey", "fi": "hunaja", "emoji": "🍯"},
]

COLORS = [
    {"en": "red", "fi": "punainen", "hex": "#EF4444", "emoji": "🔴"},
    {"en": "blue", "fi": "sininen", "hex": "#3B82F6", "emoji": "🔵"},
    {"en": "yellow", "fi": "keltainen", "hex": "#FACC15", "emoji": "🟡"},
    {"en": "green", "fi": "vihreä", "hex": "#22C55E", "emoji": "🟢"},
    {"en": "orange", "fi": "oranssi", "hex": "#F97316", "emoji": "🟠"},
    {"en": "purple", "fi": "violetti", "hex": "#A855F7", "emoji": "🟣"},
    {"en": "pink", "fi": "vaaleanpunainen", "hex": "#EC4899", "emoji": "🌸"},
    {"en": "black", "fi": "musta", "hex": "#18181B", "emoji": "⚫"},
    {"en": "white", "fi": "valkoinen", "hex": "#F4F4F5", "emoji": "⚪"},
    {"en": "brown", "fi": "ruskea", "hex": "#8B5E34", "emoji": "🟤"},
]

_EN_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
_EN_TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
             "sixteen", "seventeen", "eighteen", "nineteen"]
_EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

_FI_ONES = ["", "yksi", "kaksi", "kolme", "neljä", "viisi", "kuusi", "seitsemän", "kahdeksan", "yhdeksän"]


def number_to_english(n: int) -> str:
    if n == 100:
        return "one hundred"
    if n < 10:
        return _EN_ONES[n]
    if n < 20:
        return _EN_TEENS[n - 10]
    tens, ones = divmod(n, 10)
    if ones == 0:
        return _EN_TENS[tens]
    return f"{_EN_TENS[tens]}-{_EN_ONES[ones]}"


def number_to_finnish(n: int) -> str:
    if n == 100:
        return "sata"
    if n == 10:
        return "kymmenen"
    if n < 10:
        return _FI_ONES[n]
    if n < 20:
        return f"{_FI_ONES[n - 10]}toista"
    tens, ones = divmod(n, 10)
    tens_word = f"{_FI_ONES[tens]}kymmentä"
    if ones == 0:
        return tens_word
    return f"{tens_word}{_FI_ONES[ones]}"


def _number_items(start: int, end: int):
    items = []
    for n in range(start, end + 1):
        items.append({
            "en": number_to_english(n),
            "fi": number_to_finnish(n),
            "display": str(n),
            "value": n,
        })
    return items


NUMBER_LEVELS = [
    {"id": "1-10", "label": "1 – 10", "items": _number_items(1, 10)},
    {"id": "11-20", "label": "11 – 20", "items": _number_items(11, 20)},
    {"id": "21-100", "label": "21 – 100", "items": _number_items(21, 100)},
]


def build_topics():
    """Full content library served to the frontend."""
    return [
        {
            "id": "animals",
            "order": 1,
            "title_fi": "Eläimet",
            "title_en": "Animals",
            "emoji": "🦁",
            "kind": "emoji",
            "theme": {"bg": "#FEF3C7", "border": "#F59E0B", "accent": "#D97706"},
            "has_levels": False,
            "items": ANIMALS,
            "levels": [],
        },
        {
            "id": "colors",
            "order": 2,
            "title_fi": "Värit",
            "title_en": "Colors",
            "emoji": "🎨",
            "kind": "color",
            "theme": {"bg": "#F3E8FF", "border": "#A855F7", "accent": "#7E22CE"},
            "has_levels": False,
            "items": COLORS,
            "levels": [],
        },
        {
            "id": "numbers",
            "order": 3,
            "title_fi": "Numerot",
            "title_en": "Numbers",
            "emoji": "🔢",
            "kind": "number",
            "theme": {"bg": "#E0F2FE", "border": "#0EA5E9", "accent": "#0369A1"},
            "has_levels": True,
            "items": [],
            "levels": NUMBER_LEVELS,
        },
        {
            "id": "foods",
            "order": 4,
            "title_fi": "Ruoat",
            "title_en": "Foods",
            "emoji": "🍕",
            "kind": "emoji",
            "theme": {"bg": "#D1FAE5", "border": "#10B981", "accent": "#047857"},
            "has_levels": False,
            "items": FOODS,
            "levels": [],
        },
    ]
