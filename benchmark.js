const REWARDS_ARRAY = {
  cade: Array.from({ length: 1000 }, (_, i) => ({ tier: i, title: "Title " + i, content: "Content " + i })),
  morgan: Array.from({ length: 1000 }, (_, i) => ({ tier: i, title: "Title " + i, content: "Content " + i }))
};

const REWARDS_MAP = {
  cade: Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [i, { title: "Title " + i, content: "Content " + i }])),
  morgan: Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [i, { title: "Title " + i, content: "Content " + i }]))
};

const TARGET = 999;
const ITERATIONS = 100000;

console.time("Array.find()");
for (let i = 0; i < ITERATIONS; i++) {
  const cadeReward = REWARDS_ARRAY.cade.find(r => r.tier === TARGET);
  const morganReward = REWARDS_ARRAY.morgan.find(r => r.tier === TARGET);
}
console.timeEnd("Array.find()");

console.time("Hash Map Lookup");
for (let i = 0; i < ITERATIONS; i++) {
  const cadeReward = REWARDS_MAP.cade[TARGET];
  const morganReward = REWARDS_MAP.morgan[TARGET];
}
console.timeEnd("Hash Map Lookup");
