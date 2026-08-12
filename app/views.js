// All app views. Markers the animator uses:
//  .v-stagger     — staggered entrance
//  .count[data-to][data-suffix] — number roll-up
//  .bar-fill[data-w] — width fill
//  .ring-fg[data-pct] — SVG ring fill (r=26, C≈163.4)
const ICON = (n, cls = "") => `<span class="material-symbols-outlined ${cls}">${n}</span>`;
const ring = (pct, label, value, unit) => `
  <div class="v-stagger bg-iron border border-whisper rounded-xl p-5 flex items-center gap-4">
    <svg width="64" height="64" viewBox="0 0 64 64" class="-rotate-90">
      <circle cx="32" cy="32" r="26" fill="none" stroke="#232326" stroke-width="5"/>
      <circle class="ring-fg" data-pct="${pct}" cx="32" cy="32" r="26" fill="none" stroke="#c99b4a" style="stroke:var(--c-ember)"
        stroke-width="5" stroke-linecap="round" stroke-dasharray="163.4" stroke-dashoffset="163.4"/>
    </svg>
    <div><p class="text-xs font-mono tracking-widest text-ash mb-1">${label}</p>
      <p class="font-mono text-lg">${value}<span class="text-ash text-xs ml-1">${unit}</span></p></div>
  </div>`;

const HABITS = [
  ["water_drop","Hydration",true],["auto_stories","Bible",true],["volunteer_activism","Prayer",true],
  ["self_improvement","Meditation",false],["import_contacts","Reading",false],["exercise","Training",false],
];

/* ---- Exercise catalog: every movement gets a picture + a coach's cue ---- */
const EXIMG = {
  bench: "assets/gen-bench.png", ohp: "assets/gen2-ohp.png", row: "assets/gen2-row.png",
  sprint: "assets/gen2-sprint.png", circuit: "assets/gen2-circuit.png",
  mob: "assets/gen2-mob.png", legs: "assets/gen2-legs.png",
  carry: "assets/gen2-carry.png", walk: "assets/gen2-walk.png",
  partner: "assets/gen2-partner.png", fast: "assets/gen2-fast.png",
  skierg: "assets/gen2-skierg.png",
};
const CUES = {
  bench: "Feet planted, shoulder blades pinned, bar path over mid-chest. Pause a beat at the bottom.",
  ohp: "Squeeze the glutes, ribs down, press to a full lockout overhead. No lean-back.",
  row: "Legs, back, arms on the drive. Arms, back, legs on the recovery. Hold that order under fatigue.",
  sprint: "Tall posture, drive the arms, land under your hips. Effort 9 of 10 — walk it off fully.",
  circuit: "Move with intent, not panic. Smooth is fast. Breathe on every rep.",
  mob: "Slow, deliberate, full range. Exhale into the stretch. Nothing sharp.",
  legs: "Brace before you descend. Knees track the toes, drive the floor away.",
  carry: "Crush grip, tall spine, short quick steps. Own the weight from pickup to setdown.",
  walk: "Zone 2 — you can hold a conversation. Use it to pray, listen, and reset.",
  partner: "Match your brother's pace. Call the reps out loud. Nobody drifts.",
  fast: "Empty stomach, full spirit. Hydrate with electrolytes and keep the pace easy.",
};
const EX = (k, n, v) => ({ k, n, v });
/* Motion renders built from the Higgsfield stills — real playing video */
const EXVID = { bench: "assets/gen2-bench.mp4", ohp: "assets/gen2-ohp.mp4", row: "assets/gen2-row.mp4", legs: "assets/gen2-legs.mp4", sprint: "assets/gen2-sprint.mp4" };
const HEROVID = { "assets/gen-bench.png": "assets/gen2-bench.mp4", "assets/gen2-ohp.png": "assets/gen2-ohp.mp4", "assets/gen2-row.png": "assets/gen2-row.mp4", "assets/gen2-legs.png": "assets/gen2-legs.mp4", "assets/gen2-sprint.png": "assets/gen2-sprint.mp4" };
const media = (img, cls) => HEROVID[img]
  ? `<video src="${HEROVID[img]}" poster="${img}" autoplay loop muted playsinline class="${cls || "ig-img"}"></video>`
  : `<img onerror="this.remove()" loading="lazy" decoding="async" src="${img}" alt="" class="${cls || "ig-img"}"/>`;

/* ---- Session templates: intro → warmup → named working sets → cooldown ---- */
const WARM_STD = { intro: "Full-body mobility, form drills, and short primers — dials the pattern in before load.",
  items: [EX("mob","Pogo hops","00:45 sec"), EX("mob","Banded good mornings","00:30 sec"), EX("mob","Standing T-spine rotation","00:45 sec"), EX("mob","World's greatest stretch","00:45 sec"), EX("mob","Hip openers","00:45 sec")] };
const COOL_STD = { intro: "Easy movement into hip, shoulder, and posterior-chain stretches, with breathwork to close. Flushes the engine and resets your nervous system before the next session.",
  items: [EX("walk","Easy pace flush","03:00 min"), EX("mob","Hip flexor stretch (left)","00:45 sec"), EX("mob","Hip flexor stretch (right)","00:45 sec"), EX("mob","Pec stretch (left / right)","00:30 sec"), EX("mob","Shoulder + lat stretch","00:45 sec"), EX("mob","Couch stretch (left / right)","00:45 sec")] };

const SESSIONS = {
  push: { target: "Chest · Shoulders · Triceps",
    intro: "Open the week with pressing power. Set an honest working weight, hold clean mechanics, and trust the number you put on the board.",
    warm: { intro: "Shoulder and T-spine prep plus two ramp-up sets — opens the press pattern before heavy work.",
      items: [EX("mob","Forward arm circles","00:20 sec"), EX("mob","Backward arm circles","00:20 sec"), EX("mob","Standing T-spine rotation","00:30 sec"), EX("bench","Barbell flat bench press (25% lifting weight)","12 reps"), EX("bench","Barbell flat bench press (50% lifting weight)","8 reps")] },
    sets: [
      { head: "Working Set A: Bench Benchmark", desc: "Top pressing volume at a repeatable weight. Note the load — you'll measure progress against it later in the program.", label: "WORKING SET A: BENCHMARK", rounds: 3, rest: "01:00", items: [EX("bench","Barbell flat bench press","10 reps")] },
      { head: "Working Set B", desc: "Press-and-brace superset. Keep the shoulder press strict and the tucks controlled — no swinging.", label: "WORKING SET B: 3 ROUNDS FOR TIME", rounds: 3, rest: "00:50", items: [EX("ohp","Dumbbell seated shoulder press","10 reps"), EX("circuit","Bench knee tucks","12 reps")] },
      { head: "Working Set C: Engine Finisher", desc: "Compromised breathing work — hold your stroke quality when the heart rate is high.", label: "WORKING SETS - FINISHER", rounds: 2, rest: "00:30", items: [EX("row","SkiErg (medium pace)","0.31mi"), EX("circuit","Plank shoulder taps","00:30 sec")] }],
    cool: COOL_STD },
  pull: { target: "Back · Biceps · Grip",
    intro: "Pull day. Every rep starts at the lats and ends at the hips — grip the bar like it owes you something.",
    warm: { intro: "Band work and scap activation — wakes the upper back up before rowing volume.",
      items: [EX("mob","Band pull-aparts","15 reps"), EX("mob","Scap pull-ups","8 reps"), EX("row","Barbell bent-over row (40% lifting weight)","10 reps")] },
    sets: [
      { head: "Working Set A: Row Volume", desc: "Heavy honest rows. Chest tall, elbows to the hips, control the return.", label: "WORKING SET A", rounds: 3, rest: "01:00", items: [EX("row","Barbell bent-over row","10 reps")] },
      { head: "Working Set B", desc: "Width and rear-delt superset — the posture builders.", label: "WORKING SET B: 3 ROUNDS", rounds: 3, rest: "00:50", items: [EX("row","Lat pulldown","12 reps"), EX("ohp","Cable face pulls","15 reps")] },
      { head: "Working Set C: Grip Finisher", desc: "Rope waves into a hollow hold. Grip and trunk finish the day.", label: "WORKING SETS - FINISHER", rounds: 2, rest: "00:40", items: [EX("circuit","Battle rope waves","00:30 sec"), EX("circuit","Hollow body hold","00:30 sec")] }],
    cool: COOL_STD },
  legs: { target: "Quads · Glutes · Hamstrings",
    intro: "Leg day carries the whole program. Brace hard, hit depth, and leave a rep in the tank on every set.",
    warm: { intro: "Ankles, hips and two light ramp sets — earns the right to load the squat.",
      items: [EX("mob","Air squats","15 reps"), EX("mob","Walking lunges","10 reps"), EX("legs","Goblet squat (40% lifting weight)","10 reps")] },
    sets: [
      { head: "Working Set A: Squat Benchmark", desc: "Four heavy sets. Same bar path every rep — depth doesn't negotiate.", label: "WORKING SET A: BENCHMARK", rounds: 4, rest: "01:30", items: [EX("legs","Barbell back squat","8 reps")] },
      { head: "Working Set B", desc: "Posterior chain and single-leg strength. Slow eccentrics.", label: "WORKING SET B: 3 ROUNDS", rounds: 3, rest: "01:00", items: [EX("legs","Romanian deadlift","10 reps"), EX("legs","Bulgarian split squat (each leg)","8 reps")] },
      { head: "Working Set C: Sled Finisher", desc: "Heavy pushes and calves to empty the tank.", label: "WORKING SETS - FINISHER", rounds: 2, rest: "00:45", items: [EX("carry","Sled push (heavy)","0.01mi"), EX("circuit","Standing calf raises","15 reps")] }],
    cool: COOL_STD },
  hiit: { target: "Conditioning · Heart rate",
    intro: "Race-pace intervals. Aim for repeatable splits — pacing discipline is the whole job today.",
    warm: { intro: "Easy jog and drills — primes the legs and lungs for repeat sprints.",
      items: [EX("walk","Easy jog","03:00 min"), EX("mob","High knees","00:30 sec"), EX("mob","Leg swings (each side)","00:20 sec")] },
    sets: [
      { head: "Working Set A: Sprint Intervals", desc: "Eight repeats at 90% effort. Every split within two seconds of the first.", label: "WORKING SET A: 8 ROUNDS", rounds: 8, rest: "01:00", items: [EX("sprint","Sprint (90% effort)","00:30 sec")] },
      { head: "Working Set B: Engine Finisher", desc: "One hard piece to close. Empty what's left.", label: "WORKING SETS - FINISHER", rounds: 1, rest: "—", items: [EX("circuit","Assault bike (hard pace)","02:00 min")] }],
    cool: COOL_STD },
  liss: { target: "Recovery · Aerobic base",
    intro: "Zone 2 — conversational pace. This session builds the base every hard day withdraws from.",
    warm: { intro: "Loosen the ankles and hips, then settle into pace.", items: [EX("mob","Ankle + hip circles","01:00 min")] },
    sets: [
      { head: "Steady State", desc: "Incline walk, bike or row. If you can't hold a conversation, slow down.", label: "STEADY STATE", rounds: 1, rest: "—", items: [EX("walk","Incline walk, bike or row — zone 2","35:00 min")] }],
    cool: { intro: "Close the session down slowly — breathwork before you touch your phone.", items: [EX("mob","Box breathing 4-4-4-4","03:00 min")] } },
  mobility: { target: "Hips · Spine · Shoulders",
    intro: "Recovery and mobility. This is training too — the men who skip it are the men who get hurt.",
    warm: { intro: "Gentle spinal waves to start.", items: [EX("mob","Cat cow","00:30 sec"), EX("mob","Child's pose + up dog","00:45 sec")] },
    sets: [
      { head: "Flow A: Hips", desc: "Long holds, honest range. Exhale into every position.", label: "FLOW A", rounds: 2, rest: "00:20", items: [EX("mob","World's greatest stretch (each side)","00:40 sec"), EX("mob","90/90 hip switches","00:45 sec"), EX("mob","Knee-to-wall ankle dorsiflexion (left / right)","00:45 sec")] },
      { head: "Flow B: Trunk", desc: "Anti-rotation control to finish.", label: "FLOW B", rounds: 2, rest: "00:20", items: [EX("circuit","Bird dog (each side)","10 reps"), EX("circuit","Dead bug","10 reps"), EX("circuit","Scapular push-up","00:30 sec")] }],
    cool: { intro: "Hang, breathe, walk it off.", items: [EX("mob","Dead hang","00:45 sec"), EX("walk","Nasal-breathing walk","05:00 min")] } },
  circuits: { target: "Full body · Engine",
    intro: "Mixed stations for time. This is your reference for the next four weeks — set an honest pace and hold it.",
    warm: { intro: "Jumping jacks and walkouts — raises the temperature before the clock starts.",
      items: [EX("mob","Jumping jacks","00:45 sec"), EX("circuit","Inchworm walkouts","6 reps")] },
    sets: [
      { head: "Working Set A: Benchmark Circuit", desc: "Three stations, three rounds for time. Note the total — you'll beat it in week four.", label: "WORKING SET A: 3 ROUNDS FOR TIME", rounds: 3, rest: "01:00", items: [EX("ohp","Dumbbell thrusters","12 reps"), EX("circuit","Burpees","10 reps"), EX("legs","Kettlebell swings","15 reps")] },
      { head: "Working Set B: Finisher", desc: "Rows and climbers until the clock says stop.", label: "WORKING SETS - FINISHER", rounds: 2, rest: "00:45", items: [EX("row","Renegade rows","10 reps"), EX("circuit","Mountain climbers","00:30 sec")] }],
    cool: COOL_STD },
  engine: { target: "Aerobic power",
    intro: "Open with a 1000m benchmark and a short station block. Set an honest pace, hold clean mechanics, and trust the number you put on the board.",
    warm: { intro: "Form drills and short pulls — primes the stroke order before sustained work.",
      items: [EX("row","Rower form drill — arms only","00:30 sec"), EX("row","Rower form drill — arms & body (the hinge)","00:30 sec"), EX("row","Rower form drill — quarter to half slide","00:30 sec"), EX("row","Rower form drill — full slide (complete stroke)","00:30 sec"), EX("row","Progressive rower easy pace","05:00 min")] },
    sets: [
      { head: "Working Set A: 1000m Benchmark", desc: "An all-out 1000m row to set your week-one baseline. Note the split — you'll measure progress against it later in the program.", label: "WORKING SET A: BENCHMARK", rounds: 1, rest: "04:00", items: [EX("row","Rower race pace","0.62mi")] },
      { head: "Working Set B", desc: "A 500m row into wall balls and a kettlebell carry. Keep the stroke long, the carry braced, and find a sustainable pace across all three rounds.", label: "WORKING SET B: 3 ROUNDS FOR TIME", rounds: 3, rest: "01:00", items: [EX("row","Rower race pace","0.31mi"), EX("circuit","Wall balls","12 reps"), EX("carry","Kettlebell farmer's carry","0.01mi")] }],
    cool: { intro: "Easy rowing into hip, shoulder, and posterior-chain stretches, with breathwork to close. Flushes the engine and resets your nervous system before the next session.",
      items: [EX("row","Rower easy pace","03:00 min"), EX("mob","Hip flexor stretch (left)","00:45 sec"), EX("mob","Hip flexor stretch (right)","00:45 sec"), EX("mob","Pec stretch (left / right)","00:30 sec"), EX("mob","Shoulder + lat stretch","00:45 sec")] } },
  carries: { target: "Grip · Trunk · Full body",
    intro: "Loaded carries and climbs — strength you can use with a heart rate.",
    warm: { intro: "Scap work and a light carry to groove the position.",
      items: [EX("mob","Scap pull-ups","8 reps"), EX("carry","Farmer carry (light)","0.01mi")] },
    sets: [
      { head: "Working Set A: Heavy Carries", desc: "Four heavy trips. Tall spine, short quick steps.", label: "WORKING SET A", rounds: 4, rest: "01:15", items: [EX("carry","Farmer carry (heavy)","0.02mi")] },
      { head: "Working Set B", desc: "Drags and strict pulls — posterior chain and grip together.", label: "WORKING SET B: 3 ROUNDS", rounds: 3, rest: "01:00", items: [EX("carry","Sled drag","0.01mi"), EX("row","Strict pull-ups","6 reps")] }],
    cool: COOL_STD },
  heavypress: { target: "Chest · Shoulders",
    intro: "Top-set day. Five heavy fives with full rest — strength is built in the quiet minutes between sets.",
    warm: { intro: "Circles, bar work, and one ramp set. Respect the warm-up on heavy days.",
      items: [EX("mob","Forward arm circles","00:20 sec"), EX("bench","Barbell flat bench press (bar only)","10 reps"), EX("bench","Barbell flat bench press (50% lifting weight)","6 reps")] },
    sets: [
      { head: "Working Set A: Top Sets", desc: "Five sets of five at your heavy working weight. A spotter or a brother on the rack.", label: "WORKING SET A: TOP SETS", rounds: 5, rest: "02:00", items: [EX("bench","Barbell flat bench press (heavy)","5 reps")] },
      { head: "Working Set B: Back-off", desc: "Strict overhead volume to finish the shoulders.", label: "WORKING SET B: BACK-OFF", rounds: 3, rest: "01:30", items: [EX("ohp","Standing overhead press","6 reps")] }],
    cool: COOL_STD },
  heavypull: { target: "Back · Posterior chain",
    intro: "Deadlift day. The bar doesn't care how you feel — position and patience.",
    warm: { intro: "Band work and ramp pulls off the floor.",
      items: [EX("mob","Band pull-aparts","15 reps"), EX("row","Deadlift (40% lifting weight)","6 reps")] },
    sets: [
      { head: "Working Set A: Top Sets", desc: "Five heavy fives. Reset every rep — no touch-and-go.", label: "WORKING SET A: TOP SETS", rounds: 5, rest: "02:00", items: [EX("row","Deadlift (heavy)","5 reps")] },
      { head: "Working Set B: Back-off", desc: "Weighted pulls for strict upper-back strength.", label: "WORKING SET B: BACK-OFF", rounds: 3, rest: "01:30", items: [EX("row","Weighted pull-ups","5 reps")] }],
    cool: COOL_STD },
  wod: { target: "Full body · With a brother",
    intro: "Mini simulation with a partner. You go, I go — nobody drifts, nobody hides.",
    warm: { intro: "Shared med-ball warm-up. Set the tone together.",
      items: [EX("partner","Partner med-ball warm-up","03:00 min")] },
    sets: [
      { head: "Working Set A: EMOM 20", desc: "Alternate minutes: 10 dumbbell thrusters / 12-cal row. Call the reps out loud.", label: "WORKING SET A: EMOM 20", rounds: 1, rest: "—", items: [EX("partner","Alternate: 10 DB thrusters / 12 cal row — you go, I go","20:00 min")] },
      { head: "Working Set B: Finisher", desc: "Synchronized burpees to failure. Finish together.", label: "WORKING SETS - FINISHER", rounds: 1, rest: "—", items: [EX("partner","Synchronized burpees to failure","MAX reps")] }],
    cool: { intro: "Cool down together — debrief the week while the heart rate drops.", items: [EX("walk","Cool-down walk together","05:00 min")] } },
  corebreath: { target: "Trunk · Nervous system",
    intro: "Core and breath. Strength in stillness — the quietest session in the program and one of the hardest.",
    warm: { intro: "Spinal waves to arrive.", items: [EX("mob","Cat cow","00:45 sec")] },
    sets: [
      { head: "Working Set A: Trunk", desc: "Holds and side planks. Quality over clock.", label: "WORKING SET A: 3 ROUNDS", rounds: 3, rest: "00:40", items: [EX("circuit","Hollow body hold","00:30 sec"), EX("circuit","Side plank (each side)","00:30 sec")] },
      { head: "Working Set B: Breath", desc: "Box breathing, then stillness. Phone in the other room.", label: "WORKING SET B: BREATH", rounds: 1, rest: "—", items: [EX("mob","Box breathing 4-4-4-4","05:00 min"), EX("mob","Psalm 46:10 stillness — phone away","05:00 min")] }],
    cool: { intro: "Walk slowly. Keep the quiet.", items: [EX("walk","Slow walk","05:00 min")] } },
};

