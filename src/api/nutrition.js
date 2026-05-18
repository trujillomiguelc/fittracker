const WORKER_URL = "https://trujillomiguelc--48b207b6498811f19cca42b51c65c3df.web.val.run";

const NUTRITION_DB = {
  "egg": { cal: 70, p: 6, c: 0.5, f: 5 },
  "scrambled egg": { cal: 91, p: 6, c: 1, f: 7 },
  "chicken breast": { cal: 165, p: 31, c: 0, f: 3.6 },
  "ground turkey": { cal: 149, p: 21, c: 0, f: 7 },
  "turkey": { cal: 149, p: 21, c: 0, f: 7 },
  "salmon": { cal: 208, p: 20, c: 0, f: 13 },
  "tuna": { cal: 116, p: 26, c: 0, f: 1 },
  "shrimp": { cal: 99, p: 24, c: 0, f: 0.3 },
  "greek yogurt": { cal: 59, p: 10, c: 3.6, f: 0.4 },
  "whey protein": { cal: 120, p: 24, c: 4, f: 1.5 },
  "protein shake": { cal: 120, p: 24, c: 4, f: 1.5 },
  "cottage cheese": { cal: 98, p: 11, c: 3.4, f: 4.3 },
  "prosciutto": { cal: 145, p: 24, c: 0, f: 5 },
  "hard boiled egg": { cal: 78, p: 6, c: 0.6, f: 5 },
  "milk": { cal: 61, p: 3.2, c: 4.8, f: 3.3 },
  "2% milk": { cal: 50, p: 3.4, c: 4.9, f: 2 },
  "cheese": { cal: 113, p: 7, c: 0.4, f: 9 },
  "queso fresco": { cal: 55, p: 3.6, c: 0, f: 4 },
  "monterey jack": { cal: 100, p: 7, c: 0, f: 8 },
  "oatmeal": { cal: 71, p: 2.5, c: 12, f: 1.5 },
  "rice": { cal: 130, p: 2.7, c: 28, f: 0.3 },
  "pasta": { cal: 131, p: 5, c: 25, f: 1.1 },
  "quinoa": { cal: 120, p: 4.4, c: 21, f: 1.9 },
  "bread": { cal: 79, p: 2.7, c: 15, f: 1 },
  "sourdough": { cal: 120, p: 4, c: 23, f: 1 },
  "tortilla": { cal: 70, p: 6, c: 14, f: 1 },
  "granola": { cal: 132, p: 3, c: 18, f: 5 },
  "cracker": { cal: 17, p: 0.3, c: 2.3, f: 0.7 },
  "potato": { cal: 77, p: 2, c: 17, f: 0.1 },
  "sweet potato": { cal: 86, p: 1.6, c: 20, f: 0.1 },
  "banana": { cal: 105, p: 1.3, c: 27, f: 0.4 },
  "apple": { cal: 95, p: 0.5, c: 25, f: 0.3 },
  "strawberr": { cal: 32, p: 0.7, c: 7.7, f: 0.3 },
  "blueberr": { cal: 57, p: 0.7, c: 14, f: 0.3 },
  "orange": { cal: 62, p: 1.2, c: 15, f: 0.2 },
  "mango": { cal: 99, p: 1.4, c: 25, f: 0.6 },
  "broccoli": { cal: 31, p: 2.6, c: 6, f: 0.3 },
  "spinach": { cal: 23, p: 2.9, c: 3.6, f: 0.4 },
  "carrot": { cal: 41, p: 0.9, c: 10, f: 0.2 },
  "celery": { cal: 16, p: 0.7, c: 3, f: 0.2 },
  "tomato": { cal: 18, p: 0.9, c: 3.9, f: 0.2 },
  "onion": { cal: 40, p: 1.1, c: 9.3, f: 0.1 },
  "bell pepper": { cal: 31, p: 1, c: 6, f: 0.3 },
  "corn": { cal: 86, p: 3.2, c: 19, f: 1.2 },
  "peas": { cal: 81, p: 5.4, c: 14, f: 0.4 },
  "cucumber": { cal: 16, p: 0.7, c: 3.6, f: 0.1 },
  "olive oil": { cal: 119, p: 0, c: 0, f: 14 },
  "peanut butter": { cal: 94, p: 4, c: 3, f: 8 },
  "avocado": { cal: 160, p: 2, c: 9, f: 15 },
  "mayo": { cal: 45, p: 0, c: 1, f: 4.5 },
  "butter": { cal: 102, p: 0.1, c: 0, f: 11.5 },
  "burger": { cal: 550, p: 30, c: 40, f: 25 },
  "fries": { cal: 365, p: 4, c: 48, f: 17 },
  "pizza": { cal: 285, p: 12, c: 36, f: 10 },
  "sushi": { cal: 45, p: 2, c: 9, f: 0.5 },
  "sandwich": { cal: 350, p: 18, c: 38, f: 12 },
  "salad": { cal: 150, p: 5, c: 12, f: 8 },
  "soup": { cal: 150, p: 8, c: 18, f: 4 },
  "taco": { cal: 226, p: 12, c: 20, f: 9 },
  "burrito": { cal: 490, p: 22, c: 58, f: 17 },
  "stir fry": { cal: 312, p: 18, c: 28, f: 12 },
  "quesadilla": { cal: 400, p: 20, c: 35, f: 18 },
};

const NUM_WORDS = { one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, half:0.5, quarter:0.25, dozen:12 };

function estimateNutrition(input) {
  const text = input.toLowerCase();
  let qty = 1;
  const numMatch = text.match(/^(\d+\.?\d*)\s/);
  if (numMatch) qty = parseFloat(numMatch[1]);
  else {
    for (const [word, val] of Object.entries(NUM_WORDS)) {
      if (text.includes(word + " ")) { qty = val; break; }
    }
  }
  let bestMatch = null, bestScore = 0;
  for (const [key, data] of Object.entries(NUTRITION_DB)) {
    if (text.includes(key)) {
      const score = key.length;
      if (score > bestScore) { bestScore = score; bestMatch = { key, data }; }
    }
  }
  if (!bestMatch) return null;
  const { data } = bestMatch;
  const cleanInput = input.trim();
  const name = cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1);
  return {
    name,
    calories: Math.round(data.cal * qty),
    protein: Math.round(data.p * qty * 10) / 10,
    carbs: Math.round(data.c * qty * 10) / 10,
    fat: Math.round(data.f * qty * 10) / 10,
  };
}

export async function logFoodSmart(input) {
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ food: input }),
    });
    if (res.ok) {
      const text = await res.text();
      return JSON.parse(text);
    }
  } catch {}
  const local = estimateNutrition(input);
  if (local) return { items: [local] };
  return null;
}