/* ---- Program library: 5 programs · 4 weeks each · unique week name/desc/video ---- */
const PROGRAMS = {
  foundations: {
    name: "Foundations of Iron", tag: "STRENGTH", weeks: 4, meta: "4 Weeks · Full gym",
    level: "Intermediate", cover: "assets/gen-bench.png", active: true, week: 3, done: 9,
    blurb: "The strength base every other program stands on. Bench, row, squat — honest weights, repeatable mechanics.",
    types: ["push","pull","hiit","legs","mobility","liss"],
    weekly: [
      { name: "Week 1: Set the Benchmarks", vid: "assets/gen2-bench.mp4", poster: "assets/gen-bench.png",
        desc: "Everything starts with real numbers. This week you set your working weights on the bench, the row, and the squat — loads you can repeat with clean mechanics, not one-rep heroics. Write them down; the next three weeks are measured against them." },
      { name: "Week 2: Own the Pattern", vid: "assets/wk-farmercarry.mp4", poster: "assets/gen2-carry.png",
        desc: "Same movements, sharper execution. The focus shifts to bar path, bracing, and tempo — a controlled eccentric on every rep, and heavy carries to close each session, because a braced spine is the pattern under every lift. Loads move up only where last week's sets were clean." },
      { name: "Week 3: Load the Base", vid: "assets/gen2-legs.mp4", poster: "assets/gen2-legs.png",
        desc: "The volume peak. Top sets get heavier, rest gets stricter, and the leg day earns its reputation. Expect the week to feel like work — that's the adaptation you came for. Protect sleep and hit your protein target daily." },
      { name: "Week 4: Test and Prove", vid: "assets/gen2-ohp.mp4", poster: "assets/gen2-ohp.png",
        desc: "Re-test week. You return to the week-one benchmarks and put new numbers on the board — then deload the back half of the week so you leave the block recovered, not wrecked. Compare your logbook. The iron doesn't lie." },
    ],
    days: [
      { t: "Strength & conditioning: Push", min: 40, eq: "Barbell · Bench · Dumbbells", img: "assets/gen-bench.png" },
      { t: "Strength & conditioning: Pull", min: 40, eq: "Barbell · Cable · Dumbbells", img: "assets/gen2-row.png" },
      { t: "High-intensity cardio", min: 25, eq: "Optional cardio equipment", img: "assets/gen2-sprint.png" },
      { t: "Strength & conditioning: Legs", min: 40, eq: "Barbell · Bench · Dumbbells", img: "assets/gen2-legs.png" },
      { t: "Mobility & core", min: 15, eq: "Bodyweight", img: "assets/gen2-mob.png" },
      { t: "LISS cardio", min: 35, eq: "Optional cardio equipment", img: "assets/gen2-walk.png", opt: true }],
  },
  protocol: {
    name: "The Fourth Man Protocol", tag: "HYBRID", weeks: 4, meta: "4 Weeks · Rower + kettlebells",
    level: "Advanced", cover: "assets/gen2-row.png",
    blurb: "Strength and engine in the same week — the hybrid standard, built around the rower.",
    types: ["engine","hiit","pull","circuits","carries","liss"],
    weekly: [
      { name: "Week 1: Engine and Stroke Foundation", vid: "assets/gen2-row.mp4", poster: "assets/gen2-row.png",
        desc: "The week opens with the benchmark: a 1000m row plus mixed stations, so you have real numbers to build from. Focus on repeatable stroke mechanics — legs, back, arms on the drive; arms, back, legs on the recovery. Hold that order under fatigue and your split holds with it." },
      { name: "Week 2: Race Pace Intervals", vid: "assets/wk-airbike.mp4", poster: "assets/gen2-sprint.png",
        desc: "Interval week. Rower and air bike repeats at ninety percent, with splits recorded every round. The target is not a single fast piece — it's eight pieces within two seconds of each other. Pacing discipline is the entire job." },
      { name: "Week 3: Compromised Work", vid: "assets/wk-battlerope.mp4", poster: "assets/gen2-circuit.png",
        desc: "Strength under a heart rate. Rope waves, carries and pulls stacked directly onto engine pieces, teaching your body to lift well while breathing hard. This is the week the hybrid promise gets kept — quality movement in a compromised state." },
      { name: "Week 4: The Simulation", vid: "assets/wk-sled.mp4", poster: "assets/gen2-carry.png",
        desc: "Everything converges into a full mini-simulation: row, carry, push, repeat — then a re-test of the week-one 1000m benchmark. You should see seconds fall off the split with the same stroke you built in week one. Finish strong, then rest properly." },
    ],
    days: [
      { t: "Hybrid Strength + Row Power", min: 50, eq: "Kettlebells · Rower · Tube bands · Wall ball", img: "assets/gen2-row.png" },
      { t: "Race-Pace Intervals", min: 55, eq: "Rower · Tube bands", img: "assets/gen2-sprint.png" },
      { t: "Upper Strength + Compromised Work", min: 55, eq: "Barbell · Bench · Dumbbell", img: "assets/gen-bench.png" },
      { t: "Threshold + Skills", min: 50, eq: "Kettlebells · Rower · Tube bands", img: "assets/gen2-circuit.png" },
      { t: "Mini Simulation", min: 40, eq: "Kettlebells · Rower · Sandbag", img: "assets/gen2-carry.png" },
      { t: "Recovery and Mobility", min: 30, eq: "Bodyweight · Bands", img: "assets/gen2-mob.png", opt: true }],
  },
  furnace: {
    name: "Furnace Conditioning", tag: "CONDITIONING", weeks: 4, meta: "4 Weeks · Optional equipment",
    level: "All levels", cover: "assets/gen2-sprint.png",
    blurb: "Four weeks in the fire — short, hot conditioning blocks that end in a rematch against your own times.",
    types: ["circuits","hiit","engine","liss"],
    weekly: [
      { name: "Week 1: Light the Fire", vid: "assets/wk-thruster.mp4", poster: "assets/gen2-circuit.png",
        desc: "Benchmark circuits for time: thrusters, burpees, swings. Set honest times at an effort you could repeat — the second half of this program is a direct rematch against them. Note everything in the logbook; week four checks your work." },
      { name: "Week 2: Sprint Week", vid: "assets/gen2-sprint.mp4", poster: "assets/gen2-sprint.png",
        desc: "Track work. Short repeats at ninety percent effort with full walk-back recovery — quality of stride over quantity of meters. Tall posture, arms driving, every split within two seconds of your first. Speed is a skill; practice it like one." },
      { name: "Week 3: Hold the Heat", vid: "assets/wk-jumprope.mp4", poster: "assets/gen2-circuit.png",
        desc: "The same circuits return with tighter rest windows and a jump-rope engine layer between stations. Your heart rate stays higher for longer — the goal is composure, smooth breathing and clean reps while the clock squeezes you." },
      { name: "Week 4: The Rematch", vid: "assets/wk-wallball.mp4", poster: "assets/gen2-circuit.png",
        desc: "Week one's benchmarks, one more time, with everything you've built. Beat your times with the same standards — full reps, chest to the wall ball target, no shortcuts. Then close the program with an easy flush and take the win." },
    ],
    days: [
      { t: "Furnace circuits", min: 30, eq: "Dumbbells · Bodyweight", img: "assets/gen2-circuit.png" },
      { t: "Sprint intervals", min: 25, eq: "Track or treadmill", img: "assets/gen2-sprint.png" },
      { t: "SkiErg + row engine", min: 30, eq: "SkiErg · Rower", img: "assets/gen2-skierg.png" },
      { t: "LISS flush", min: 35, eq: "Optional cardio equipment", img: "assets/gen2-walk.png", opt: true }],
  },
  sharpen: {
    name: "Iron Sharpens Iron", tag: "STRENGTH", weeks: 4, meta: "4 Weeks · Barbell + a brother",
    level: "Intermediate", cover: "assets/gen2-partner.png",
    blurb: "Heavy compound work built to run with a training partner. You go, I go — nobody drifts.",
    types: ["heavypress","heavypull","legs","wod","mobility"],
    weekly: [
      { name: "Week 1: Two Men, One Standard", vid: "assets/wk-deadlift.mp4", poster: "assets/gen2-legs.png",
        desc: "Built to run with a brother. Heavy fives on the big three with a spotter you trust, and the first partner piece to set the tone. Agree on the standard together — depth, lockout, rest — and hold each other to it all four weeks." },
      { name: "Week 2: Strict Strength", vid: "assets/wk-pullup.mp4", poster: "assets/gen2-row.png",
        desc: "Strict week: weighted pull-ups, paused bench, dead-stop deadlifts. No bounce, no momentum, no help. Where week one found your loads, this week finds your honesty. The reps that count are the ones your brother verifies." },
      { name: "Week 3: Power Together", vid: "assets/wk-boxjump.mp4", poster: "assets/gen2-legs.png",
        desc: "Speed enters: box jumps, explosive pulls, and bar speed on the back-off sets. Push each other — the partner EMOM gets longer and louder this week. As iron sharpens iron, so one man sharpens another. Prov 27:17 is the training plan." },
      { name: "Week 4: Test Week", vid: "assets/wk-kbswing.mp4", poster: "assets/gen2-carry.png",
        desc: "Max-effort week, done properly: full warm-ups, long rests, a spotter on every heavy attempt, and new top sets on the board. You report your numbers to each other — then you both rest. Strength shared is strength doubled." },
    ],
    days: [
      { t: "Heavy press day", min: 45, eq: "Barbell · Bench · Spotter", img: "assets/gen-bench.png" },
      { t: "Heavy pull day", min: 45, eq: "Barbell · Cable · Chalk", img: "assets/gen2-row.png" },
      { t: "Squat & hinge", min: 50, eq: "Barbell · Rack · Blocks", img: "assets/gen2-legs.png" },
      { t: "Brotherhood WOD", min: 35, eq: "Partner · Dumbbells", img: "assets/gen2-partner.png" },
      { t: "Mobility & core", min: 15, eq: "Bodyweight", img: "assets/gen2-mob.png", opt: true }],
  },
  temple: {
    name: "Steward the Temple", tag: "RECOVERY", weeks: 4, meta: "4 Weeks · Bodyweight + bands",
    level: "All levels", cover: "assets/gen2-mob.png",
    blurb: "Mobility, breath and stillness — maintenance for the long haul between hard blocks.",
    types: ["mobility","corebreath","liss"],
    weekly: [
      { name: "Week 1: Open the Hips", vid: "assets/wk-mobility.mp4", poster: "assets/gen2-mob.png",
        desc: "The program opens where most men are tightest. Long-hold hip work, ankle prep and slow spinal waves — nothing forced, everything breathed through. Your body is not your own; it was bought at a price. This month is how you steward it." },
      { name: "Week 2: Build the Trunk", vid: "assets/wk-plank.mp4", poster: "assets/gen2-circuit.png",
        desc: "Quiet strength week: planks, side planks, bird dogs and dead bugs, held to a standard rather than a clock. The trunk you build here is what protects every barbell session you'll ever do. Slow is smooth; smooth is strong." },
      { name: "Week 3: Walk and Listen", vid: "assets/wk-incline.mp4", poster: "assets/gen2-walk.png",
        desc: "Zone-two week. Long incline walks with the audio devotional in your ears — training the aerobic base and the inner man in the same hour. If you can't hold a conversation, slow down. The pace is the point." },
      { name: "Week 4: Stillness Under Load", vid: "assets/wk-lunge.mp4", poster: "assets/gen2-mob.png",
        desc: "The closing week pairs loaded stretch work — walking lunges, deep goblet holds — with box breathing and five minutes of phone-away stillness. Psalm 46:10 is the finisher. Leave the block more mobile, more calm, and ready to load again." },
    ],
    days: [
      { t: "Mobility flow", min: 20, eq: "Mat · Bands", img: "assets/gen2-mob.png" },
      { t: "Core & breath", min: 25, eq: "Mat · Bodyweight", img: "assets/gen2-fast.png" },
      { t: "Long walk + audio devotional", min: 45, eq: "None", img: "assets/gen2-walk.png" }],
  },
};
const sessOf = (pid, di) => SESSIONS[(PROGRAMS[pid] || PROGRAMS.foundations).types[di] || "push"];
const weekOf = (p, wk) => p.weekly[Math.min(Math.max(wk, 1), p.weeks) - 1];

const dayCard = (pid, d, i) => `
  <a href="#/session/${pid}/${i + 1}" class="v-stagger tl-card relative block bg-iron border ${FMP.done(pid).includes(i + 1) ? "border-ember/50" : "border-whisper"} rounded-xl overflow-hidden hover:bg-forged">
    ${FMP.done(pid).includes(i + 1) ? '<span class="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-ember flex items-center justify-center" style="color:var(--c-furnace)"><span class="material-symbols-outlined" style="font-size:15px">check</span></span>' : ""}
    <div class="grid grid-cols-[136px_1fr] items-center">
      <div class="h-28 overflow-hidden"><img onerror="this.remove()" loading="lazy" decoding="async" src="${d.img}" alt="" class="ig-img"/></div>
      <div class="p-4">
        <div class="flex items-center justify-between">
          <p class="font-mono text-[11px] text-ash mb-1">DAY ${i + 1}</p>
          ${d.opt ? '<span class="font-mono text-[9px] tracking-widest text-ash border border-whisper rounded px-1.5 py-0.5">OPTIONAL</span>' : ""}
        </div>
        <p class="text-[15px] font-semibold leading-snug mb-1.5">${d.t}</p>
        <p class="font-mono text-xs text-ash"><span class="day-min" data-base="${d.min}">${d.min}</span> MIN | ${d.eq}</p>
      </div>
    </div>
  </a>`;
/* ---- Recipes (structure from the CENTR Meals reference) ---- */
const RECIPES = {
  "oat-slice": { name: "Cookie Baked Oat Slice", img: "assets/food-oatslice.png", type: "Breakfast",
    prep: 10, cook: 25, badges: ["DF","EF","GF","VE","V"], servings: 8,
    ing: ["1 spray olive oil","1 medium banana","1 1/2 tbs crunchy natural peanut butter","1/2 cup (4 fl oz) milk, reduced fat","1 tsp vanilla extract","1 1/2 cups (5 1/2 oz) rolled oats","2 tbs 70% dark chocolate chips","2 tbs unsalted peanuts, chopped"],
    method: ["Preheat oven to 350°F and spray a small oven-proof dish with oil.","Add banana to prepared dish and mash well.","Add peanut butter, milk and vanilla and mix well to combine.","Stir through oats and chocolate chips and spread mixture out evenly.","Scatter over peanuts and bake for 20–25 minutes until golden and firm.","Cool for 15 minutes before slicing into equal portions."],
    nutri: [["Energy","148 cals"],["Protein","5 g"],["Fat","6.8 g"],["Sat. Fat","1.9 g"],["Carbs","15.5 g"],["Sugar","4.1 g"],["Fiber","2.6 g"]] },
  "bacon-hash": { name: "Bacon, Corn & Kale Hash", img: "assets/food-hash.png", type: "Breakfast",
    prep: 7, cook: 10, badges: ["DF","GF","NS","NF"], servings: 2,
    ing: ["2 rashers bacon, chopped","1 cup corn kernels","2 cups kale, shredded","2 eggs","1 tbs olive oil","1/2 red onion, diced","Salt and cracked pepper"],
    method: ["Heat oil in a cast-iron skillet over medium heat and cook onion until soft.","Add bacon and cook until crisp at the edges.","Add corn and kale and toss until the kale wilts.","Make two wells and crack in the eggs; cover and cook to your liking.","Season and serve straight from the skillet."],
    nutri: [["Energy","382 cals"],["Protein","21 g"],["Fat","24 g"],["Sat. Fat","6.2 g"],["Carbs","19 g"],["Sugar","4.8 g"],["Fiber","4.4 g"]] },
  "salmon-bowl": { name: "Grilled Salmon & Quinoa Bowl", img: "assets/food-salmon.png", type: "Lunch",
    prep: 10, cook: 15, badges: ["DF","GF","NS"], servings: 2,
    ing: ["2 salmon fillets","1 cup quinoa, rinsed","2 cups mixed roasting vegetables","1 tbs olive oil","1 lemon","Salt and cracked pepper"],
    method: ["Cook quinoa per packet instructions and set aside.","Toss vegetables in half the oil and roast at 400°F for 15 minutes.","Rub salmon with remaining oil, season, and grill 3–4 minutes per side.","Build bowls: quinoa, vegetables, salmon. Finish with lemon."],
    nutri: [["Energy","520 cals"],["Protein","38 g"],["Fat","22 g"],["Sat. Fat","3.8 g"],["Carbs","41 g"],["Sugar","6.1 g"],["Fiber","7.2 g"]] },
  "steak-potato": { name: "Steak & Sweet Potato Plate", img: "assets/food-steak.png", type: "Dinner",
    prep: 10, cook: 20, badges: ["DF","GF","EF","NF"], servings: 2,
    ing: ["2 sirloin steaks (7 oz each)","2 medium sweet potatoes, wedged","2 cups leafy greens","1 tbs olive oil","1 tsp smoked paprika","Salt and cracked pepper"],
    method: ["Toss wedges in oil and paprika; roast at 425°F for 20 minutes.","Rest steaks at room temperature, then season generously.","Sear steaks in a hot pan 2–3 minutes per side; rest 5 minutes.","Slice against the grain and plate with wedges and greens."],
    nutri: [["Energy","565 cals"],["Protein","44 g"],["Fat","24 g"],["Sat. Fat","7.5 g"],["Carbs","39 g"],["Sugar","9.3 g"],["Fiber","6.8 g"]] },
  "yogurt-bowl": { name: "Greek Yogurt Power Bowl", img: "assets/food-yogurt.png", type: "Breakfast",
    prep: 5, cook: 0, badges: ["GF","NS","VE","V"], servings: 1,
    ing: ["1 cup Greek yogurt","1/2 cup blueberries","1 tbs almonds, chopped","1 tsp honey","1 tbs rolled oats, toasted"],
    method: ["Spoon yogurt into a bowl.","Top with blueberries, almonds and toasted oats.","Finish with a drizzle of honey."],
    nutri: [["Energy","310 cals"],["Protein","24 g"],["Fat","11 g"],["Sat. Fat","3.1 g"],["Carbs","28 g"],["Sugar","19 g"],["Fiber","3.4 g"]] },
  "protein-smoothie": { name: "Dark Chocolate Recovery Smoothie", img: "assets/food-smoothie.png", type: "Snack",
    prep: 5, cook: 0, badges: ["GF","VE","V"], servings: 1,
    ing: ["1 scoop chocolate protein","1 frozen banana","1 tbs cocoa powder","1 cup milk of choice","1 tsp peanut butter","4 ice cubes"],
    method: ["Add everything to a blender.","Blend until completely smooth.","Drink within 30 minutes of training."],
    nutri: [["Energy","342 cals"],["Protein","31 g"],["Fat","9.4 g"],["Sat. Fat","2.6 g"],["Carbs","33 g"],["Sugar","17 g"],["Fiber","5.1 g"]] },
  "eggs-avocado": { name: "Eggs & Avocado Sourdough", img: "assets/food-eggs.png", type: "Breakfast",
    prep: 5, cook: 8, badges: ["DF","NS","NF","VE"], servings: 1,
    ing: ["2 eggs","1/2 avocado, sliced","1 slice sourdough","1 tsp olive oil","Chili flakes, salt, pepper"],
    method: ["Toast the sourdough.","Soft-scramble the eggs in olive oil over low heat.","Layer avocado on toast, top with eggs, season to finish."],
    nutri: [["Energy","398 cals"],["Protein","18 g"],["Fat","24 g"],["Sat. Fat","5.2 g"],["Carbs","27 g"],["Sugar","2.4 g"],["Fiber","6.9 g"]] },
  "turkey-chili": { name: "Lean Turkey Chili", img: "assets/food-chili.png", type: "Dinner",
    prep: 10, cook: 35, badges: ["DF","GF","EF","NF"], servings: 4,
    ing: ["1 lb lean ground turkey","1 can kidney beans, drained","1 can crushed tomatoes","1 onion, diced","2 cloves garlic","1 tbs chili powder","1 tsp cumin","1 tbs olive oil"],
    method: ["Sweat onion and garlic in oil until fragrant.","Brown the turkey, breaking it up as it cooks.","Add spices, beans and tomatoes; simmer 30 minutes.","Season and serve topped with fresh herbs."],
    nutri: [["Energy","368 cals"],["Protein","34 g"],["Fat","12 g"],["Sat. Fat","2.9 g"],["Carbs","30 g"],["Sugar","8.6 g"],["Fiber","9.8 g"]] },
};
const rBadge = (b) => `<span class="w-6 h-6 rounded-full bg-forged flex items-center justify-center font-mono text-[8px] tracking-wide text-ash" title="${({DF:"Dairy free",EF:"Egg free",GF:"Gluten free",NS:"No added sugar",NF:"Nut free",VE:"Vegetarian",V:"Vegan"})[b]||b}">${b}</span>`;


/* ---- Session progress store: which days of each program are completed ---- */
const FMP = {
  key: "fm-progress",
  load() { try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { return {}; } },
  done(pid) { return this.load()[pid] || []; },
  mark(pid, d) {
    const s = this.load();
    s[pid] = [...new Set([...(s[pid] || []), d])].sort((a, b) => a - b);
    try { localStorage.setItem(this.key, JSON.stringify(s)); } catch (e) {}
  },
  next(pid) {
    const p = PROGRAMS[pid] || PROGRAMS.foundations;
    const dn = this.done(pid);
    for (let i = 1; i <= p.days.length; i++) if (!dn.includes(i)) return i;
    return 1;
  },
};

/* Flatten a session into an ordered, traceable exercise sequence */
const flatWorkout = (pid, di) => {
  const S = sessOf(pid, di);
  const steps = [];
  S.warm.items.forEach((e) => steps.push({ label: "WARM-UP", e, rest: null }));
  S.sets.forEach((g) => {
    for (let r = 1; r <= g.rounds; r++) {
      g.items.forEach((e, ix) => steps.push({
        label: g.rounds > 1 ? g.label + " - ROUND " + r + "/" + g.rounds : g.label,
        e,
        rest: ix === g.items.length - 1 && r < g.rounds && g.rest !== "—" ? g.rest : null,
      }));
    }
  });
  S.cool.items.forEach((e) => steps.push({ label: "COOL-DOWN", e, rest: null }));
  return steps;
};

const VIEWS = {

today: { title: "Today", phase2: false, html: () => {
  const pid = "foundations", p = PROGRAMS[pid];
  const nd = FMP.next(pid), d = p.days[nd - 1];
  const doneCount = FMP.done(pid).length;
  const med = { img: d.img, vid: (HEROVID && HEROVID[d.img]) || "" };
  return `
  <p class="v-stagger font-mono text-xs tracking-widest text-ash mb-1">TUESDAY · <span class="count" data-to="5">0</span>:42 AM</p>
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-8">Today</h2>
  <div class="grid grid-cols-[1.3fr_1fr] gap-8">
    <section class="v-stagger bg-iron border border-whisper rounded-xl p-7">
      <div class="flex items-center justify-between mb-3">
        <p class="font-mono text-xs tracking-widest text-ash">NEXT SESSION</p>
        <p class="font-mono text-[11px] text-ash">${doneCount}/${p.days.length} THIS WEEK</p>
      </div>
      <h3 class="text-xl font-semibold tracking-tight mb-1">${p.name}</h3>
      <p class="text-ash text-sm mb-6">Week ${p.week} · Day ${nd} · ${d.t} · <span class="font-mono">${d.min} MIN</span></p>
      <a href="#/session/${pid}/${nd}" class="player block rounded-xl h-40 border border-whisper mb-6">
        ${med.vid ? `<video src="${med.vid}" poster="${med.img}" autoplay loop muted playsinline class="ig-img"></video>`
                  : `<img src="${med.img}" alt="${d.t}" class="kenburns ig-img"/>`}
        <span class="dur-chip">DAY ${nd} · ${d.min} MIN</span>
      </a>
      <div class="flex items-center gap-3">
        <a href="#/workout/${pid}/${nd}" class="press inline-block bg-ember text-furnace rounded-lg px-8 py-3.5 text-sm font-semibold">Start Session</a>
        <a href="#/session/${pid}/${nd}" class="press inline-block border border-whisper rounded-lg px-5 py-3.5 text-sm hover:bg-forged">View plan</a>
      </div>
      <div class="flex gap-1.5 mt-6">
        ${p.days.map((_, i) => `<span class="h-1 flex-1 rounded ${FMP.done(pid).includes(i + 1) ? "bg-ember" : "bg-forged"}" title="Day ${i + 1}"></span>`).join("")}
      </div>
    </section>
    <section class="v-stagger">
      <div class="flex items-baseline justify-between mb-4">
        <p class="font-mono text-xs tracking-widest text-ash">THE DAILY SIX</p>
        <p class="font-mono text-xs text-ash"><span id="habit-done">3</span>/6</p>
      </div>
      <div class="grid grid-cols-3 gap-3 mb-5" id="habit-grid">
        ${HABITS.map(([ic,label,done],i)=>`
        <button class="habit-tile ${done?"done":""} bg-iron border-2 border-transparent rounded-xl p-4 text-left" data-i="${i}" ${label==="Training"?'title="Auto-completes with your session"':""}>
          <div class="flex justify-between items-start mb-3">${ICON(ic,"h-ic text-ash")}${ICON("check","h-check text-ember")}</div>
          <p class="text-xs">${label}</p>
        </button>`).join("")}
      </div>
      <div class="flex items-center gap-2 text-sm">
        ${ICON("local_fire_department","text-ember")}<span class="font-mono"><span class="count" data-to="23">0</span>-day streak</span>
        <span class="text-ash text-xs ml-2">Training checks itself when the session ends.</span>
      </div>
    </section>
  </div>
  <div class="grid grid-cols-3 gap-4 mt-8">
    ${ring(87,"CONSISTENCY","87","%")}
    ${ring(64,"WEEK VOLUME","12,480","LB")}
    ${ring(75,"SESSIONS","34","TOTAL")}
  </div>`; },
},

programs: { title: "Programs", phase2: false, html: () => {
  const card = (id, p) => `
    <a href="#/program/${id}" class="v-stagger block bg-iron border border-whisper rounded-xl overflow-hidden hover:bg-forged">
      <div class="h-40 overflow-hidden"><img src="${p.cover}" alt="${p.name}" class="ig-img"/></div>
      <div class="p-5">
        <div class="flex gap-2 mb-2.5">
          <span class="font-mono text-[9px] tracking-widest text-ash bg-forged rounded px-2 py-1">${p.tag}</span>
          <span class="font-mono text-[9px] tracking-widest text-ash bg-forged rounded px-2 py-1">SELF-GUIDED</span>
        </div>
        <p class="text-[15px] font-semibold mb-1.5">${p.name}</p>
        <p class="text-xs text-ash leading-relaxed mb-3">${p.blurb}</p>
        <p class="font-mono text-[11px] tracking-widest text-ash">${p.weeks} WEEKS • ${p.meta.split("· ")[1].toUpperCase()}</p>
      </div>
    </a>`;
  const section = (label, sub, ids, cols) => `
    <section class="mb-12">
      <h3 class="v-stagger text-xl font-semibold tracking-tight mb-1">${label}</h3>
      <p class="v-stagger text-sm text-ash mb-5">${sub}</p>
      <div class="grid grid-cols-${cols} gap-5 rgrid">${ids.map((id) => card(id, PROGRAMS[id])).join("")}</div>
    </section>`;
  const fp = PROGRAMS.protocol;
  return `
  <div class="max-w-4xl mx-auto">
    <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-10 text-center">Programs</h2>

    <section class="mb-12">
      <h3 class="v-stagger text-xl font-semibold tracking-tight mb-5">In Progress</h3>
      ${(() => { const fp = PROGRAMS.foundations, nx = FMP.next("foundations"), nd = fp.days[nx - 1];
        const total = fp.weeks * fp.days.length, cur = Math.min(total, (fp.done || 0) + FMP.done("foundations").length);
        return `
      <a href="#/program/foundations" class="v-stagger block bg-iron border border-ember/40 rounded-xl overflow-hidden hover:bg-forged max-w-xl">
        <div class="grid grid-cols-[110px_1fr] items-center">
          <div class="h-24 overflow-hidden"><img src="${nd.img}" alt="${fp.name}" class="ig-img"/></div>
          <div class="px-5 py-3.5">
            <p class="text-[15px] font-semibold">${fp.name}</p>
            <p class="text-xs text-ash mt-0.5 mb-2">Next: <span class="text-bone">Day ${nx} · ${nd.t}</span> · ${nd.min} min</p>
            <div class="flex items-center gap-3">
              <span class="font-mono text-[11px]">${cur}/${total}</span>
              <div class="flex-1 h-1 rounded bg-forged"><div class="bar-fill h-1 rounded" data-w="${Math.round(cur / total * 100)}%"></div></div>
            </div>
          </div>
        </div>
      </a>`; })()}
    </section>

    <section class="mb-12">
      <h3 class="v-stagger text-xl font-semibold tracking-tight mb-5">Recommended for You</h3>
      <a href="#/program/protocol" class="v-stagger block bg-iron border border-whisper rounded-xl overflow-hidden hover:bg-forged">
        <div class="grid grid-cols-[1fr_1fr] rgrid items-stretch">
          <div class="min-h-[220px] overflow-hidden"><img src="${fp.cover}" alt="${fp.name}" class="ig-img"/></div>
          <div class="p-7 flex flex-col justify-between">
            <div>
              <h4 class="text-2xl font-semibold tracking-tight mb-3">${fp.name}</h4>
              <div class="flex gap-2 mb-4">
                <span class="font-mono text-[9px] tracking-widest text-ash bg-forged rounded px-2 py-1">${fp.tag}</span>
                <span class="font-mono text-[9px] tracking-widest text-ash bg-forged rounded px-2 py-1">SELF-GUIDED</span>
              </div>
              <p class="text-sm text-ash leading-relaxed">${fp.blurb}</p>
            </div>
            <p class="font-mono text-[11px] tracking-widest text-ash mt-6">${fp.weeks} WEEKS • ROWER + KETTLEBELLS</p>
          </div>
        </div>
      </a>
    </section>

    ${section("Strength", "Build the base, then sharpen it with a brother.", ["foundations", "sharpen"], 2)}
    ${section("Conditioning & Hybrid", "Strength. Cardio. Speed. Endurance.", ["protocol", "furnace"], 2)}
    ${section("Recovery", "Maintenance for the long haul.", ["temple"], 2)}
  </div>`;
},
},

program: {
  title: (id) => (PROGRAMS[id] || PROGRAMS.foundations).name,
  phase2: false,
  html: (id) => {
    const p = PROGRAMS[id] || PROGRAMS.foundations; const wk = p.week || 1;
    const w = weekOf(p, wk);
    const total = p.weeks * p.days.length;
    const done = Math.min(total, (p.done || 0) + FMP.done(id).length);
    const nx = FMP.next(id); const nd = p.days[nx - 1];
    return `
  <div class="max-w-2xl mx-auto">
    <div class="v-stagger flex items-center gap-3 mb-6">
      <a href="#/programs" class="press w-9 h-9 rounded-full bg-iron border border-whisper flex items-center justify-center text-ash hover:text-bone">${ICON("arrow_back")}</a>
      <p class="font-mono text-xs tracking-[0.2em] text-ash mx-auto text-center flex-1">${p.name.toUpperCase()}</p>
      <button class="press w-9 h-9 rounded-full bg-iron border border-whisper flex items-center justify-center text-ash hover:text-bone">${ICON("more_vert")}</button>
    </div>

    <div class="v-stagger relative rounded-xl overflow-hidden border border-whisper mb-6 h-64">
      <img src="${p.cover}" alt="${p.name}" class="ig-img"/>
      <div class="absolute inset-0" style="background:linear-gradient(180deg,transparent 30%,rgba(12,12,14,.88) 100%)"></div>
      <div class="absolute left-6 bottom-5">
        <p class="font-mono text-[10px] tracking-widest text-[#c9c6c0] mb-1.5">PROGRAM</p>
        <h2 class="text-3xl font-bold tracking-tight uppercase text-[#f4f2ee]">${p.name}</h2>
      </div>
    </div>

    <div class="v-stagger flex items-center gap-4 py-3 border-b border-whisper mb-6">
      <span class="font-mono text-[11px] tracking-widest text-ash">PROGRESS</span>
      <div class="flex-1 h-1 rounded bg-forged"><div class="bar-fill h-1 rounded" data-w="${Math.round(done / total * 100)}%"></div></div>
      <span class="font-mono text-sm">${done}/${total}</span>
    </div>

    <p class="v-stagger font-mono text-xs tracking-widest text-ash mb-3">UP NEXT</p>
    <a href="#/session/${id}/${nx}" class="v-stagger block bg-iron border border-whisper rounded-xl overflow-hidden mb-8 hover:bg-forged">
      <div class="grid grid-cols-[112px_1fr] items-center">
        <div class="h-24 overflow-hidden"><img src="${nd.img}" alt="" class="ig-img"/></div>
        <div class="px-5 py-4">
          <p class="font-mono text-[11px] text-ash mb-1">WEEK ${wk} · DAY ${nx}</p>
          <p class="text-[15px] font-semibold mb-1">${nd.t}</p>
          <p class="font-mono text-xs text-ash">${nd.min} MIN | ${nd.eq}</p>
        </div>
      </div>
    </a>

    <div class="v-stagger flex items-center justify-center gap-3 mb-8 border-b border-whisper pb-0 overflow-x-auto" id="week-tabs">
      ${Array.from({ length: p.weeks }, (_, i) => `
        <button class="wk-tab shrink-0 flex flex-col items-center gap-2 pb-3 ${i + 1 === wk ? "active" : ""}" data-w="${i + 1}">
          <span class="w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm border ${i + 1 === wk ? "border-ember text-ember" : "border-whisper text-ash"}">${i + 1}</span>
          <span class="h-0.5 w-9 rounded ${i + 1 === wk ? "bg-ember" : "bg-transparent"}"></span>
        </button>`).join("")}
    </div>

    <h3 class="v-stagger text-lg font-semibold tracking-tight mb-3" id="wk-name">${w.name}</h3>
    <div class="v-stagger player rounded-xl h-56 border border-whisper mb-4" id="wk-player">
      <video id="wk-video" src="${w.vid}" poster="${w.poster}" autoplay loop muted playsinline aria-label="${w.name} focus video" class="ig-img"></video>
      <span class="dur-chip">WEEK ${wk} FOCUS · 0:05</span>
    </div>
    <p class="v-stagger text-sm text-ash leading-relaxed mb-8" id="wk-desc">${w.desc}</p>

    <div class="grid grid-cols-[28px_1fr] gap-4" id="timeline">
      <div class="relative">
        <div class="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-px" style="background:var(--c-whisper)"></div>
        ${p.days.map((_, i) => `<span class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-furnace" style="top:${i * 128 + 48}px;border-color:var(--c-whisper)"></span>`).join("")}
      </div>
      <div class="space-y-4">${p.days.map((d, i) => dayCard(id, d, i)).join("")}</div>
    </div>
  </div>`; },
},

session: {
  title: (param) => { const [id] = (param || "foundations/1").split("/"); return (PROGRAMS[id] || PROGRAMS.foundations).name + " — Session"; },
  phase2: false,
  html: (param) => {
    const [id, dn] = (param || "foundations/1").split("/");
    const p = PROGRAMS[id] || PROGRAMS.foundations;
    const di = Math.min(Math.max(parseInt(dn || "1") - 1, 0), p.days.length - 1);
    const d = p.days[di]; const wk = p.week || 1;
    const S = sessOf(id, di);
    const ex = (e) => {
      const med = exMedia(e.n, e.k);
      return `
      <div class="ex-row border-b" style="border-color:var(--c-whisper)">
        <div class="flex items-center gap-4 py-3 px-1 cursor-pointer">
          <div class="relative w-20 rounded-lg overflow-hidden bg-forged flex items-center justify-center shrink-0" style="height:52px">
            <img onerror="this.remove()" loading="lazy" decoding="async" src="${med.img}" alt="${e.n}" class="ig-img"/>
            <span class="absolute inset-0 flex items-center justify-center" style="background:rgba(12,12,14,.25)">${ICON("play_arrow","text-white")}</span>
          </div>
          <div class="flex-1"><p class="text-sm leading-snug">${e.n}</p><p class="font-mono text-sm font-semibold mt-0.5">${e.v}</p></div>
          ${ICON("expand_more", "text-ash ex-chev")}
        </div>
        <div class="ex-tip hidden pb-4 pl-24 pr-6">
          <div class="player rounded-lg h-36 border border-whisper mb-3">
            ${med.vid
              ? `<video src="${med.vid}" poster="${med.img}" loop muted playsinline preload="none" aria-label="${e.n} form video" class="ig-img"></video>`
              : `<img onerror="this.remove()" loading="lazy" decoding="async" src="${med.img}" alt="${e.n} form video" class="kenburns"/><div class="play-badge"><span>${ICON("play_arrow")}</span></div>`}
            <span class="dur-chip">0:05 · FORM VIDEO</span>
          </div>
          <p class="text-xs text-ash leading-relaxed">${CUES[e.k]}</p>
        </div>
      </div>`;
    };
    const rest = (t) => t && t !== "—" ? `<p class="py-3 text-center font-mono text-xs tracking-widest text-ash border-b" style="border-color:var(--c-whisper)">REST • ${t}</p>` : "";
    const eyebrow = (l) => `<p class="font-mono text-xs tracking-widest font-semibold border-b pb-2 mb-1" style="border-color:var(--c-whisper)">${l}</p>`;
    const setGroup = (g) => {
      let out = "";
      if (g.rounds > 1) {
        for (let r = 1; r <= g.rounds; r++) {
          const many = g.rounds > 3;
          if (many && r === 2) { out += `<p class="py-3 text-center font-mono text-xs tracking-widest text-ash">REPEAT ROUNDS 2–${g.rounds} · REST • ${g.rest} BETWEEN</p>`; break; }
          out += `
          <h3 class="v-stagger text-lg font-semibold tracking-tight mt-8 mb-2">${g.head}: Round ${r} of ${g.rounds}</h3>
          ${r === 1 ? `<p class="v-stagger text-sm text-ash leading-relaxed mb-4">${g.desc}</p>` : ""}
          ${eyebrow(g.label + " - ROUND " + r)}
          ${g.items.map(ex).join("")}
          ${r < g.rounds ? rest(g.rest) : ""}`;
        }
      } else {
        out += `
        <h3 class="v-stagger text-lg font-semibold tracking-tight mt-8 mb-2">${g.head}</h3>
        <p class="v-stagger text-sm text-ash leading-relaxed mb-4">${g.desc}</p>
        ${eyebrow(g.label)}
        ${g.items.map(ex).join("")}
        ${rest(g.rest)}`;
      }
      return out;
    };
    return `
  <div class="v-stagger flex items-center gap-3 mb-6">
    <a href="#/program/${id}" class="press w-9 h-9 rounded-full bg-iron border border-whisper flex items-center justify-center text-ash hover:text-bone">${ICON("arrow_back")}</a>
    <p class="font-mono text-xs tracking-[0.2em] text-ash mx-auto pr-9 text-center flex-1">SELF-GUIDED</p>
  </div>
  <div class="max-w-2xl pb-24">
    <div class="v-stagger player rounded-xl h-64 border border-whisper mb-6">
      ${HEROVID[d.img]
        ? `<video src="${HEROVID[d.img]}" poster="${d.img}" autoplay loop muted playsinline class="ig-img"></video>`
        : `<img onerror="this.remove()" loading="lazy" decoding="async" src="${d.img}" alt="${d.t}" class="kenburns"/><div class="play-badge"><span>${ICON("play_arrow")}</span></div>`}
      <span class="absolute left-3 bottom-3 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-bone rounded px-2 py-1" style="background:rgba(12,12,14,.72)">${ICON("directions_run")}SELF-GUIDED</span>
      <span class="dur-chip">${d.min}:00 · SESSION PREVIEW</span>
    </div>
    <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-1">${d.t}</h2>
    <p class="v-stagger text-ash text-sm mb-5">${p.name}: Week ${wk}, Day ${di + 1}</p>
    <p class="v-stagger text-sm leading-relaxed mb-8">${S.intro}</p>
    <section class="v-stagger bg-iron border border-whisper rounded-xl px-5 py-2 mb-5">
      ${[["monitoring", "Level", p.level], ["schedule", "Time", d.min + " min"], ["target", "Target", S.target], ["exercise", "Equipment", d.eq.replaceAll(" · ", " • ")]]
        .map(([ic, k, v]) => `
      <div class="flex items-center gap-4 py-3.5 border-b last:border-0" style="border-color:var(--c-whisper)">
        <span class="w-8 h-8 rounded-lg bg-forged flex items-center justify-center">${ICON(ic, "text-ember")}</span>
        <span class="text-sm font-semibold w-28">${k}</span>
        <span class="text-sm text-ash">${v}</span>
      </div>`).join("")}
    </section>
    <a href="#/logbook/${id}/${di + 1}" class="v-stagger press flex items-center justify-center gap-2 border border-whisper rounded-xl py-3.5 text-sm font-semibold tracking-wide mb-10 hover:bg-forged">${ICON("assignment")}REVIEW LOGBOOK</a>

    <h3 class="v-stagger text-lg font-semibold tracking-tight mb-2">Warmup</h3>
    <p class="v-stagger text-sm text-ash leading-relaxed mb-4">${S.warm.intro}</p>
    ${eyebrow("WARMUP")}
    ${S.warm.items.map(ex).join("")}
    ${S.sets.map(setGroup).join("")}
    <h3 class="v-stagger text-lg font-semibold tracking-tight mt-8 mb-2">Cooldown</h3>
    <p class="v-stagger text-sm text-ash leading-relaxed mb-4">${S.cool.intro}</p>
    ${eyebrow("COOLDOWN")}
    ${S.cool.items.map(ex).join("")}
  </div>
  <div class="fixed bottom-6 left-64 right-0 flex justify-center pointer-events-none z-40">
    <a href="#/workout/${id}/${di + 1}" class="press pointer-events-auto bg-ember rounded-full px-10 py-4 text-sm font-bold tracking-widest shadow-xl" style="color:var(--c-furnace)">START SELF-GUIDED WORKOUT</a>
  </div>`; },
},

logbook: {
  title: (param) => { const [id] = (param || "foundations/1").split("/"); return (PROGRAMS[id] || PROGRAMS.foundations).name + " — Logbook"; },
  phase2: false,
  html: (param) => {
    const [id, dn] = (param || "foundations/1").split("/");
    const p = PROGRAMS[id] || PROGRAMS.foundations;
    const di = Math.min(Math.max(parseInt(dn || "1") - 1, 0), p.days.length - 1);
    const S = sessOf(id, di);
    const row = (n) => `
      <div class="flex items-center justify-between bg-iron border border-whisper rounded-xl px-5 py-4 mb-3">
        <div><p class="font-mono text-xs tracking-widest font-semibold mb-1">${n.toUpperCase()}</p>
        <p class="text-sm text-ash">No logs recorded</p></div>${ICON("chevron_right", "text-ash")}
      </div>`;
    const group = (label, names) => `
      <div class="v-stagger mb-8">
        <div class="flex items-center justify-between mb-3"><p class="text-lg font-semibold">${label}</p>${ICON("expand_less", "text-ash")}</div>
        ${names.map(row).join("")}
      </div>`;
    const groups = [];
    groups.push(group("Warm-up", S.warm.items.map((e) => e.n)));
    S.sets.forEach((g) => {
      const names = [];
      for (let r = 0; r < Math.min(g.rounds, 3); r++) g.items.forEach((e) => names.push(e.n));
      groups.push(group(g.head, names));
    });
    groups.push(group("Cool-down", S.cool.items.map((e) => e.n)));
    return `
  <div class="v-stagger flex items-center gap-3 mb-6">
    <a href="#/session/${id}/${di + 1}" class="press w-9 h-9 rounded-full bg-iron border border-whisper flex items-center justify-center text-ash hover:text-bone">${ICON("close")}</a>
    <p class="font-mono text-xs tracking-[0.2em] text-ash mx-auto pr-9 text-center flex-1">REVIEW LOGBOOK</p>
  </div>
  <div class="max-w-2xl">
    <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-1">${p.days[di].t}</h2>
    <p class="v-stagger text-ash text-sm mb-10">${p.name}: Week ${p.week || 1}, Day ${di + 1}</p>
    ${groups.join("")}
  </div>`; },
},

workout: {
  title: (param) => {
    const [id, dn] = (param || "foundations/1").split("/");
    const p = PROGRAMS[id] || PROGRAMS.foundations;
    const di = Math.min(Math.max(parseInt(dn || FMP.next(id)) - 1, 0), p.days.length - 1);
    return p.days[di].t + " — Week " + (p.week || 1) + ", Day " + (di + 1);
  },
  phase2: false,
  html: (param) => {
    const [id, dn] = (param || "foundations/" + FMP.next("foundations")).split("/");
    const p = PROGRAMS[id] || PROGRAMS.foundations;
    const di = Math.min(Math.max(parseInt(dn || FMP.next(id)) - 1, 0), p.days.length - 1);
    const d = p.days[di];
    const steps = flatWorkout(id, di);
    return `
  <div class="max-w-2xl mx-auto" id="wo-root" data-pid="${id}" data-day="${di + 1}">
    <div class="v-stagger flex items-center gap-3 mb-5">
      <a href="#/session/${id}/${di + 1}" class="press w-9 h-9 rounded-full bg-iron border border-whisper flex items-center justify-center text-ash hover:text-bone">${ICON("arrow_back")}</a>
      <div class="mx-auto text-center flex-1">
        <p class="font-mono text-xs tracking-[0.2em] text-ash">GUIDED WORKOUT</p>
        <p class="text-xs text-ash mt-0.5">${p.name} · Week ${p.week || 1}, Day ${di + 1} · ${d.t}</p>
      </div>
      <span class="w-9"></span>
    </div>

    <div class="v-stagger flex items-center gap-4 mb-6">
      <div class="flex-1 h-1 rounded bg-forged"><div id="wo-bar" class="h-1 rounded bg-ember" style="width:0%"></div></div>
      <span class="font-mono text-xs text-ash" id="wo-count">EXERCISE 1 OF ${steps.length}</span>
    </div>

    <div id="wo-live">
      <p class="v-stagger font-mono text-xs tracking-widest text-ember mb-3" id="wo-block"></p>
      <div class="v-stagger player rounded-xl h-64 border border-whisper mb-5" id="wo-player"></div>
      <div class="v-stagger flex items-baseline justify-between mb-1.5">
        <h2 class="text-2xl font-semibold tracking-tight" id="wo-name"></h2>
        <span class="font-mono text-lg" id="wo-val"></span>
      </div>
      <p class="v-stagger text-sm text-ash leading-relaxed mb-6" id="wo-cue"></p>

      <div id="wo-sets" class="mb-6 hidden">
        <div class="grid grid-cols-[48px_1fr_1fr_48px] gap-3 font-mono text-[11px] tracking-widest text-ash px-1 mb-2">
          <span>SET</span><span>LB</span><span>REPS</span><span></span>
        </div>
        <div id="wo-set-rows" class="space-y-2"></div>
      </div>

      <div class="flex items-center gap-3">
        <button id="wo-prev" class="press border border-whisper rounded-lg px-5 py-3.5 text-sm hover:bg-forged">Previous</button>
        <button id="wo-next" class="press flex-1 bg-ember text-furnace rounded-lg px-8 py-3.5 text-sm font-semibold">Complete exercise</button>
      </div>
      <p class="text-xs text-ash mt-4">Finishing the last exercise completes the session and checks the Training habit.</p>
    </div>

    <div id="wo-done" class="hidden text-center py-14">
      <span class="material-symbols-outlined text-ember" style="font-size:56px">task_alt</span>
      <h2 class="text-3xl font-semibold tracking-tight mt-4 mb-2">Session complete</h2>
      <p class="text-ash text-sm mb-2">${d.t} · Week ${p.week || 1}, Day ${di + 1} logged.</p>
      <p class="font-mono text-sm text-ember mb-8">TRAINING HABIT ✓ · STREAK +1</p>
      <div class="flex items-center justify-center gap-3" id="wo-done-nav"></div>
    </div>

    <div id="wo-rest" class="hidden fixed bottom-0 left-64 right-0 bg-iron border-t border-whisper p-8 z-50">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div><p class="font-mono text-xs tracking-widest text-ash mb-1">REST</p>
          <p class="font-mono text-5xl" id="wo-rest-time">1:00</p></div>
        <button id="wo-rest-skip" class="press border border-whisper rounded-lg px-6 py-3 text-sm hover:bg-forged">Skip rest</button>
      </div>
    </div>
  </div>`; },
},

progress: { title: "Progress", phase2: false, html: `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-8">Progress</h2>
  <div class="grid grid-cols-3 gap-4 mb-10">
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5"><p class="font-mono text-xs tracking-widest text-ash mb-2">CONSISTENCY</p><p class="font-mono text-3xl"><span class="count" data-to="87">0</span>%</p></div>
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5"><p class="font-mono text-xs tracking-widest text-ash mb-2">SESSIONS</p><p class="font-mono text-3xl"><span class="count" data-to="34">0</span></p></div>
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5"><p class="font-mono text-xs tracking-widest text-ash mb-2">STREAK</p><p class="font-mono text-3xl"><span class="count" data-to="23">0</span> <span class="text-sm text-ash">DAYS</span></p></div>
  </div>
  <section class="v-stagger bg-iron border border-whisper rounded-xl p-6 mb-10">
    <p class="font-mono text-xs tracking-widest text-ash mb-5">WEEKLY VOLUME · LB</p>
    <div class="flex items-end gap-3 h-40" id="vol-chart">
      ${[8200,9400,8800,10600,11200,10400,12480].map((v,i)=>`
        <div class="flex-1 flex flex-col items-center gap-2">
          <div class="vol-bar w-full rounded-t bg-ember/80" style="height:0" data-h="${Math.round(v/12480*100)}"></div>
          <span class="font-mono text-[10px] text-ash">W${i+1}</span>
        </div>`).join("")}
    </div>
  </section>
  <div class="grid grid-cols-2 gap-8">
    <section class="v-stagger">
      <p class="font-mono text-xs tracking-widest text-ash mb-3">PERSONAL RECORDS</p>
      <div class="divide-y" style="border-color:var(--c-whisper)">
        ${[["Squat","245 LB","AUG 4"],["Bench Press","205 LB","JUL 28"],["Deadlift","315 LB","JUL 19"]]
          .map(([n,w,d])=>`<div class="flex items-center justify-between py-3.5">
            <span class="text-sm">${n}</span>
            <span class="font-mono text-sm">${w} <span class="text-ember">▲</span> <span class="text-ash text-xs ml-2">${d}</span></span></div>`).join("")}
      </div>
    </section>
    <section class="v-stagger bg-iron border border-whisper rounded-xl p-6">
      <p class="font-mono text-xs tracking-widest text-ash mb-2">WEEKLY REVIEW</p>
      <p class="text-sm mb-1">3 of 5 fields pre-filled from your logs.</p>
      <p class="text-ash text-xs mb-5">Your coach reads every review before Monday's call.</p>
      <a href="#/review" class="press inline-block border border-whisper rounded-lg px-5 py-2.5 text-sm hover:bg-forged">Complete review</a>
    </section>
  </div>`,
},

photos: { title: "Progress Photos", phase2: false, html: `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-2">Progress Photos</h2>
  <p class="v-stagger flex items-center gap-2 text-ash text-sm mb-10">${ICON("lock","text-ember")} Private — visible only to you and your coach. Encrypted at rest.</p>
  <div class="grid grid-cols-4 gap-5">
    ${[["AUG 10","WEEK 18","assets/gen2-progress-4.png"],["JUL 13","WEEK 14","assets/gen2-progress-3.png"],
       ["JUN 8","WEEK 9","assets/gen2-progress-2.png"],["APR 6","WEEK 1","assets/gen2-progress-1.png"]].map(([d,w,img])=>`
      <figure class="v-stagger">
        <div class="aspect-[3/4] rounded-xl bg-iron border border-whisper overflow-hidden relative">
          <img src="${img}" alt="Progress photo ${w}" class="ig-img" loading="lazy" decoding="async" onerror="this.remove()"/>
          <span class="absolute left-2.5 bottom-2.5 font-mono text-[10px] tracking-widest text-bone rounded px-2 py-1" style="background:rgba(12,12,14,.72)">${w}</span>
        </div>
        <figcaption class="font-mono text-xs text-ash mt-2">${d}</figcaption>
      </figure>`).join("")}
  </div>
  <div class="v-stagger mt-8 bg-iron border border-whisper rounded-xl p-5 max-w-xl">
    <p class="font-mono text-xs tracking-widest text-ash mb-2">COACH'S NOTE · WEEK 18</p>
    <p class="text-sm leading-relaxed">Same lighting, same stance, eighteen weeks apart. The scale said −9 lb; the photos say more. Keep the Sunday photo habit.</p>
  </div>
  <button class="v-stagger press mt-8 border border-whisper rounded-lg px-6 py-3 text-sm hover:bg-forged">Add photo</button>`,
},

review: { title: "Weekly Review — Week 3", phase2: false, html: `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-1">Weekly Review</h2>
  <p class="v-stagger font-mono text-xs text-ash mb-8">WEEK 3 · 3 OF 5 FIELDS PRE-FILLED FROM YOUR LOGS</p>
  <div class="max-w-2xl space-y-4">
    ${[["Training","4 of 4 sessions completed · 12,480 lb total volume"],
       ["Daily Six","38 of 42 habit checks · longest streak 23 days"],
       ["Body","Weight logged 3× · trend −1.2 lb"]].map(([t,v])=>`
    <section class="v-stagger bg-iron border border-whisper rounded-xl p-5 flex items-start justify-between">
      <div><p class="text-sm font-medium mb-1">${t}</p><p class="font-mono text-sm text-ash">${v}</p></div>
      <span class="flex items-center gap-2 font-mono text-[10px] tracking-widest text-ember">${ICON("check_circle")}PRE-FILLED</span>
    </section>`).join("")}
    <section class="v-stagger bg-iron border border-whisper rounded-xl p-5">
      <label class="block text-sm font-medium mb-2" for="wins">Wins this week</label>
      <textarea id="wins" rows="3" class="w-full bg-forged border border-whisper rounded-lg px-4 py-3 text-sm focus:border-ember focus:ring-0" placeholder="What moved forward?"></textarea>
    </section>
    <section class="v-stagger bg-iron border border-whisper rounded-xl p-5">
      <label class="block text-sm font-medium mb-2" for="struggle">Where I struggled</label>
      <textarea id="struggle" rows="3" class="w-full bg-forged border border-whisper rounded-lg px-4 py-3 text-sm focus:border-ember focus:ring-0" placeholder="Name it plainly."></textarea>
    </section>
    <button class="v-stagger press w-full bg-ember text-furnace rounded-lg py-3.5 text-sm font-semibold">Submit Review</button>
    <p class="v-stagger text-ash text-xs text-center">Your coach reads every review before Monday's call.</p>
  </div>`,
},

account: { title: "Subscription", phase2: false, html: `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-8">Subscription</h2>
  <div class="grid grid-cols-2 gap-5 max-w-3xl mb-8">
    <section class="v-stagger bg-iron border-2 border-ember/60 rounded-xl p-6 relative">
      <span class="absolute top-4 right-4 font-mono text-[10px] tracking-widest text-ember">CURRENT PLAN</span>
      <p class="text-sm font-medium mb-1">Essential</p>
      <p class="font-mono text-3xl mb-4">$97<span class="text-sm text-ash">/MO</span></p>
      <ul class="text-sm text-ash space-y-2">
        <li>Assigned programs and logging</li><li>The Daily Six with streaks</li>
        <li>Progress and private photos</li><li>Weekly review</li></ul>
    </section>
    <section class="v-stagger bg-iron border border-whisper rounded-xl p-6">
      <p class="text-sm font-medium mb-1">Elite</p>
      <p class="font-mono text-3xl mb-4">$147<span class="text-sm text-ash">/MO</span></p>
      <ul class="text-sm text-ash space-y-2">
        <li>Everything in Essential</li><li>Monthly 1:1 video call</li>
        <li>Priority coach messaging</li><li>Partner network sessions included <span class="font-mono text-[10px] text-ember">PHASE 2</span></li></ul>
      <button class="press mt-5 w-full bg-ember text-furnace rounded-lg py-3 text-sm font-semibold">Upgrade to Elite</button>
    </section>
  </div>
  <div class="v-stagger max-w-3xl flex items-center justify-between border border-whisper rounded-xl px-6 py-4">
    <p class="text-sm text-ash">Next renewal <span class="font-mono text-bone">SEP 1, 2026</span> · Visa ·· <span class="font-mono">4242</span></p>
    <div class="flex gap-3">
      <button class="press border border-whisper rounded-lg px-4 py-2 text-sm hover:bg-forged">Pause</button>
      <button class="press border border-whisper rounded-lg px-4 py-2 text-sm hover:bg-forged">Update payment</button>
    </div>
  </div>
  <p class="v-stagger font-mono text-[11px] text-ash mt-6">BILLED ON THE WEB VIA STRIPE · NO APP-STORE COMMISSION</p>`,
},

community: { title: "Community & Prayer Wall", phase2: true, html: `
  <div class="grid grid-cols-[1.5fr_1fr] gap-8">
    <section>
      <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-8">Community</h2>
      <article class="v-stagger bg-iron border border-ember/30 rounded-xl overflow-hidden mb-4">
        <div class="flex items-center gap-3 p-5 pb-3">
          <img onerror="this.remove()" loading="lazy" decoding="async" src="assets/coach-profile.jpg" alt="Coach Cayman" class="w-9 h-9 rounded-full object-cover border border-ember/40"/>
          <p class="text-sm font-medium">Coach Cayman <span class="font-mono text-[10px] tracking-widest text-ember border border-ember/40 rounded px-1.5 py-0.5 ml-2">COACH</span></p>
          <span class="font-mono text-[10px] text-ash ml-auto">PINNED</span>
        </div>
        <div class="px-5 pb-4">
          <p class="text-sm leading-relaxed mb-4">Exhaust the body, tame the mind. True vitality is built through the alignment of your spiritual, mental, and physical health. Post one win below before Sunday.</p>
          <div class="h-64 rounded-lg overflow-hidden"><img onerror="this.remove()" loading="lazy" decoding="async" src="assets/gen2-community-1.png" alt="Sunrise training" class="ig-img"/></div>
        </div>
        <p class="font-mono text-xs text-ash px-5 pb-4">78 AMEN · 12 REPLIES</p>
      </article>
      <article class="v-stagger bg-iron border border-whisper rounded-xl overflow-hidden mb-4">
        <div class="flex items-center gap-3 p-5 pb-3">
          <img onerror="this.remove()" loading="lazy" decoding="async" src="assets/coach-profile.jpg" alt="Coach Cayman" class="w-9 h-9 rounded-full object-cover border border-whisper"/>
          <p class="text-sm font-medium">Coach Cayman <span class="font-mono text-[10px] tracking-widest text-ember border border-ember/40 rounded px-1.5 py-0.5 ml-2">COACH</span></p>
        </div>
        <div class="px-5 pb-4">
          <p class="text-sm leading-relaxed mb-4">TEAM Testimonial — Nic Hemken, Founder of Elevate Sports Management. Results will never exceed your level of personal development. It's been an honor to watch you grow, brother.</p>
          <div class="h-64 rounded-lg overflow-hidden"><img onerror="this.remove()" loading="lazy" decoding="async" src="assets/gen2-community-2.png" alt="Testimonial" class="ig-img"/></div>
        </div>
        <p class="font-mono text-xs text-ash px-5 pb-4">16 AMEN · 4 REPLIES</p>
      </article>
      ${[["MT","Marcus T.","Hit 205 on bench after stalling for a month. The program works if you work.", "9 AMEN · 3 REPLIES", ""],
         ["JW","J. Whitfield","Thankful for community that sharpens me. As iron sharpens iron, so a friend sharpens a friend. — Prov 27:17","21 AMEN · 7 REPLIES","assets/gen2-community-3.png"]]
        .map(([i,n,t,m,img])=>`
      <article class="v-stagger bg-iron border border-whisper rounded-xl overflow-hidden mb-4">
        <div class="flex items-center gap-3 p-5 pb-3">
          <div class="w-9 h-9 rounded-full bg-forged border border-whisper flex items-center justify-center text-[11px] font-mono">${i}</div>
          <p class="text-sm font-medium">${n}</p>
        </div>
        <div class="px-5 pb-4">
          <p class="text-sm leading-relaxed ${img?"mb-4":""}">${t}</p>
          ${img?`<div class="h-56 rounded-lg overflow-hidden"><img onerror="this.remove()" loading="lazy" decoding="async" src="${img}" alt="" class="ig-img"/></div>`:""}
        </div>
        <p class="font-mono text-xs text-ash px-5 pb-4">${m}</p>
      </article>`).join("")}
    </section>
    <aside>
      <h3 class="v-stagger text-lg font-semibold tracking-tight mb-6 mt-14">Prayer Wall</h3>
      <div class="v-stagger bg-iron border border-whisper rounded-xl p-4 mb-4">
        <input placeholder="Share a request" class="w-full bg-forged border border-whisper rounded-lg px-4 py-2.5 text-sm placeholder:text-ash focus:border-ember focus:ring-0"/>
      </div>
      ${[["Daniel","Interviewing Thursday for a job that would let me be home for dinner.","12"],
         ["Robert","My father starts chemo Monday.","31"],
         ["Sam","Forty days sober today. Keep me steady.","27"]].map(([n,t,c])=>`
      <div class="v-stagger bg-iron border border-whisper rounded-xl p-4 mb-3">
        <p class="text-sm leading-relaxed mb-3">${t}</p>
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs text-ash">${n}</span>
          <button class="pray-btn press flex items-center gap-2 border border-whisper rounded-lg px-3 py-1.5 text-xs hover:bg-forged">Pray for this <span class="font-mono text-ash">${c}</span></button>
        </div>
      </div>`).join("")}
    </aside>
  </div>`,
},

messages: { title: "Messages", phase2: true, html: `
  <div class="grid grid-cols-[300px_1fr] gap-6" style="height:calc(100vh - 180px)">
    <aside class="v-stagger bg-iron border border-whisper rounded-xl overflow-hidden">
      <div class="p-4 border-b border-whisper">
        <input placeholder="Search" class="w-full bg-forged border border-whisper rounded-lg px-4 py-2 text-sm placeholder:text-ash focus:border-ember focus:ring-0"/>
      </div>
      <div class="flex items-center gap-3 p-4 bg-forged cursor-pointer">
        <img onerror="this.remove()" loading="lazy" decoding="async" src="assets/coach-profile.jpg" alt="Coach Cayman" class="w-10 h-10 rounded-full object-cover border border-ember/40"/>
        <div class="flex-1 min-w-0"><div class="flex justify-between"><span class="text-sm font-medium">Coach Cayman</span><span class="font-mono text-[10px] text-ash">7:12</span></div>
        <p class="text-xs text-ash truncate">Strong week. Watch the OHP lockout —</p></div>
        <span class="w-2 h-2 rounded-full bg-ember"></span>
      </div>
      <div class="flex items-center gap-3 p-4 hover:bg-forged cursor-pointer">
        <div class="w-10 h-10 rounded-full bg-forged border border-whisper flex items-center justify-center text-[11px] font-mono">BR</div>
        <div class="flex-1 min-w-0"><div class="flex justify-between"><span class="text-sm">Brothers</span><span class="font-mono text-[10px] text-ash">YDA</span></div>
        <p class="text-xs text-ash truncate">J. Whitfield: 5 AM crew tomorrow?</p></div>
      </div>
    </aside>
    <section class="v-stagger bg-iron border border-whisper rounded-xl flex flex-col min-h-0">
      <div class="flex items-center gap-3 px-6 py-4 border-b border-whisper">
        <img onerror="this.remove()" loading="lazy" decoding="async" src="assets/coach-profile.jpg" alt="Coach Cayman" class="w-9 h-9 rounded-full object-cover border border-ember/40"/>
        <div><p class="text-sm font-medium">Coach Cayman</p><p class="text-[11px] text-ok">Online</p></div>
      </div>
      <div class="flex-1 overflow-y-auto p-6 space-y-4" id="thread">
        <div class="max-w-md msg"><div class="bg-forged rounded-xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">How did Day 2 feel? Bench looked heavy on the last set in your log.</div><p class="font-mono text-[10px] text-ash mt-1">6:58 AM</p></div>
        <div class="max-w-md ml-auto msg"><div class="bg-ember/15 border border-ember/25 rounded-xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">Heavy but clean. Locked out everything.</div><p class="font-mono text-[10px] text-ash mt-1 text-right">7:04 AM</p></div>
        <div class="max-w-md ml-auto msg"><div class="border border-whisper bg-furnace rounded-xl px-4 py-3">
          <p class="font-mono text-[10px] tracking-widest text-ash mb-1">SESSION LOGGED</p>
          <p class="text-sm">Foundations of Iron · Day 2</p>
          <p class="font-mono text-sm mt-1">4×8 @ 205 LB <span class="text-ember">✓</span></p></div>
          <p class="font-mono text-[10px] text-ash mt-1 text-right">7:05 AM</p></div>
        <div class="max-w-md msg"><div class="bg-forged rounded-xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">Strong week. Watch the OHP lockout — we bump bench to 210 next session.</div><p class="font-mono text-[10px] text-ash mt-1">7:12 AM</p></div>
      </div>
      <div class="p-4 border-t border-whisper flex gap-3">
        <button class="press w-10 h-10 rounded-lg border border-whisper flex items-center justify-center text-ash hover:text-bone">${ICON("attach_file")}</button>
        <input id="msg-in" placeholder="Message Coach Cayman" class="flex-1 bg-forged border border-whisper rounded-lg px-4 text-sm placeholder:text-ash focus:border-ember focus:ring-0"/>
        <button id="msg-send" class="press w-10 h-10 rounded-lg bg-ember text-furnace flex items-center justify-center">${ICON("arrow_upward")}</button>
      </div>
    </section>
  </div>`,
},

nutrition: { title: "Nutrition & Macros", phase2: true, html: `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-8">Nutrition</h2>
  <div class="grid grid-cols-4 gap-4 mb-10">
    ${ring(86,"CALORIES","2,410 / 2,800","")}
    ${ring(79,"PROTEIN","142 / 180","G")}
    ${ring(75,"CARBS","210 / 280","G")}
    ${ring(80,"FAT","68 / 85","G")}
  </div>
  <div class="grid grid-cols-[1fr_320px] gap-8">
    <section>
      <p class="v-stagger font-mono text-xs tracking-widest text-ash mb-3">TODAY'S MEALS</p>
      <div class="divide-y" style="border-color:var(--c-whisper)">
        ${[["Breakfast","Oats, whey, blueberries","420 CAL · 35P · 60C · 5F"],
           ["Lunch","Chicken, jasmine rice, broccoli","580 CAL · 45P · 75C · 8F"],
           ["Snack","Greek yogurt, almonds","310 CAL · 25P · 15C · 12F"]].map(([m,f,mac])=>`
        <div class="v-stagger flex items-center justify-between py-4">
          <div><p class="text-sm font-medium">${m}</p><p class="text-xs text-ash">${f}</p></div>
          <span class="font-mono text-xs text-ash">${mac}</span>
        </div>`).join("")}
        <div class="v-stagger flex items-center justify-between py-4">
          <div><p class="text-sm font-medium">Dinner</p><p class="text-xs text-ash">Not logged yet</p></div>
          <button class="press border border-whisper rounded-lg px-4 py-2 text-xs hover:bg-forged">Log meal</button>
        </div>
      </div>
      <div class="v-stagger mt-8">
        <div class="flex justify-between font-mono text-xs text-ash mb-2"><span>HYDRATION · TIED TO THE DAILY SIX</span><span><span class="count" data-to="64">0</span> / 100 OZ</span></div>
        <div class="h-2 rounded bg-forged"><div class="bar-fill h-2 rounded bg-ember" data-w="64%"></div></div>
      </div>
    </section>
    <aside class="v-stagger bg-iron border border-whisper rounded-xl p-6 h-fit">
      <p class="font-mono text-xs tracking-widest text-ash mb-2">COACH'S PLAN</p>
      <p class="text-sm font-medium mb-4">Cut Phase — Week 3</p>
      <div class="space-y-2 font-mono text-xs text-ash mb-5">
        <div class="flex justify-between"><span>CALORIES</span><span class="text-bone">2,800</span></div>
        <div class="flex justify-between"><span>PROTEIN</span><span class="text-bone">180 G</span></div>
        <div class="flex justify-between"><span>CARBS</span><span class="text-bone">280 G</span></div>
        <div class="flex justify-between"><span>FAT</span><span class="text-bone">85 G</span></div>
      </div>
      <p class="text-xs text-ash leading-relaxed">"Keep the carbs around your training window. Consistency here is as vital as the lifting."</p>
    </aside>
  </div>
  <div class="flex items-center justify-between mt-10 mb-4">
    <p class="v-stagger font-mono text-xs tracking-widest text-ash">RECIPES FOR YOUR PLAN</p>
    <a href="#/recipes" class="v-stagger text-sm text-ember hover:underline">Browse all meals</a>
  </div>
  <div class="grid grid-cols-3 gap-5 rgrid">
    ${[["salmon-bowl"],["steak-potato"],["protein-smoothie"]].map(([id])=>{const r=RECIPES[id];return `
    <a href="#/recipe/${id}" class="v-stagger block bg-iron border border-whisper rounded-xl overflow-hidden hover:bg-forged">
      <div class="h-32 overflow-hidden"><img src="${r.img}" alt="${r.name}" class="ig-img"/></div>
      <div class="p-4"><p class="text-sm font-semibold leading-snug mb-1.5">${r.name}</p>
      <p class="font-mono text-[11px] text-ash">${r.prep+r.cook} MIN · ${r.type.toUpperCase()}</p></div>
    </a>`;}).join("")}
  </div>`,
},

recipes: { title: "Recipes", phase2: true, html: (() => {
  const first = RECIPES["oat-slice"];
  return `
  <div class="max-w-4xl mx-auto">
    <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-8 text-center">Meals</h2>
    <div class="v-stagger flex items-center gap-3 mb-4">
      <div class="relative flex-1 max-w-md">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2">${ICON("search","text-ash")}</span>
        <input id="r-search" placeholder="Search meals" class="w-full bg-forged border border-whisper rounded-lg pl-11 pr-4 py-2.5 text-sm placeholder:text-ash focus:border-ember focus:ring-0"/>
      </div>
      <span class="font-mono text-xs text-ash" id="r-count">${Object.keys(RECIPES).length} RESULTS</span>
    </div>
    <div class="v-stagger flex flex-wrap gap-2 mb-8" id="r-filters">
      ${["All","Breakfast","Lunch","Dinner","Snack"].map((f,i)=>`
        <button class="r-filter press font-mono text-[11px] tracking-widest px-4 py-1.5 rounded-full border ${i===0?"border-ember text-ember":"border-whisper text-ash"}" data-f="${f}">${f.toUpperCase()}</button>`).join("")}
    </div>

    <a href="#/recipe/oat-slice" class="v-stagger r-card block bg-iron border border-whisper rounded-xl overflow-hidden hover:bg-forged mb-6" data-name="${first.name.toLowerCase()}" data-type="${first.type}">
      <div class="grid grid-cols-[1.1fr_1fr] rgrid items-stretch">
        <div class="min-h-[200px] overflow-hidden"><img src="${first.img}" alt="${first.name}" class="ig-img"/></div>
        <div class="p-7 flex flex-col justify-between">
          <h3 class="text-2xl font-semibold tracking-tight">${first.name}</h3>
          <div>
            <div class="flex gap-1.5 mb-2">${first.badges.map(rBadge).join("")}</div>
            <p class="font-mono text-xs text-ash">${first.prep + first.cook} MIN</p>
          </div>
        </div>
      </div>
    </a>

    <div class="grid grid-cols-3 gap-5 rgrid" id="r-grid">
      ${Object.entries(RECIPES).filter(([id]) => id !== "oat-slice").map(([id, r]) => `
      <a href="#/recipe/${id}" class="v-stagger r-card block bg-iron border border-whisper rounded-xl overflow-hidden hover:bg-forged" data-name="${r.name.toLowerCase()}" data-type="${r.type}">
        <div class="h-36 overflow-hidden"><img src="${r.img}" alt="${r.name}" class="ig-img"/></div>
        <div class="p-4">
          <p class="text-sm font-semibold leading-snug mb-2.5" style="min-height:2.4em">${r.name}</p>
          <div class="flex gap-1.5 mb-2">${r.badges.map(rBadge).join("")}</div>
          <p class="font-mono text-[11px] text-ash">${r.prep + r.cook} MIN</p>
        </div>
      </a>`).join("")}
    </div>
  </div>`;
})(),
},

recipe: {
  title: (id) => (RECIPES[id] || RECIPES["oat-slice"]).name,
  phase2: true,
  html: (id) => {
    const r = RECIPES[id] || RECIPES["oat-slice"];
    return `
  <div class="max-w-2xl mx-auto pb-10">
    <div class="v-stagger flex items-center gap-3 mb-6">
      <a href="#/recipes" class="press w-9 h-9 rounded-full bg-iron border border-whisper flex items-center justify-center text-ash hover:text-bone">${ICON("arrow_back")}</a>
      <p class="font-mono text-xs tracking-[0.2em] text-ash mx-auto pr-9 text-center flex-1">RECIPE</p>
    </div>
    <div class="v-stagger rounded-xl overflow-hidden border border-whisper h-64 mb-6"><img src="${r.img}" alt="${r.name}" class="ig-img"/></div>
    <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-2">${r.name}</h2>
    <p class="v-stagger font-mono text-xs text-ash mb-3">${ICON("schedule","text-ash")} <span class="align-middle">PREP ${r.prep} MIN • COOK ${r.cook} MIN</span></p>
    <div class="v-stagger flex gap-1.5 mb-6">${r.badges.map(rBadge).join("")}</div>

    <section class="v-stagger bg-iron border border-whisper rounded-xl p-5 mb-8">
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm font-semibold">Number of servings</p>
        <div class="flex items-center gap-4">
          <button id="sv-minus" class="press w-8 h-8 rounded-full border border-whisper flex items-center justify-center text-ash hover:text-bone">${ICON("remove")}</button>
          <span class="font-mono text-lg" id="sv-count" data-base="${r.servings}">${r.servings}</span>
          <button id="sv-plus" class="press w-8 h-8 rounded-full border border-whisper flex items-center justify-center text-ash hover:text-bone">${ICON("add")}</button>
        </div>
      </div>
      <button id="add-list" class="press w-full bg-ember rounded-full py-3.5 text-sm font-bold tracking-widest" style="color:var(--c-furnace)">ADD TO SHOPPING LIST</button>
    </section>

    <div class="grid grid-cols-2 gap-8 rgrid mb-8">
      <section>
        <p class="v-stagger font-mono text-xs tracking-widest text-ash bg-iron border border-whisper rounded-lg px-4 py-2.5 mb-1">INGREDIENTS</p>
        ${r.ing.map((i) => `<p class="v-stagger text-sm leading-relaxed py-2.5 border-b" style="border-color:var(--c-whisper)">${i}</p>`).join("")}
      </section>
      <section>
        <div class="v-stagger flex items-center justify-between bg-iron border border-whisper rounded-lg px-4 py-2.5 mb-1">
          <p class="font-mono text-xs tracking-widest text-ash">METHOD</p>
          <p class="font-mono text-[10px] text-ash">BASED ON ${r.servings} SERVINGS</p>
        </div>
        ${r.method.map((m, i) => `
        <div class="v-stagger flex gap-3.5 py-3 border-b" style="border-color:var(--c-whisper)">
          <span class="w-6 h-6 rounded-full bg-forged flex items-center justify-center font-mono text-[11px] shrink-0">${i + 1}</span>
          <p class="text-sm leading-relaxed">${m}</p>
        </div>`).join("")}
      </section>
    </div>

    <button id="mark-done" class="v-stagger press w-full border border-whisper rounded-full py-3.5 text-sm font-semibold tracking-widest mb-8 hover:bg-forged flex items-center justify-center gap-2">${ICON("check")}MARK AS COMPLETE</button>

    <section class="v-stagger">
      <div class="flex items-center justify-between bg-iron border border-whisper rounded-lg px-4 py-2.5 mb-1">
        <p class="font-mono text-xs tracking-widest text-ash">NUTRITIONAL INFORMATION</p>
        <p class="font-mono text-[10px] text-ash">BASED ON 1 SERVING</p>
      </div>
      ${r.nutri.map(([k, v]) => `
      <div class="flex items-center justify-between py-3 border-b" style="border-color:var(--c-whisper)">
        <span class="text-sm text-ash">${k}</span><span class="font-mono text-sm font-semibold">${v}</span>
      </div>`).join("")}
    </section>
  </div>`; },
},

faith: { title: "Faith & Mind", phase2: true, html: `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-1">Faith &amp; Mind</h2>
  <p class="v-stagger text-ash text-sm mb-8">Spiritual strength. Mental fortitude. Physical fitness.</p>
  <div class="grid grid-cols-4 gap-4 mb-10">
    ${[["pillar-spirit","SPIRIT","Strengthen and deepen your relationship with God."],
       ["pillar-mind","MIND","Navigate mental barriers through coaching."],
       ["pillar-body","BODY","Workouts developed to optimize muscle growth."],
       ["pillar-nutrition","NUTRITION","Tailored meal plans and supplement stacks."]].map(([img,t,d])=>`
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5 text-center">
      <div class="org-chip w-14 h-14 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden"><img onerror="this.remove()" loading="lazy" decoding="async" src="assets/${img}.png" alt="${t}" class="w-9 h-9 object-contain"/></div>
      <p class="font-mono text-xs tracking-widest text-ember mb-1.5">${t}</p>
      <p class="text-xs text-ash leading-relaxed">${d}</p>
    </div>`).join("")}
  </div>
  <section class="v-stagger bg-iron border border-whisper rounded-xl p-6 mb-10 flex items-center justify-between">
    <div><p class="font-mono text-xs tracking-widest text-ash mb-2">CONTINUE</p>
      <p class="text-lg font-medium">The Fourth Man — 21 Days in Daniel</p>
      <p class="text-ash text-sm italic mt-1">"…the form of the fourth is like the Son of God."</p></div>
    <div class="flex items-center gap-6">
      <span class="font-mono text-sm text-ash">DAY <span class="count" data-to="9">0</span> / 21</span>
      <button class="press bg-ember rounded-lg px-6 py-3 text-sm font-semibold" style="color:var(--c-furnace)">Continue Day 9</button>
    </div>
  </section>
  <p class="v-stagger font-mono text-xs tracking-widest text-ash mb-4">DEVOTIONALS</p>
  <div class="grid grid-cols-3 gap-5 mb-10">
    ${[["The Fourth Man — 21 Days in Daniel","43","DAY 9 / 21","assets/gen2-mob.png"],
       ["Man Shall Not Live by Bread Alone — Fasting","0","7 DAYS · NOT STARTED","assets/gen2-fast.png"],
       ["New Wine, New Wineskins","100","COMPLETED · JUL 2026","assets/post-DUWecGFkRWU.jpg"]]
      .map(([t,p,s,img])=>`
    <div class="v-stagger bg-iron border border-whisper rounded-xl overflow-hidden hover:bg-forged cursor-pointer">
      <div class="h-32 overflow-hidden"><img onerror="this.remove()" loading="lazy" decoding="async" src="${img}" alt="" class="ig-img"/></div>
      <div class="p-5">
        <p class="text-sm font-medium mb-3 leading-snug">${t}</p>
        <div class="h-1 rounded bg-forged mb-2"><div class="bar-fill h-1 rounded" data-w="${p}%"></div></div>
        <p class="font-mono text-xs text-ash">${s}</p>
      </div>
    </div>`).join("")}
  </div>
  <div class="grid grid-cols-2 gap-10">
    <section>
      <p class="v-stagger font-mono text-xs tracking-widest text-ash mb-4">MIND</p>
      ${[["Morning Focus","10:00"],["Breath Under Load","15:00"],["Evening Examen","12:00"]].map(([t,d])=>`
      <div class="v-stagger flex items-center gap-4 py-3 border-b hover:bg-iron px-2 rounded cursor-pointer" style="border-color:var(--c-whisper)">
        ${ICON("play_circle","text-ember")}<span class="flex-1 text-sm">${t}</span><span class="font-mono text-xs text-ash">${d}</span>
      </div>`).join("")}
    </section>
    <section>
      <p class="v-stagger font-mono text-xs tracking-widest text-ash mb-4">TEACHING · FROM COACH CAYMAN</p>
      ${[["When Faith Meets Hustle, Mountains Move","assets/post-DG067emRgOd.jpg"],
         ["It's More Than Working Out — Purification of the Heart","assets/gen2-circuit.png"],
         ["Are You Willing to Sprint When the Distance Is Unknown?","assets/gen2-sprint.png"]].map(([t,img])=>`
      <div class="v-stagger flex items-center gap-4 py-3 border-b hover:bg-iron px-2 rounded cursor-pointer" style="border-color:var(--c-whisper)">
        <div class="w-16 h-11 rounded overflow-hidden shrink-0"><img onerror="this.remove()" loading="lazy" decoding="async" src="${img}" alt="" class="ig-img"/></div>
        <span class="flex-1 text-sm leading-snug">${t}</span>${ICON("play_circle","text-ember")}
      </div>`).join("")}
    </section>
  </div>`,
},

blood: { title: "Blood Panel", phase2: true, html: (() => {
  const mk = (name, val, unit, delta, dir, lo, hi, optLo, optHi, pos) => `
    <div class="py-3.5 border-b last:border-0" style="border-color:var(--c-whisper)">
      <div class="flex items-baseline justify-between mb-2">
        <span class="text-sm">${name}</span>
        <span class="font-mono text-sm">${val} <span class="text-ash text-xs">${unit}</span>
          <span class="${dir === "up" ? "text-ok" : dir === "down" ? "text-ok" : "text-ash"} text-xs ml-1.5">${dir === "up" ? "▲" : dir === "down" ? "▼" : "—"} ${delta}</span></span>
      </div>
      <div class="relative h-1.5 rounded bg-forged">
        <div class="absolute h-1.5 rounded" style="left:${optLo}%;width:${optHi - optLo}%;background:rgb(var(--c-ember-rgb) / 0.35)"></div>
        <div class="absolute w-2.5 h-2.5 rounded-full bg-ember -top-0.5" style="left:calc(${pos}% - 5px)"></div>
      </div>
      <div class="flex justify-between font-mono text-[10px] text-ash mt-1"><span>${lo}</span><span>OPTIMAL</span><span>${hi}</span></div>
    </div>`;
  const cat = (label, rows) => `
    <section class="v-stagger bg-iron border border-whisper rounded-xl px-5 py-3">
      <p class="font-mono text-xs tracking-widest text-ash pt-2 pb-1">${label}</p>
      ${rows}
    </section>`;
  return `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-1">Blood Panel</h2>
  <p class="v-stagger text-ash text-sm mb-8">Upload your lab results. Track what the work is doing on the inside.</p>

  <div class="grid grid-cols-4 gap-4 mb-8">
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
      <p class="font-mono text-xs tracking-widest text-ash mb-2">MARKERS IMPROVING</p>
      <p class="font-mono text-3xl"><span class="count" data-to="9">0</span><span class="text-ash text-lg"> / 12</span></p>
    </div>
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
      <p class="font-mono text-xs tracking-widest text-ash mb-2">IN OPTIMAL RANGE</p>
      <p class="font-mono text-3xl"><span class="count" data-to="10">0</span><span class="text-ash text-lg"> / 12</span></p>
    </div>
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
      <p class="font-mono text-xs tracking-widest text-ash mb-2">LAST DRAW</p>
      <p class="font-mono text-2xl mt-1">JUN 2026</p>
    </div>
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
      <p class="font-mono text-xs tracking-widest text-ash mb-2">NEXT DRAW DUE</p>
      <p class="font-mono text-2xl mt-1 text-ember">SEP 2026</p>
    </div>
  </div>

  <section class="v-stagger bg-iron border border-whisper rounded-xl p-6 mb-8">
    <div class="flex items-baseline justify-between mb-5">
      <div><p class="font-mono text-xs tracking-widest text-ash mb-1">TESTOSTERONE · TOTAL</p>
        <p class="font-mono text-2xl">688 <span class="text-ash text-sm">NG/DL</span> <span class="text-ok text-sm">▲ +76 SINCE MAR</span></p></div>
      <div class="flex gap-2">
        ${["6M", "1Y", "ALL"].map((r, i) => `<span class="font-mono text-[11px] px-3 py-1 rounded-lg ${i === 0 ? "bg-forged text-ember" : "text-ash"}">${r}</span>`).join("")}
      </div>
    </div>
    <svg viewBox="0 0 720 160" class="w-full" style="height:160px" role="img" aria-label="Testosterone trend across four lab draws">
      <rect x="0" y="30" width="720" height="70" fill="rgb(var(--c-ember-rgb) / 0.08)"/>
      <text x="6" y="26" font-family="Geist Mono" font-size="9" fill="var(--c-ash)">OPTIMAL 550–900</text>
      ${[0, 40, 80, 120].map((y) => `<line x1="0" y1="${y + 20}" x2="720" y2="${y + 20}" stroke="var(--c-whisper)" stroke-width="1"/>`).join("")}
      <polyline points="60,118 260,102 460,72 660,52" fill="none" stroke="var(--c-ember)" stroke-width="2"/>
      ${[[60, 118, "512", "SEP 25"], [260, 102, "560", "DEC 25"], [460, 72, "612", "MAR 26"], [660, 52, "688", "JUN 26"]]
        .map(([x, y, v, d]) => `
        <circle cx="${x}" cy="${y}" r="4" fill="var(--c-ember)"/>
        <text x="${x}" y="${y - 12}" text-anchor="middle" font-family="Geist Mono" font-size="11" fill="var(--c-bone)">${v}</text>
        <text x="${x}" y="150" text-anchor="middle" font-family="Geist Mono" font-size="9" fill="var(--c-ash)">${d}</text>`).join("")}
    </svg>
  </section>

  <div class="grid grid-cols-2 gap-5 mb-8">
    ${cat("HORMONAL",
      mk("Testosterone (total)", "688", "ng/dL", "+76", "up", "300", "1000", 36, 86, 55) +
      mk("Testosterone (free)", "14.2", "pg/mL", "+1.8", "up", "5", "21", 44, 88, 58) +
      mk("Cortisol (AM)", "14.1", "µg/dL", "−2.3", "down", "5", "23", 28, 67, 51))}
    ${cat("LIPIDS",
      mk("HDL", "54", "mg/dL", "+6", "up", "20", "100", 40, 90, 43) +
      mk("LDL", "96", "mg/dL", "−12", "down", "40", "200", 8, 38, 35) +
      mk("Triglycerides", "84", "mg/dL", "−22", "down", "30", "250", 5, 32, 25))}
    ${cat("METABOLIC",
      mk("Fasting glucose", "88", "mg/dL", "−4", "down", "60", "140", 20, 45, 35) +
      mk("HbA1c", "5.2", "%", "−0.2", "down", "4", "9", 8, 30, 24) +
      mk("Fasting insulin", "4.8", "µIU/mL", "−1.1", "down", "2", "25", 4, 26, 12))}
    ${cat("INFLAMMATION · RECOVERY",
      mk("hs-CRP", "0.8", "mg/L", "−0.5", "down", "0", "10", 0, 10, 8) +
      mk("Vitamin D", "46", "ng/mL", "+9", "up", "10", "100", 35, 70, 40) +
      mk("Resting heart rate", "58", "bpm", "−6", "down", "40", "100", 15, 40, 30))}
  </div>

  <div class="grid grid-cols-[1fr_360px] gap-8">
    <div>
      <p class="v-stagger font-mono text-xs tracking-widest text-ash mb-3">YOUR REPORTS</p>
      ${[["Quarterly Panel", "JUN 2026 · PDF · 6 PAGES"], ["Quarterly Panel", "MAR 2026 · PDF · 6 PAGES"], ["Baseline Panel", "SEP 2025 · PDF · 8 PAGES"]].map(([t, m]) => `
      <div class="v-stagger flex items-center gap-4 py-4 border-b" style="border-color:var(--c-whisper)">
        ${ICON("description", "text-ash")}
        <div class="flex-1"><p class="text-sm">${t}</p><p class="font-mono text-xs text-ash">${m}</p></div>
        <button class="press border border-whisper rounded-lg px-4 py-2 text-xs hover:bg-forged">View</button>
      </div>`).join("")}
    </div>
    <aside class="v-stagger bg-iron rounded-xl p-8 text-center border-2 border-dashed h-fit" style="border-color:var(--c-whisper)">
      ${ICON("upload_file", "text-ash")}
      <p class="text-sm font-medium mt-3 mb-1">Upload your results PDF</p>
      <p class="text-xs text-ash leading-relaxed mb-4">Get tested anywhere. Your PDF stays private, visible only to you and your coach. Markers come from the reports you upload — nothing connects to a lab, nothing leaves this vault.</p>
      <button class="press border border-whisper rounded-lg px-5 py-2.5 text-sm hover:bg-forged">Choose file</button>
    </aside>
  </div>`;
})(),
},

partners: { title: "Partner Network", phase2: true, html: `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-1">Partner Network</h2>
  <p class="v-stagger text-ash text-sm mb-8">Vetted specialists, booked through your membership.</p>
  <div class="grid grid-cols-[1fr_360px] gap-8">
    <div class="grid grid-cols-2 gap-5 h-fit">
      ${[["AR","Dr. A. Reyes","Sports Chiropractic","Miami / Fort Lauderdale","THU 2:30 PM",false,true],
         ["MD","M. Delgado","Physical Therapy","Miami / Fort Lauderdale","FRI 10:00 AM",true,false],
         ["JC","Pastor J. Cole","Counseling","Fort Lauderdale","MON 6:00 PM",true,false],
         ["RO","R. Ortiz","Massage & Recovery","Miami","SAT 9:00 AM",false,false]]
        .map(([i,n,s,loc,next,elite,sel])=>`
      <div class="v-stagger bg-iron border ${sel?"border-ember/50":"border-whisper"} rounded-xl p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-full bg-forged flex items-center justify-center text-[11px] font-mono">${i}</div>
            <div><p class="text-sm font-medium">${n}</p><p class="text-xs text-ash">${s}</p></div>
          </div>
          ${elite?'<span class="font-mono text-[9px] tracking-widest text-ember border border-ember/40 rounded px-1.5 py-0.5">ELITE</span>':""}
        </div>
        <p class="text-xs text-ash mb-1">${loc}</p>
        <p class="font-mono text-xs text-ash mb-4">NEXT: ${next}</p>
        <button class="press w-full border border-whisper rounded-lg px-4 py-2 text-sm ${sel?"bg-forged":"hover:bg-forged"}">Book a session</button>
      </div>`).join("")}
    </div>
    <aside class="v-stagger bg-iron border border-whisper rounded-xl p-6 h-fit">
      <p class="font-mono text-xs tracking-widest text-ash mb-1">BOOKING</p>
      <p class="text-sm font-medium mb-6">Dr. A. Reyes · Sports Chiropractic</p>
      <div class="grid grid-cols-5 gap-2 text-center mb-6">
        ${[["WED","13"],["THU","14"],["FRI","15"],["SAT","16"],["MON","18"]].map(([d,n],i)=>`
          <div class="${i===1?"border border-ember/40 rounded-lg py-1":""}">
            <p class="font-mono text-[10px] ${i===1?"text-ember":"text-ash"} mb-1">${d}</p>
            <p class="font-mono text-sm ${i===1?"text-ember":""}">${n}</p></div>`).join("")}
      </div>
      <div class="grid grid-cols-3 gap-2 mb-6" id="slots">
        ${["11:00","1:30","2:30","4:00","5:15","6:30"].map((t,i)=>`
          <button class="slot press rounded-lg py-2 font-mono text-xs ${i===2?"bg-ember text-furnace font-semibold":"bg-forged border border-whisper"}">${t}</button>`).join("")}
      </div>
      <button id="confirm-booking" class="press w-full bg-ember rounded-lg py-3 text-sm font-semibold" style="color:var(--c-furnace)">Confirm Booking</button>
      <p class="text-xs text-ash mt-4 leading-relaxed">Included in Elite. Essential members book at partner rates.</p>
    </aside>
  </div>
  <p class="v-stagger font-mono text-xs tracking-widest text-ash mt-12 mb-4">ORGANIZATIONS WE SERVE</p>
  <div class="v-stagger grid grid-cols-8 gap-3">
    ${[1,2,3,4,5,6,7,8].map(n=>`
      <div class="org-chip rounded-lg h-16 flex items-center justify-center p-2 border border-whisper">
        <img onerror="this.remove()" loading="lazy" decoding="async" src="assets/org-${n}.png" alt="Partner organization" class="max-h-10 max-w-full object-contain"/>
      </div>`).join("")}
  </div>`,
},

gear: { title: "4th Man Gear", phase2: true, html: `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-1">4th Man Gear</h2>
  <p class="v-stagger text-ash text-sm mb-8">Wear the standard.</p>
  <section class="v-stagger bg-iron border border-whisper rounded-xl p-8 mb-8 grid grid-cols-[1fr_240px] items-center gap-8">
    <div>
      <p class="font-mono text-xs tracking-widest text-ash mb-2">FOUNDATION COLLECTION</p>
      <h3 class="text-xl font-semibold tracking-tight mb-2">The Fourth Man Hoodie</h3>
      <p class="text-ash text-sm mb-6 max-w-md leading-relaxed">Heavyweight fleece in furnace black. Embroidered mark, no print. Built for 5 AM parking lots.</p>
      <div class="flex items-center gap-5">
        <button class="press bg-ember text-furnace rounded-lg px-6 py-3 text-sm font-semibold">Shop the drop</button>
        <span class="font-mono text-lg">$58</span>
      </div>
    </div>
    <div class="h-44 rounded-xl bg-forged flex items-center justify-center">${ICON("apparel","text-ash")}</div>
  </section>
  <div class="grid grid-cols-3 gap-5">
    ${[["Standard Tee — Charcoal","$32","apparel",true,"assets/gen-tee-charcoal.png"],
       ["Standard Tee — Bone","$32","apparel",false,"assets/gen-tee-bone.png"],["Field Cap","$28","podcasts",false,"assets/gen-cap.png"],
       ["Gym Towel","$18","dry_cleaning",false,"assets/gen-towel.png"],["Shaker Bottle","$24","water_bottle",false,"assets/gen-shaker.png"],
       ["The Fourth Man Hoodie","$58","apparel",false,"assets/gen-hoodie.png"]]
      .map(([n,p,ic,sizes,img])=>`
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
      <div class="h-36 rounded-lg bg-forged mb-4 flex items-center justify-center overflow-hidden">${img?`<img loading="lazy" decoding="async" src="${img}" alt="${n}" class="ig-img" onerror="this.remove()"/>`:ICON(ic,"text-ash")}</div>
      <div class="flex justify-between items-center mb-3"><p class="text-sm">${n}</p><span class="font-mono text-sm">${p}</span></div>
      ${sizes?`<div class="flex gap-1.5 mb-4 size-row">
        ${["S","M","L","XL"].map((s,i)=>`<button class="size press border ${i===1?"border-ember text-ember":"border-whisper text-ash"} rounded px-2 py-1 font-mono text-[11px]">${s}</button>`).join("")}
      </div>`:`<p class="font-mono text-[11px] text-ash mb-4">ONE SIZE</p>`}
      <button class="press add-cart w-full border border-whisper rounded-lg py-2 text-sm hover:bg-forged">Add to cart</button>
    </div>`).join("")}
  </div>
  <p class="v-stagger font-mono text-[11px] text-ash mt-8">CHECKOUT POWERED BY SHOPIFY · EMBEDDED</p>`,
},

coach: { title: "Coach — Dashboard", phase2: false, html: `
  <h2 class="v-stagger text-3xl font-semibold tracking-tight mb-1">Who needs attention</h2>
  <p class="v-stagger text-ash text-sm mb-8">Sorted slipping-first. You learn a client slipped here, not when they cancel.</p>
  <div class="grid grid-cols-4 gap-4 mb-10">
    ${[["ACTIVE CLIENTS","28",""],["ON TRACK","21","text-ok"],["SLIPPING","5","text-bad"],["PAYMENT ISSUES","2","text-bad"]]
      .map(([l,v,c])=>`
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
      <p class="font-mono text-xs tracking-widest text-ash mb-2">${l}</p>
      <p class="font-mono text-3xl ${c}"><span class="count" data-to="${v}">0</span></p>
    </div>`).join("")}
  </div>
  <div class="v-stagger grid grid-cols-[1.4fr_1fr_1fr_1fr_.7fr] font-mono text-[11px] tracking-widest text-ash px-4 pb-3">
    <span>CLIENT</span><span>PLAN</span><span>COMPLIANCE</span><span>LAST SESSION</span><span>STREAK</span>
  </div>
  <div class="divide-y" style="border-color:var(--c-whisper)">
    ${[["S. Nguyen","ESSENTIAL","41%","6 DAYS AGO","0","bad"],
       ["D. Alvarez","ESSENTIAL","55%","4 DAYS AGO","2","bad"],
       ["R. Ortega","ESSENTIAL","62%","PAUSED","—","ash"],
       ["Marcus T.","ELITE","87%","TODAY","23","ok"],
       ["J. Whitfield","ELITE","94%","YESTERDAY","41","ok"],
       ["K. Boateng","ELITE","81%","TODAY","12","ok"]].map(([n,p,c,l,s,st])=>`
    <a href="#/client" class="v-stagger grid grid-cols-[1.4fr_1fr_1fr_1fr_.7fr] items-center px-4 py-4 hover:bg-iron rounded-lg cursor-pointer">
      <span class="text-sm flex items-center gap-3"><span class="w-1.5 h-1.5 rounded-full bg-${st==="ok"?"ok":st==="bad"?"bad":"ash"}"></span>${n}</span>
      <span class="font-mono text-xs">${p}</span><span class="font-mono text-sm">${c}</span>
      <span class="font-mono text-xs text-ash">${l}</span><span class="font-mono text-sm">${s}</span>
    </a>`).join("")}
  </div>`,
},

client: { title: "Coach — Marcus T.", phase2: false, html: `
  <div class="v-stagger flex items-center justify-between mb-8">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-forged border border-whisper flex items-center justify-center font-mono text-sm">MT</div>
      <div><h2 class="text-2xl font-semibold tracking-tight">Marcus T.</h2>
        <p class="text-ash text-sm">ELITE · $147/MO · <span class="text-ok">Active</span> · Member since <span class="font-mono">MAY 2026</span></p></div>
    </div>
    <a href="#/messages" class="press border border-whisper rounded-lg px-5 py-2.5 text-sm hover:bg-forged">Message</a>
  </div>
  <div class="grid grid-cols-[1fr_360px] gap-8">
    <div>
      <p class="v-stagger font-mono text-xs tracking-widest text-ash mb-3">DAILY SIX · LAST 7 DAYS</p>
      <div class="v-stagger bg-iron border border-whisper rounded-xl p-5 mb-8">
        <div class="grid grid-cols-8 gap-2 font-mono text-[10px] text-ash">
          <span></span>${["M","T","W","T","F","S","S"].map(d=>`<span class="text-center">${d}</span>`).join("")}
          ${["HYD","BIB","PRA","MED","REA","TRN"].map((h,r)=>`
            <span class="leading-6">${h}</span>
            ${[1,1,1,1,1,1,0].map((_,c)=>{
              const on = (r*7+c*3)%5 !== 0;
              return `<span class="h-6 rounded ${on?"bg-ember/70":"bg-forged"} block dot" style="opacity:0"></span>`;}).join("")}`).join("")}
        </div>
      </div>
      <p class="v-stagger font-mono text-xs tracking-widest text-ash mb-3">LOGGED SESSIONS — FOUNDATIONS OF IRON</p>
      <div class="divide-y" style="border-color:var(--c-whisper)">
        ${[["W3 · D2 · Push","TODAY · 52 MIN","4×8 @ 205 BENCH — PR"],
           ["W3 · D1 · Pull","2 DAYS AGO · 49 MIN","ROWS 4×10 @ 155"],
           ["W2 · D4 · Full","5 DAYS AGO · 61 MIN","SQUAT 5×5 @ 225"]].map(([t,m,d])=>`
        <div class="v-stagger py-4 flex items-center justify-between">
          <div><p class="text-sm">${t}</p><p class="font-mono text-xs text-ash">${m}</p></div>
          <span class="font-mono text-xs">${d}</span>
        </div>`).join("")}
      </div>
    </div>
    <aside class="space-y-4">
      <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
        <p class="font-mono text-xs tracking-widest text-ash mb-4">SNAPSHOT</p>
        <div class="space-y-3 font-mono text-sm">
          <div class="flex justify-between"><span class="text-ash text-xs">COMPLIANCE</span><span><span class="count" data-to="87">0</span>%</span></div>
          <div class="flex justify-between"><span class="text-ash text-xs">STREAK</span><span><span class="count" data-to="23">0</span> DAYS</span></div>
          <div class="flex justify-between"><span class="text-ash text-xs">WEEK VOLUME</span><span>12,480 LB</span></div>
          <div class="flex justify-between"><span class="text-ash text-xs">WEIGHT TREND</span><span>−1.2 LB</span></div>
        </div>
      </div>
      <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
        <p class="font-mono text-xs tracking-widest text-ash mb-3">WEEKLY REVIEW · W2</p>
        <p class="text-sm leading-relaxed mb-2">"Best week yet. Struggled with evening reading habit — done by 9 PM or it doesn't happen."</p>
        <p class="font-mono text-[10px] text-ash">SUBMITTED SUN 8:14 PM</p>
      </div>
      <a href="#/builder" class="v-stagger press block text-center bg-ember text-furnace rounded-lg py-3 text-sm font-semibold">Adjust Program</a>
    </aside>
  </div>`,
},

builder: { title: "Coach — Program Builder", phase2: false, html: `
  <div class="v-stagger flex items-start justify-between mb-8">
    <div><h2 class="text-2xl font-semibold tracking-tight">Program Builder</h2>
      <p class="text-ash text-sm mt-1">Foundations of Iron · <span class="font-mono">8 WEEKS · 4 DAYS/WK</span></p></div>
    <div class="flex gap-3">
      <button class="press border border-whisper rounded-lg px-5 py-2.5 text-sm hover:bg-forged">Save Draft</button>
      <button class="press bg-ember text-furnace rounded-lg px-5 py-2.5 text-sm font-semibold">Assign to Client</button>
    </div>
  </div>
  <div class="grid grid-cols-[340px_1fr] gap-8">
    <section class="v-stagger bg-iron rounded-xl border border-whisper p-5 h-fit">
      <p class="font-mono text-xs tracking-widest text-ash mb-4">EXERCISE LIBRARY · LICENSED</p>
      <input placeholder="Search exercises" class="w-full bg-forged border border-whisper rounded-lg px-4 py-2.5 text-sm placeholder:text-ash focus:border-ember focus:ring-0 mb-4"/>
      <div class="flex flex-wrap gap-2 mb-5">
        ${["CHEST","BACK","LEGS","SHOULDERS","BARBELL"].map((c,i)=>`
          <span class="font-mono text-[11px] px-3 py-1 rounded-lg bg-forged ${i===0?"text-ember border border-ember/40":"text-ash"}">${c}</span>`).join("")}
      </div>
      ${[["Barbell Bench Press","Chest · Barbell","assets/gen-bench.png"],
         ["Overhead Press","Shoulders · Barbell","assets/gen2-ohp.png"],
         ["Seated Cable Row","Back · Cable","assets/gen2-row.png"],
         ["Incline Dumbbell Press","Chest · Dumbbell",""]]
        .map(([n,t,img])=>`
      <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-forged cursor-grab border border-transparent hover:border-whisper">
        <div class="w-16 h-10 rounded overflow-hidden bg-forged flex items-center justify-center relative shrink-0">
          ${img?`<img onerror="this.remove()" loading="lazy" decoding="async" src="${img}" alt="${n}" class="ig-img"/><span class="absolute inset-0 flex items-center justify-center">${ICON("play_arrow","text-white")}</span>`:ICON("play_arrow","text-ash")}
        </div>
        <div class="flex-1"><p class="text-sm">${n}</p><p class="text-xs text-ash">${t}</p></div>
        ${ICON("add","text-ash")}
      </div>`).join("")}
      <p class="font-mono text-xs text-ash mt-4">1,240 EXERCISES · $10–50/MO LICENSED</p>
    </section>
    <section class="space-y-4">
      <div class="v-stagger bg-iron rounded-xl border border-whisper">
        <div class="flex items-center justify-between px-5 py-4 border-b border-whisper">
          <span class="font-mono text-xs tracking-widest text-ash">WEEK 3</span>${ICON("expand_less","text-ash")}
        </div>
        <div class="px-5 py-2">
          <div class="py-3 flex items-center justify-between border-b" style="border-color:var(--c-whisper)">
            <span class="text-sm text-ash">Day 1 · Pull</span><span class="font-mono text-xs text-ash">5 EXERCISES</span></div>
          <div class="py-4 border-b" style="border-color:var(--c-whisper)">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-ember">Day 2 · Push</span>
              <button class="press font-mono text-xs text-ash border border-whisper rounded px-3 py-1 hover:text-bone">+ ADD EXERCISE</button></div>
            ${[["Barbell Bench Press","4 × 8","90s"],["Incline Dumbbell Press","3 × 10","75s"],["Overhead Press","4 × 6","120s"],["Cable Fly","3 × 12","60s"]]
              .map(([n,sr,rest])=>`
            <div class="flex items-center gap-4 bg-forged rounded-lg px-4 py-3 mb-2">
              ${ICON("drag_indicator","text-ash cursor-grab")}
              <span class="flex-1 text-sm">${n}</span>
              <span class="font-mono text-sm">${sr}</span><span class="font-mono text-xs text-ash">${rest}</span>
              ${ICON("close","text-ash cursor-pointer")}
            </div>`).join("")}
          </div>
          <div class="py-3 flex items-center justify-between">
            <span class="text-sm text-ash">Day 3 · Legs</span><span class="font-mono text-xs text-ash">6 EXERCISES</span></div>
        </div>
      </div>
      <div class="v-stagger bg-iron rounded-xl border border-whisper px-5 py-4 flex items-center justify-between">
        <span class="font-mono text-xs tracking-widest text-ash">WEEK 4</span>${ICON("expand_more","text-ash")}
      </div>
    </section>
  </div>`,
},

billing: { title: "Coach — Billing", phase2: false, html: `
  <h2 class="v-stagger text-2xl font-semibold tracking-tight mb-1">Billing</h2>
  <p class="v-stagger text-ash text-sm mb-8">Subscriptions renew, upgrade and pause without a reminder.</p>
  <div class="grid grid-cols-4 gap-4 mb-10">
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5"><p class="font-mono text-xs tracking-widest text-ash mb-2">MRR</p><p class="font-mono text-3xl">$<span class="count" data-to="3182">0</span></p></div>
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5"><p class="font-mono text-xs tracking-widest text-ash mb-2">ACTIVE</p><p class="font-mono text-3xl"><span class="count" data-to="28">0</span></p></div>
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5"><p class="font-mono text-xs tracking-widest text-ash mb-2">PAST DUE</p><p class="font-mono text-3xl text-bad"><span class="count" data-to="2">0</span></p></div>
    <div class="v-stagger bg-iron border border-whisper rounded-xl p-5"><p class="font-mono text-xs tracking-widest text-ash mb-2">PAUSED</p><p class="font-mono text-3xl text-ash"><span class="count" data-to="1">0</span></p></div>
  </div>
  <div class="grid grid-cols-[1fr_280px] gap-8">
    <section>
      <div class="v-stagger grid grid-cols-[1.4fr_1fr_.8fr_1fr_.8fr] font-mono text-[11px] tracking-widest text-ash px-4 pb-3">
        <span>CLIENT</span><span>PLAN</span><span>STATUS</span><span>RENEWAL</span><span class="text-right">LTV</span>
      </div>
      <div class="divide-y" style="border-color:var(--c-whisper)">
        ${[["Marcus T.","ELITE · $147","Active","ok","AUG 18","$1,764"],
           ["D. Alvarez","ESSENTIAL · $97","Past due","bad","AUG 9","$582"],
           ["J. Whitfield","ELITE · $147","Active","ok","AUG 21","$2,205"],
           ["R. Ortega","ESSENTIAL · $97","Paused","ash","—","$873"],
           ["K. Boateng","ELITE · $147","Active","ok","AUG 27","$441"],
           ["S. Nguyen","ESSENTIAL · $97","Past due","bad","AUG 6","$194"]].map(([n,p,s,c,r,l])=>`
        <div class="v-stagger grid grid-cols-[1.4fr_1fr_.8fr_1fr_.8fr] items-center px-4 py-4 hover:bg-iron rounded-lg">
          <span class="text-sm">${n}</span><span class="font-mono text-xs">${p}</span>
          <span class="flex items-center gap-2 text-xs text-${c}"><span class="w-1.5 h-1.5 rounded-full bg-${c}"></span>${s}</span>
          <span class="font-mono text-sm text-ash">${r}</span><span class="font-mono text-sm text-right">${l}</span>
        </div>`).join("")}
      </div>
    </section>
    <aside class="space-y-4">
      <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
        <p class="font-mono text-xs tracking-widest text-ash mb-4">STRIPE</p>
        <p class="text-sm text-ash mb-1">Last payout</p>
        <p class="font-mono text-xl mb-4">$1,240 <span class="text-ash text-sm">· AUG 8</span></p>
        <button class="press w-full border border-whisper rounded-lg px-4 py-2.5 text-sm hover:bg-forged">Open Stripe Dashboard</button>
      </div>
      <div class="v-stagger bg-iron border border-whisper rounded-xl p-5">
        <p class="font-mono text-xs tracking-widest text-ash mb-3">WEB BILLING</p>
        <p class="text-sm text-ash leading-relaxed">Sold on the web through Stripe. No 15–30% app-store commission.</p>
      </div>
    </aside>
  </div>`,
},
};
