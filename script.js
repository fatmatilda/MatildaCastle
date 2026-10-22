const SAVE_KEY = 'matilda_castle_save';
const GLOBAL_STATS_KEY = 'matilda_global_stats';
const CURRENT_VERSION = 'v0.1.7';

const RESOURCES = [
  { id: 'FE', name: 'Iron' }, { id: 'WD', name: 'Wood' }, { id: 'LE', name: 'Leather' },
  { id: 'CL', name: 'Cloth' }, { id: 'AU', name: 'Gold' }, { id: 'DI', name: 'Diamond' },
  { id: 'ST', name: 'String' }, { id: 'CO', name: 'Coal' }, { id: 'OB', name: 'Obsidian' },
  { id: 'GL', name: 'Glass' }
];

const RECIPES = [
  { name: "Iron Helmet", grid: [null,null,null,null,null,null, null,null,null,null,null,null, null,null,'FE','FE',null,null, null,null,'FE','FE',null,null, null,null,'LE','LE',null,null, null,null,null,null,null,null] },
  { name: "Leather Boots", grid: [null,null,null,null,null,null, null,null,null,null,null,null, null,null,'LE',null,'LE',null, null,null,'LE',null,'LE',null, null,null,'ST',null,'ST',null, null,null,null,null,null,null] },
  { name: "Wooden Shield", grid: [null,null,null,null,null,null, null,'WD','WD','WD','WD',null, null,'WD','FE','FE','WD',null, null,'WD','FE','FE','WD',null, null,'WD','WD','WD','WD',null, null,null,null,null,null,null] },
  { name: "Gold Chestplate", grid: [null,null,null,null,null,null, null,'AU',null,null,'AU',null, null,'AU','AU','AU','AU',null, null,'AU','AU','AU','AU',null, null,null,'AU','AU',null,null, null,null,null,null,null,null] },
  { name: "Diamond Sword", grid: [null,null,null,null,null,null, null,null,null,null,'DI',null, null,null,null,'DI',null,null, null,'DI','DI','ST',null,null, null,null,'AU',null,null,null, null,null,null,null,null,null] },
  { name: "Obsidian Axe", grid: [null,null,null,null,null,null, null,'OB','OB',null,null,null, null,'OB','WD',null,null,null, null,null,'WD',null,null,null, null,null,'WD',null,null,null, null,null,null,null,null,null] },
  { name: "Cloth Robe", grid: [null,null,null,null,null,null, null,null,'CL','CL',null,null, null,'CL','CL','CL','CL',null, null,'CL','CL','CL','CL',null, null,'ST',null,null,'ST',null, null,null,null,null,null,null] },
  { name: "Glass Pane", grid: [null,null,null,null,null,null, null,null,null,null,null,null, null,'GL','GL','GL','GL',null, null,'GL','GL','GL','GL',null, null,null,null,null,null,null, null,null,null,null,null,null] },
  { name: "Iron Sword", grid: [null,null,null,null,null,null, null,null,null,null,'FE',null, null,null,null,'FE',null,null, null,'FE','FE','WD',null,null, null,null,null,null,null,null, null,null,null,null,null,null] },
  { name: "Diamond Helmet", grid: [null,null,null,null,null,null, null,null,null,null,null,null, null,null,'DI','DI',null,null, null,null,'DI','DI',null,null, null,null,'DI','DI',null,null, null,null,null,null,null,null] },
  { name: "Golden Boots", grid: [null,null,null,null,null,null, null,null,null,null,null,null, null,null,'AU',null,'AU',null, null,null,'AU',null,'AU',null, null,null,'LE',null,'LE',null, null,null,null,null,null,null] },
  { name: "Obsidian Shield", grid: [null,null,null,null,null,null, null,'OB','OB','OB','OB',null, null,'OB','FE','FE','OB',null, null,'OB','FE','FE','OB',null, null,'OB','OB','OB','OB',null, null,null,null,null,null,null] },
  { name: "Cloth Gloves", grid: [null,null,null,null,null,null, null,null,null,null,null,null, null,null,'CL',null,'CL',null, null,null,'CL',null,'CL',null, null,null,'ST',null,'ST',null, null,null,null,null,null,null] },
  { name: "Wooden Bow", grid: [null,null,null,null,null,null, null,null,'WD',null,'ST',null, null,'WD',null,null,null,'ST',null,'WD',null,null,null,'ST',null,null,'WD',null,'ST',null, null,null,null,null,null,null] },
  { name: "Dragon Scale", grid: [null,null,null,null,null,null, null,'DI','DI','DI','DI',null, null,'DI','AU','AU','DI',null, null,'DI','AU','AU','DI',null, null,'DI','DI','DI','DI',null, null,null,null,null,null,null] }
];

let CHEM_EQUATIONS = [];

const DEFAULT_JOBS = [
  {
    id: 'boxes', name: 'Carry Boxes', desc: 'A simple job. Haul crates from dawn till dusk.',
    hireCost: 0, basePay: 0.50, baseCd: 5000, maxPay: 1.25, maxCd: 3000, payStep: 0.05, cdStep: 200,
    stamBase: 1, stamMult: 1.15, earnBase: 0.5, earnMult: 1.15
  },
  {
    id: 'dishes', name: 'Wash Dishes', desc: 'Scrub pots in the scullery. Pays better, but takes longer.',
    hireCost: 20.00, basePay: 5.00, baseCd: 10000, maxPay: 8.00, maxCd: 5000, payStep: 0.25, cdStep: 250,
    stamBase: 3, stamMult: 1.18, earnBase: 2, earnMult: 1.18
  },
  {
    id: 'plates', name: 'Plate Sorting', desc: 'Arrange plates in order. One mistake resets the sequence.',
    hireCost: 300.00, basePay: 16.00, baseCd: 8000, maxPay: 40.00, maxCd: 4000, payStep: 1.60, cdStep: 200,
    stamBase: 50, stamMult: 1.18, earnBase: 40, earnMult: 1.18, basePlates: 16, minPlates: 10, plateStep: 1, plateBase: 100, plateMult: 1.18
  },
  {
    id: 'lawn', name: 'Lawn Mowing', desc: 'Trace the line perfectly to cut the grass.',
    hireCost: 3500.00, basePay: 150.00, baseCd: 10000, maxPay: 300.00, maxCd: 5000, payStep: 15.00, cdStep: 250,
    stamBase: 200, stamMult: 1.18, earnBase: 500, earnMult: 1.18, precBase: 1000, precMult: 1.18, maxPrecLv: 10
  },
  {
    id: 'sword', name: 'Sword Forging', desc: 'Hit the power meter as close to 100 as possible.',
    hireCost: 25000.00, basePay: 1500.00, baseCd: 15000, maxPay: 5000.00, maxCd: 10000, payStep: 350.00, cdStep: 250,
    stamBase: 3000, stamMult: 1.18, earnBase: 5000, earnMult: 1.18, precBase: 10000, precMult: 1.18, maxPrecLv: 10,
    baseThreshold: 465, minThreshold: 400
  },
  {
    id: 'armorer', name: 'Armor Crafter', desc: 'Craft armor by looking at the recipe book.',
    hireCost: 300000.00, basePay: 20000.00, baseCd: 25000, maxPay: 125000.00, maxCd: 25000, payStep: 5000.00, cdStep: 0,
    stamBase: 100000, stamMult: 1.18, earnBase: 20000, earnMult: 1.18
  },
  {
    id: 'writer', name: 'Writer', desc: 'Type the poem without making a mistake.',
    hireCost: 4000000.00, basePay: 300000.00, baseCd: 30000, maxPay: 900000.00, maxCd: 30000, payStep: 30000.00, cdStep: 0,
    stamBase: 1000000, stamMult: 1.18, earnBase: 50000, earnMult: 1.18
  },
  {
    id: 'scientist', name: 'Scientist', desc: 'Solve complex problems and equations.',
    hireCost: 30000000.00, basePay: 2100000.00, baseCd: 60000, maxPay: 12000000.00, maxCd: 60000, payStep: 2000000.00, cdStep: 0,
    stamBase: 10000000, stamMult: 1.0, earnBase: 10000000, earnMult: 1.0
  }
];

let JOBS = JSON.parse(JSON.stringify(DEFAULT_JOBS));

let currentChapter = 1;
let game = null;
let cooldownInterval = null;
let slaveInterval = null;
let playTimer = null;
let appleRAF = null;
let swordRAF = null;
let lawnAnimInterval = null;
let uiInterval = null;
let sessionTime = 0;
let openUpgradePanels = {};
let updateShown = false;

let appleGameActive = false;
let applePos = 0;
let appleStartTime = 0;
let appleGreenStart = 45;

let swordMeterVal = 0;
let swordStartTime = 0;
let swordHits = 0;
let swordStrikes = 0;
let swordAnimating = false;

let lawnCtx = null;
let isLawnDrawing = false;
let lawnStarted = false;
let lawnProgress = 0;
let lawnAccuracy = 100;
let lawnPoints = [];
let lastMouseX = undefined;
let lastMouseY = undefined;

let isCraftingActive = false;
let currentRecipeIndex = 0;
let currentBookPage = 0;
let selectedInvItem = null;
let isDeleteMode = false;
let craftTableState = new Array(36).fill(null);

let poems = [];
let isWritingActive = false;
let currentPoemLines = [];
let currentPoemText = "";
let writerIndex = 0;
let writerMistakeUsed = false;

let isResearchingActive = false;
let sciTasks = [];
let sciCurrentTaskIndex = 0;

function triggerError(el) {
  if (!el) return;
  el.classList.add('btn-error');
  setTimeout(() => el.classList.remove('btn-error'), 300);
}

function triggerAnim(success) {
  const el = document.getElementById('workAreaContainer');
  if (!el) return;
  el.classList.remove('anim-win', 'anim-lose');
  void el.offsetWidth;
  el.classList.add(success ? 'anim-win' : 'anim-lose');
  setTimeout(() => el.classList.remove('anim-win', 'anim-lose'), 1000);
}

function formatMoney(num) {
  if (num < 1000) return '$' + num.toFixed(2);
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  let i = 0;
  while (num >= 1000 && i < suffixes.length - 1) {
    num /= 1000;
    i++;
  }
  let decimals = 2;
  if (num >= 100) decimals = 0;
  else if (num >= 10) decimals = 1;
  let formatted = parseFloat(num.toFixed(decimals));
  if (formatted >= 1000 && i < suffixes.length - 1) {
     formatted /= 1000;
     i++;
  }
  return '$' + formatted + suffixes[i];
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0s';
  seconds = Math.floor(seconds);
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h + 'h ' + m + 'm';
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + 'm ' + s + 's';
  }
  return seconds + 's';
}

function formatGameTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = Math.floor(mins % 60);
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

function round2(n) { return Math.round(n * 100) / 100; }

function getHungerMult() {
  if (!game) return 1;
  const sat = game.satiety;
  if (sat >= 50) {
    return 1 + (100 - sat) * 0.01;
  } else {
    return 1.5 + Math.pow((50 - sat) / 50, 2) * 2.5;
  }
}

function getElixirMult() {
  if (!game || Date.now() > game.elixirEndTime) return 1;
  return 0.5;
}

function applyCooldownMult(baseMs) {
  return baseMs * getHungerMult() * getElixirMult();
}

function getPremiumLevel() { return (game && game.premiumLevel) || 0; }
function getPremiumMult() {
  const lvl = getPremiumLevel();
  return lvl > 0 ? round2(1.2 + (lvl - 1) * 0.2) : 1;
}
function getPremiumPrice() {
  const lvl = getPremiumLevel();
  return round2(20 * Math.pow(1.5, lvl));
}

function getJobData(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  const upg = (game && game.jobUpgrades[jobId]) || { stamina: 0, earnings: 0, plates: 0, precision: 0, mistake: 0, degree: 1 };
  if (upg.plates === undefined) upg.plates = 0;
  if (upg.precision === undefined) upg.precision = 0;
  if (upg.mistake === undefined) upg.mistake = 0;
  if (upg.degree === undefined) upg.degree = 1;

  const stamMaxLv = job.cdStep === 0 ? 0 : Math.floor((job.baseCd - job.maxCd) / job.cdStep);
  const earnMaxLv = jobId === 'scientist' ? 0 : Math.floor((job.maxPay - job.basePay) / job.payStep);
  const plateMaxLv = job.basePlates ? Math.floor((job.basePlates - job.minPlates) / job.plateStep) : 0;
  const precMaxLv = job.baseThreshold ? job.maxPrecLv : (job.precBase ? job.maxPrecLv : 0);
  const mistakeMaxLv = job.id === 'writer' ? 1 : 0;
  const degreeMaxLv = job.id === 'scientist' ? 5 : 0;

  upg.stamina = Math.min(upg.stamina, stamMaxLv);
  upg.earnings = Math.min(upg.earnings, earnMaxLv);
  upg.plates = Math.min(upg.plates, plateMaxLv);
  upg.precision = Math.min(upg.precision, precMaxLv);
  upg.mistake = Math.min(upg.mistake, mistakeMaxLv);
  upg.degree = Math.min(upg.degree, degreeMaxLv);

  return { job, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv, mistakeMaxLv, degreeMaxLv };
}

function baseCooldown(jobId) {
  const { job, upg } = getJobData(jobId);
  if (jobId === 'armorer' || jobId === 'writer' || jobId === 'scientist') return 60000;
  return Math.max(job.maxCd, job.baseCd - upg.stamina * job.cdStep);
}
function currentCooldown(jobId) {
  return applyCooldownMult(baseCooldown(jobId));
}
function currentPay(jobId) {
  const { job, upg } = getJobData(jobId);
  if (jobId === 'scientist') {
    const deg = upg.degree || 1;
    if (deg === 1) return 2100000;
    if (deg === 2) return 3000000;
    if (deg === 3) return 4800000;
    if (deg === 4) return 7200000;
    if (deg === 5) return 12000000;
    return 2100000;
  }
  return Math.min(job.maxPay, round2(job.basePay + upg.earnings * job.payStep));
}
function currentThreshold(jobId) {
  const { job, upg } = getJobData(jobId);
  if (!job.baseThreshold) return 0;
  return Math.max(job.minThreshold, job.baseThreshold - upg.precision * 7);
}
function currentPlates(jobId) {
  const { job, upg } = getJobData(jobId);
  if (!job.basePlates) return 0;
  return Math.max(job.minPlates, job.basePlates - upg.plates * job.plateStep);
}
function staminaCost(jobId) {
  const { job, upg } = getJobData(jobId);
  if (jobId === 'armorer' || jobId === 'writer' || jobId === 'scientist') return 0;
  return round2(job.stamBase * Math.pow(job.stamMult, upg.stamina));
}
function earningsCost(jobId) {
  const { job, upg } = getJobData(jobId);
  if (jobId === 'armorer') return round2(job.earnBase * Math.pow(job.earnMult, upg.earnings));
  if (jobId === 'writer') return round2(job.earnBase * Math.pow(job.earnMult, upg.earnings));
  if (jobId === 'scientist') return 0;
  return round2(job.earnBase * Math.pow(job.earnMult, upg.earnings));
}
function platesCost(jobId) {
  const { job, upg } = getJobData(jobId);
  if (!job.plateBase) return 0;
  return round2(job.plateBase * Math.pow(job.plateMult, upg.plates));
}
function precisionCost(jobId) {
  const { job, upg } = getJobData(jobId);
  if (!job.precBase) return 0;
  return round2(job.precBase * Math.pow(job.precMult, upg.precision));
}
function mistakeCost(jobId) {
  if (jobId !== 'writer') return 0;
  return 15000000;
}
function degreeCost(jobId) {
  const { upg } = getJobData(jobId);
  if (jobId !== 'scientist') return 0;
  const deg = upg.degree || 1;
  if (deg === 1) return 20000000;
  if (deg === 2) return 30000000;
  if (deg === 3) return 45000000;
  if (deg === 4) return 67500000;
  return 0;
}
function slaveCost(jobId) {
  const { job } = getJobData(jobId);
  let base = staminaCost(jobId) + earningsCost(jobId);
  if (job.basePlates) base += platesCost(jobId);
  if (job.precBase) base += precisionCost(jobId);
  if (jobId === 'writer') base += mistakeCost(jobId);
  if (jobId === 'scientist') {
    base += 20000000 + 30000000 + 45000000 + 67500000;
  }
  return round2(base * 1.35);
}

function getSlaveCooldown(jobId) {
  if (jobId === 'boxes' || jobId === 'dishes') return baseCooldown(jobId);
  const fixed = { plates: 10000, lawn: 15000, sword: 15000, armorer: 25000, writer: 30000, scientist: 60000 };
  return fixed[jobId] || 60000;
}

function getElixirPrice() {
  let maxHire = 0;
  JOBS.forEach(j => {
    if (game.hiredJobs.includes(j.id)) maxHire = Math.max(maxHire, j.hireCost);
  });
  if (maxHire === 0) maxHire = 20;
  return Math.floor(maxHire * 0.5);
}

function getBasketPrice() {
  const prices = [0, 2000, 6000, 18000, 50000];
  return prices[game.basketLevel + 1] || 0;
}

function getCalendarPrice() {
  const prices = [15000, 80000, 500000];
  return prices[game.calendarLevel] || 0;
}

function getSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw) || {}; } catch (e) { return {}; }
}
function writeSave(data) { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); }

function getGlobalStats() {
  const raw = localStorage.getItem(GLOBAL_STATS_KEY);
  let data = { totalPlayTime: 0, chapterStats: {} };
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      data.totalPlayTime = parsed.totalPlayTime || 0;
      data.chapterStats = parsed.chapterStats || {};
    } catch (e) {}
  }
  if (!data.chapterStats[1]) data.chapterStats[1] = { started: 0, completed: 0, totalTime: 0 };
  if (typeof data.chapterStats[1].totalTime !== 'number') data.chapterStats[1].totalTime = 0;
  if (typeof data.chapterStats[1].started !== 'number') data.chapterStats[1].started = 0;
  if (typeof data.chapterStats[1].completed !== 'number') data.chapterStats[1].completed = 0;
  if (typeof data.totalPlayTime !== 'number') data.totalPlayTime = 0;
  return data;
}
function writeGlobalStats(data) { localStorage.setItem(GLOBAL_STATS_KEY, JSON.stringify(data)); }

function hasSave(chapter) {
  const data = getSave();
  return !!(data && data[chapter] && data[chapter].started);
}

function normalizeState(s) {
  const upgrades = {};
  if (s.jobUpgrades && typeof s.jobUpgrades === 'object') {
    Object.keys(s.jobUpgrades).forEach(k => {
      const u = s.jobUpgrades[k] || {};
      upgrades[k] = {
        stamina: Math.max(0, Number(u.stamina) || 0),
        earnings: Math.max(0, Number(u.earnings) || 0),
        plates: Math.max(0, Number(u.plates) || 0),
        precision: Math.max(0, Number(u.precision) || 0),
        mistake: Math.max(0, Number(u.mistake) || 0),
        degree: Math.max(1, Number(u.degree) || 1)
      };
    });
  }
  return {
    started: !!s.started,
    money: typeof s.money === 'number' ? s.money : 0,
    hiredJobs: Array.isArray(s.hiredJobs) ? s.hiredJobs.slice() : [],
    selectedJobId: s.selectedJobId || null,
    jobUpgrades: upgrades,
    slaves: s.slaves || {},
    slaveNextWork: s.slaveNextWork || {},
    hasSlaveLicense: !!s.hasSlaveLicense,
    hasClock: !!s.hasClock,
    timeMinutes: typeof s.timeMinutes === 'number' ? s.timeMinutes : 480,
    dayOfWeek: typeof s.dayOfWeek === 'number' ? s.dayOfWeek : 0,
    lastCurtainTime: typeof s.lastCurtainTime === 'number' ? s.lastCurtainTime : -120,
    slaveNightEarnings: typeof s.slaveNightEarnings === 'number' ? s.slaveNightEarnings : 0,
    workCooldownEnd: typeof s.workCooldownEnd === 'number' ? s.workCooldownEnd : 0,
    lastCooldownDuration: typeof s.lastCooldownDuration === 'number' ? s.lastCooldownDuration : 5000,
    lastCooldownMult: typeof s.lastCooldownMult === 'number' ? s.lastCooldownMult : 1,
    playTime: typeof s.playTime === 'number' ? s.playTime : 0,
    workClicks: typeof s.workClicks === 'number' ? s.workClicks : 0,
    premiumLevel: typeof s.premiumLevel === 'number' ? s.premiumLevel : 0,
    plateLayout: Array.isArray(s.plateLayout) ? s.plateLayout : [],
    plateCurrentTarget: typeof s.plateCurrentTarget === 'number' ? s.plateCurrentTarget : 1,

    satiety: typeof s.satiety === 'number' ? s.satiety : 100,
    lastSatietyDrop: typeof s.lastSatietyDrop === 'number' ? s.lastSatietyDrop : 0,
    apples: typeof s.apples === 'number' ? s.apples : 0,
    elixirs: typeof s.elixirs === 'number' ? s.elixirs : 0,
    basketLevel: typeof s.basketLevel === 'number' ? s.basketLevel : 0,
    appleReadyTime: typeof s.appleReadyTime === 'number' ? s.appleReadyTime : 0,
    appleCdDuration: typeof s.appleCdDuration === 'number' ? s.appleCdDuration : 0,
    lastAppleMult: typeof s.lastAppleMult === 'number' ? s.lastAppleMult : 1,
    elixirEndTime: typeof s.elixirEndTime === 'number' ? (s.elixirEndTime < 100000 ? 0 : s.elixirEndTime) : 0,
    calendarLevel: typeof s.calendarLevel === 'number' ? s.calendarLevel : 0,
    lawnProgress: typeof s.lawnProgress === 'number' ? s.lawnProgress : 0,
    lastSleepDay: typeof s.lastSleepDay === 'number' ? s.lastSleepDay : -1
  };
}

function saveGame() {
  if (!game) return;
  const data = getSave();
  data[currentChapter] = game;
  writeSave(data);
}

function hideAllScenes() {
  ['mainMenu', 'chapterSelect', 'chapterDesc'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('gameScreen').classList.add('hidden');
}
function showScene(id) {
  hideAllScenes();
  const el = document.getElementById(id);
  el.classList.remove('hidden');
  el.classList.remove('fade-in');
  void el.offsetWidth;
  el.classList.add('fade-in');
}

function stopAllIntervals() {
  if (playTimer) { clearInterval(playTimer); playTimer = null; }
  if (cooldownInterval) { clearInterval(cooldownInterval); cooldownInterval = null; }
  if (slaveInterval) { clearInterval(slaveInterval); slaveInterval = null; }
  if (appleRAF) { cancelAnimationFrame(appleRAF); appleRAF = null; }
  if (swordRAF) { cancelAnimationFrame(swordRAF); swordRAF = null; }
  if (lawnAnimInterval) { clearInterval(lawnAnimInterval); lawnAnimInterval = null; }
  if (uiInterval) { clearInterval(uiInterval); uiInterval = null; }
  window.removeEventListener('keydown', handleWriterKeydown);
}

function showMenu() { 
  stopAllIntervals();
  saveGame();
  showScene('mainMenu'); 
  checkVersionPopup();
}
function showChapters() { showScene('chapterSelect'); }

function selectChapter(n) {
  currentChapter = n;
  document.getElementById('continueBtn').disabled = !hasSave(n);
  showScene('chapterDesc');
}

async function checkBalanceFile() {
  try {
    const res = await fetch('balance.txt');
    if (res.ok) {
      const text = await res.text();
      const val = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (!isNaN(val)) {
        game.money = val;
        saveGame();
        document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
      }
    }
  } catch (e) {
    console.log('No balance.txt');
  }
}

async function loadPoems() {
  try {
    const res = await fetch('poems.txt');
    if (res.ok) {
      const text = await res.text();
      const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      poems = normalized.trim().split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
    }
  } catch(e) {
    console.log('No poems.txt', e);
    poems = ["in matilda's castle, tall and grand,\nshe rules the halls with iron hand.\nif you seek to flee tonight,\nbeware her gaze, her endless sight."];
  }
}

async function loadChemEquations() {
  try {
    const res = await fetch('him.txt');
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split('\n').filter(line => line.length > 0);
      const parsed = lines.map(line => {
        const parts = line.split('/').map(p => p.trim());
        if (parts.length < 2) return null;
        const eq = parts[0];
        const answers = parts.slice(1).map(Number);
        if (answers.some(isNaN)) return null;
        const placeholders = (eq.match(/_/g) || []).length;
        if (placeholders === 0 || placeholders !== answers.length) return null;
        return { eq, answers };
      }).filter(x => x !== null);
      const seen = new Set();
      CHEM_EQUATIONS = parsed.filter(x => {
        if (seen.has(x.eq)) return false;
        seen.add(x.eq);
        return true;
      });
    }
  } catch(e) {
    console.log('No him.txt', e);
    CHEM_EQUATIONS = [
      { eq: "_H2 + _O2 = _H2O", answers: [2, 1, 2] },
      { eq: "_CH4 + _O2 = CO2 + _H2O", answers: [1, 2, 2] }
    ];
  }
}

function toggleChangelog(el) {
  const parent = el.parentElement;
  const body = parent.querySelector('.clog-body');
  parent.classList.toggle('open');
  if (body) body.classList.toggle('hidden');
}

async function showChangelog() {
  let html = '<div class="changelog-content">';
  try {
    const res = await fetch('updates.txt');
    if (res.ok) {
      const text = await res.text();
      const blocks = text.trim().split(/\n\s*\n/);
      blocks.forEach((block, index) => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 2) return;
        const headerParts = lines[0].split('|');
        const version = headerParts[0].trim();
        const date = headerParts[1] ? headerParts[1].trim() : '';
        const changes = lines.slice(1);

        html += `
          <div class="clog-item${index === 0 ? ' open' : ''}">
            <div class="clog-header" onclick="toggleChangelog(this)">
              <div><h3>${version}</h3><span class="date">${date}</span></div>
              <span class="arrow">▶</span>
            </div>
            <div class="clog-body ${index === 0 ? '' : 'hidden'}">
              <ul>${changes.map(c => `<li>${c.replace(/^-\s*/, '')}</li>`).join('')}</ul>
            </div>
          </div>
        `;
      });
    } else {
      throw new Error('Failed to load');
    }
  } catch (e) {
    html += `<div class="clog-item open">
        <div class="clog-header" onclick="toggleChangelog(this)">
          <div><h3>Changelog Unavailable</h3><span class="date">Error</span></div>
          <span class="arrow">▶</span>
        </div>
        <div class="clog-body">
          <ul><li>Could not load updates.txt. Make sure the file exists.</li></ul>
        </div>
      </div>`;
  }
  html += '</div>';
  showModal('Changelog', html, 'Close', null, closeModal, closeModal);
}

function checkVersionPopup() {
  if (updateShown) return;
  if (localStorage.getItem('seen_' + CURRENT_VERSION) !== 'true') {
    updateShown = true;
    setTimeout(() => {
      const markSeen = () => {
        localStorage.setItem('seen_' + CURRENT_VERSION, 'true');
        closeModal();
      };
      showModal(
        'Update ' + CURRENT_VERSION,
        '<div style="text-align:left;line-height:1.6;font-size:14px;">Welcome to the new update! Here is what is new:<br><br>• Rebalanced Jobs Economy.<br>• Elixir price is now 50% of best job.<br>• Slaves cost reduced.<br>• Scientist: angles tolerance is 10°.<br>• Scientist: labels A, B, C added.<br>• Scientist: shows correct answers on failure.<br>• Chem equations fit in one line.</div>',
        'Okay',
        null,
        markSeen,
        markSeen
      );
    }, 800);
  }
}

function switchRulesTab(tabId, e) {
  document.querySelectorAll('.rules-tab').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  document.querySelectorAll('.rules-content').forEach(c => c.classList.remove('active'));
  document.getElementById('rules-' + tabId).classList.add('active');
}

function showRules() {
  showModal(
    'Rules',
    '<div class="rules-tabs">' +
      '<button class="rules-tab active" onclick="switchRulesTab(\'basics\', event)">Basics</button>' +
      '<button class="rules-tab" onclick="switchRulesTab(\'time\', event)">Time</button>' +
      '<button class="rules-tab" onclick="switchRulesTab(\'hunger\', event)">Hunger</button>' +
      '<button class="rules-tab" onclick="switchRulesTab(\'shop\', event)">Shop</button>' +
    '</div>' +

    '<div class="rules-content active" id="rules-basics">' +
      '<h3>Goal</h3>' +
      '<p>Earn enough money to buy a can of Coca-Cola. Give it to Matilda to escape the castle.</p>' +
      '<h3>Work & Cooldowns</h3>' +
      '<p>Every job has a base pay and a cooldown. Upgrades improve them.</p>' +
      '<ul>' +
        "<li><strong>Stamina:</strong> Reduces the job's cooldown.</li>" +
        '<li><strong>Earnings:</strong> Increases the payout per shift.</li>' +
        '<li><strong>Precision:</strong> Makes mini-games more forgiving.</li>' +
      '</ul>' +
      '<h3>Mini-games</h3>' +
      '<p>Some jobs require active playing: sorting plates, tracing a line, forging swords, etc. If you fail, you pay a penalty and suffer a cooldown.</p>' +
    '</div>' +

    '<div class="rules-content" id="rules-time">' +
      '<h3>Day & Night Cycle</h3>' +
      '<p>1 in-game hour = 30 real seconds.</p>' +
      '<ul>' +
        '<li><strong>Dawn:</strong> 06:00 - 12:00</li>' +
        '<li><strong>Day:</strong> 12:00 - 18:00</li>' +
        '<li><strong>Sunset:</strong> 18:00 - 00:00</li>' +
        '<li><strong>Night:</strong> 00:00 - 06:00</li>' +
      '</ul>' +
      '<h3>Working at Night</h3>' +
      '<p><strong>Working at night is forbidden!</strong> If Matilda catches you, you pay a 12.5x pay fine + all slave earnings from that night. You are locked out of work for 30 seconds.</p>' +
      '<h3>Sleeping</h3>' +
      '<p>You can sleep once per day (for 8 hours). This costs 5% of your balance and reduces satiety by 25%. Forcing a second sleep costs an additional 35% fine.</p>' +
    '</div>' +

    '<div class="rules-content" id="rules-hunger">' +
      '<h3>Satiety</h3>' +
      '<p>Your satiety drops 1% every 12 seconds (100 to 0 takes 20 minutes).</p>' +
      "<p><strong>Penalty:</strong> Low satiety increases ALL cooldowns. At 50% it's 1.5x slower, at 0% it's 4x slower.</p>" +
      '<h3>Apples</h3>' +
      '<p>Pick apples in the Garden (stop the pointer in the green zone). Eat them to restore +5% satiety.</p>' +
      '<h3>Elixirs</h3>' +
      '<p>Drink a Herbal Elixir to halve all cooldowns (speed up the game) for 5 game hours. Effects stack.</p>' +
    '</div>' +

    '<div class="rules-content" id="rules-shop">' +
      '<h3>Premium</h3>' +
      '<p>Every 10th work click yields an extra multiplier to your earnings.</p>' +
      '<h3>Calendar</h3>' +
      '<p>Unlocks weekend income bonuses. Level 1 gives x2 on Saturday, Level 2 adds Sunday, Level 3 makes both x3.</p>' +
      '<h3>Slaves</h3>' +
      '<p>Buy the Slave License to automate fully upgraded jobs. Slaves work on fixed cooldowns and are affected by hunger and elixirs.</p>' +
      '<h3>Pocket Clock</h3>' +
      '<p>Displays the current in-game time in the Work tab.</p>' +
    '</div>',
    'Close',
    null,
    closeModal,
    closeModal
  );
}

function showStats() {
  const gStats = getGlobalStats();
  const save = getSave()[currentChapter] || { playTime: 0 };
  const ch1 = gStats.chapterStats[1];

  const html = 
    '<div class="stats-tabs">' +
      '<button class="stats-tab active" onclick="switchStatsTab(\'overall\', event)">Overall</button>' +
      '<button class="stats-tab" onclick="switchStatsTab(\'ch1\', event)">Chapter I</button>' +
    '</div>' +
    '<div class="stats-content active" id="stats-overall">' +
      '<div class="stats-highlight">' +
        '<div class="stats-highlight-title">Total Time Played</div>' +
        '<div class="stats-highlight-value">' + formatTime(gStats.totalPlayTime) + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="stats-content" id="stats-ch1">' +
      '<div class="stats-highlight">' +
        '<div class="stats-highlight-title">Total Time in Chapter I</div>' +
        '<div class="stats-highlight-value">' + formatTime(ch1.totalTime) + '</div>' +
      '</div>' +
      '<div class="stats-row"><span>Time in Current Save</span><span>' + formatTime(save.playTime) + '</span></div>' +
      '<div class="stats-row"><span>Started / Completed</span><span>' + ch1.started + ' / ' + ch1.completed + '</span></div>' +
    '</div>';

  showModal('Statistics', html, 'Close', null, closeModal, closeModal);
}

function switchStatsTab(tabId, e) {
  document.querySelectorAll('.stats-tab').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  document.querySelectorAll('.stats-content').forEach(c => c.classList.remove('active'));
  document.getElementById('stats-' + tabId).classList.add('active');
}

function requestNewGame() {
  if (!hasSave(currentChapter)) { startNewGame(); return; }
  showModal(
    'Start Over?',
    'All progress in this chapter will be erased, and the story will begin again from the very first moment. This cannot be undone.',
    'Start Over',
    'Cancel',
    () => { closeModal(); startNewGame(); },
    closeModal
  );
}

function showModal(title, text, confirmLabel, cancelLabel, onConfirm, onCancel, customClass = '') {
  const root = document.getElementById('modalRoot');
  const cancelHtml = cancelLabel ? '<button id="modalCancel">' + cancelLabel + '</button>' : '';
  const isSpecial = title === 'Changelog' || title === 'Statistics' || title.startsWith('Update') || title === 'Outside' || title === 'Slept' || title === 'Rules' || title === 'Crafting Book';
  root.innerHTML =
    '<div class="modal-overlay" id="modalOverlay">' +
      '<div class="modal ' + customClass + '">' +
        '<h2>' + title + '</h2>' +
        (isSpecial ? text : '<p>' + text + '</p>') +
        '<div class="modal-actions">' +
          '<button class="confirm" id="modalConfirm">' + confirmLabel + '</button>' +
          cancelHtml +
        '</div>' +
      '</div>' +
    '</div>';
  document.getElementById('modalConfirm').addEventListener('click', onConfirm);
  if (cancelLabel) document.getElementById('modalCancel').addEventListener('click', onCancel);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay' && typeof onCancel === 'function') onCancel();
  });
}

function closeModal() {
  document.getElementById('modalRoot').innerHTML = '';
}

function startNewGame() {
  const data = getSave();
  data[currentChapter] = {
    started: true,
    money: 0,
    hiredJobs: [],
    selectedJobId: null,
    jobUpgrades: {},
    slaves: {},
    slaveNextWork: {},
    hasSlaveLicense: false,
    hasClock: false,
    timeMinutes: 480,
    dayOfWeek: 0,
    lastCurtainTime: -120,
    slaveNightEarnings: 0,
    workCooldownEnd: 0,
    lastCooldownDuration: 5000,
    lastCooldownMult: 1,
    playTime: 0,
    workClicks: 0,
    premiumLevel: 0,
    plateLayout: [],
    plateCurrentTarget: 1,
    satiety: 100,
    lastSatietyDrop: Date.now(),
    apples: 0,
    elixirs: 0,
    basketLevel: 0,
    appleReadyTime: 0,
    appleCdDuration: 0,
    lastAppleMult: 1,
    elixirEndTime: 0,
    calendarLevel: 0,
    lawnProgress: 0,
    lastSleepDay: -1
  };
  writeSave(data);

  const gStats = getGlobalStats();
  gStats.chapterStats[currentChapter].started++;
  writeGlobalStats(gStats);

  launchChapter(currentChapter);
}

function continueGame() {
  if (!hasSave(currentChapter)) return;
  launchChapter(currentChapter);
}

async function launchChapter(n) {
  currentChapter = n;
  const data = getSave();
  game = normalizeState(data[n] || {});

  await checkBalanceFile();
  await loadPoems();
  await loadChemEquations();

  hideAllScenes();
  document.getElementById('gameScreen').classList.remove('hidden');
  switchTab('work');
  renderGame();
  updateSkyUI();
  updateClockUI();
  updateHungerUI();
  renderCalendar();

  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
    startCooldownTicker();
  }

  if (game.appleReadyTime > Date.now()) {
     const btn = document.getElementById('startAppleBtn');
     btn.disabled = true;
  }

  if (playTimer) clearInterval(playTimer);
  sessionTime = 0;
  playTimer = setInterval(() => {
    sessionTime++;

    game.timeMinutes = (game.timeMinutes + 2) % 1440;
    if (game.timeMinutes === 0) {
      game.dayOfWeek = (game.dayOfWeek + 1) % 7;
      renderCalendar();
    }
    if (game.timeMinutes === 360) {
      game.slaveNightEarnings = 0;
    }

    updateSkyUI();
    updateClockUI();
    updateBonusText(); 

    if (Date.now() - game.lastSatietyDrop > 12000) {
      game.satiety = Math.max(0, game.satiety - 1);
      game.lastSatietyDrop = Date.now();
      updateHungerUI();
    }

    if (sessionTime % 10 === 0) {
      game.playTime = (game.playTime || 0) + 10;
      const gStats = getGlobalStats();
      gStats.totalPlayTime += 10;
      gStats.chapterStats[currentChapter].totalTime += 10;
      writeGlobalStats(gStats);
      saveGame();
    }
  }, 1000);

  if (slaveInterval) clearInterval(slaveInterval);
  slaveInterval = setInterval(processSlaves, 100);

  if (lawnAnimInterval) clearInterval(lawnAnimInterval);
  lawnAnimInterval = setInterval(() => {
    if (game.selectedJobId === 'lawn' && !game.slaves['lawn'] && isLawnDrawing) {
       checkLawnAccuracy(lastMouseX, lastMouseY);
    }
  }, 20);

  if (uiInterval) clearInterval(uiInterval);
  uiInterval = setInterval(updateFastUI, 50); 

  setupLawnCanvas();
  startSwordMeter();
}

function updateFastUI() {
  if (!game) return;
  const now = Date.now();

  const newMult = getHungerMult() * getElixirMult();
  if (newMult !== game.lastAppleMult && game.appleReadyTime > now) {
    const remReal = game.appleReadyTime - now;
    const remBase = remReal / game.lastAppleMult;
    game.appleReadyTime = now + remBase * newMult;
    game.appleCdDuration = game.appleCdDuration / game.lastAppleMult * newMult;
    game.lastAppleMult = newMult;
    saveGame();
  }

  const fill = document.getElementById('appleCdFill');
  const txt = document.getElementById('appleCdText');
  if (fill && txt) {
    if (game.appleReadyTime > now) {
      const remReal = game.appleReadyTime - now;
      const total = game.appleCdDuration || 3000;
      const pct = Math.min(100, Math.max(0, (1 - remReal / total) * 100));
      fill.style.width = pct + '%';

      const durationMult = game.lastAppleMult || 1;
      const remGame = remReal / durationMult;
      txt.textContent = (remGame / 1000).toFixed(1) + 's';
      document.getElementById('startAppleBtn').disabled = true;
    } else {
      fill.style.width = '0%';
      txt.textContent = '0.0s';
      document.getElementById('startAppleBtn').disabled = false;
    }
  }
}

function updateSkyUI() {
  const el = document.getElementById('windowSky');
  const body = document.getElementById('celestialBody');
  if (!el || !game) return;
  const h = game.timeMinutes / 60;

  let c1, c2;

  if (h >= 6 && h < 12) {
      c1 = '#2c1e4a'; c2 = '#f4a261';
  } else if (h >= 12 && h < 18) {
      c1 = '#4a90e2'; c2 = '#a1c4fd';
  } else if (h >= 18 && h < 24) {
      c1 = '#e76f51'; c2 = '#f4a261';
  } else {
      c1 = '#0b0b0f'; c2 = '#1a1228';
  }

  el.style.background = `linear-gradient(180deg, ${c1}, ${c2})`;

  if (body) {
    if (h >= 6 && h < 24) {
      body.textContent = '☀️';
      const progress = (h - 6) / 18;
      body.style.left = (progress * 100) + '%';
      body.style.top = (100 - Math.sin(progress * Math.PI) * 80) + '%';
    } else {
      body.textContent = '🌙';
      const progress = h / 6;
      body.style.left = (progress * 100) + '%';
      body.style.top = (100 - Math.sin(progress * Math.PI) * 80) + '%';
    }
  }
}

function updateClockUI() {
  const el = document.getElementById('workClock');
  if (!el || !game) return;
  if (game.hasClock) {
    el.classList.remove('hidden');
    el.textContent = 'Time: ' + formatGameTime(game.timeMinutes);
  } else {
    el.classList.add('hidden');
  }
}

function updateHungerUI() {
  const fill = document.getElementById('satietyFill');
  const text = document.getElementById('satietyText');
  if (!fill || !text || !game) return;

  fill.style.width = game.satiety + '%';
  text.textContent = game.satiety + '% Satiety (' + (1 / getHungerMult()).toFixed(2) + 'x)';

  if (game.satiety > 70) fill.style.backgroundColor = '#a8c256';
  else if (game.satiety > 40) fill.style.backgroundColor = '#f4a261';
  else if (game.satiety > 15) fill.style.backgroundColor = '#e76f51';
  else fill.style.backgroundColor = '#b85a7a';

  document.getElementById('invApples').textContent = game.apples;
  document.getElementById('invElixirs').textContent = game.elixirs;
}

function renderCalendar() {
  const el = document.getElementById('calendarDisplay');
  const txt = document.getElementById('calendarDay');
  if (!el || !txt || !game) return;
  if (game.calendarLevel > 0) {
    el.classList.remove('hidden');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    txt.textContent = days[game.dayOfWeek];
    if (game.dayOfWeek >= 5) {
      el.classList.add('weekend');
    } else {
      el.classList.remove('weekend');
    }
  } else {
    el.classList.add('hidden');
  }
}

function startSwordMeter() {
  if (swordRAF) return;
  swordRAF = requestAnimationFrame(animateSwordMeterRAF);
}

function stopSwordMeter() {
  if (swordRAF) { cancelAnimationFrame(swordRAF); swordRAF = null; }
}

function animateSwordMeterRAF() {
  if (!game) { swordRAF = null; return; }
  if (!swordStartTime) swordStartTime = performance.now();
  
  if (!swordAnimating) {
    const elapsed = performance.now() - swordStartTime;
    const cycle = (elapsed * 0.39) % 200;
    swordMeterVal = cycle <= 100 ? cycle : 200 - cycle;
    
    if (game.selectedJobId === 'sword' && !game.slaves['sword']) {
      const fill = document.getElementById('swordMeterFill');
      if (fill) fill.style.height = swordMeterVal + '%';
    }
  }
  swordRAF = requestAnimationFrame(animateSwordMeterRAF);
}

function getSwordPowerAtClick() {
  if (!swordStartTime) return 0;
  const elapsed = performance.now() - swordStartTime;
  const cycle = (elapsed * 0.39) % 200;
  return Math.floor(cycle <= 100 ? cycle : 200 - cycle);
}

function getApplePosAtClick() {
  if (!appleStartTime) return applePos;
  const elapsed = performance.now() - appleStartTime;
  const cycle = (elapsed * 0.080) % 200;
  return cycle <= 100 ? cycle : 200 - cycle;
}

function animateAppleRAF() {
  if (!appleGameActive) { appleRAF = null; return; }
  const elapsed = performance.now() - appleStartTime;
  const cycle = (elapsed * 0.080) % 200;
  applePos = cycle <= 100 ? cycle : 200 - cycle;
  
  const ptr = document.getElementById('applePointer');
  if (ptr) ptr.style.left = applePos + '%';
  appleRAF = requestAnimationFrame(animateAppleRAF);
}

function startAppleGame() {
  if (!game) return;
  const btn = document.getElementById('startAppleBtn');
  if (game.appleReadyTime > Date.now()) {
    triggerError(btn);
    return;
  }
  if (appleGameActive) {
    pickApple();
    return;
  }

  btn.classList.remove('btn-success', 'btn-fail');
  btn.textContent = 'Pick!';
  appleGameActive = true;
  appleGreenStart = Math.floor(Math.random() * 80) + 10;

  document.getElementById('appleGreenZone').style.left = appleGreenStart + '%';
  document.getElementById('applePointer').style.display = 'block';
  document.getElementById('appleTrack').classList.remove('hidden');

  applePos = 0;
  appleStartTime = performance.now();
  
  if (appleRAF) cancelAnimationFrame(appleRAF);
  appleRAF = requestAnimationFrame(animateAppleRAF);
}

function pickApple() {
  if (!game || !appleGameActive) return;

  const exactPos = getApplePosAtClick();
  appleGameActive = false;
  if (appleRAF) { cancelAnimationFrame(appleRAF); appleRAF = null; }

  document.getElementById('applePointer').style.display = 'none';
  document.getElementById('appleTrack').classList.add('hidden');

  const btn = document.getElementById('startAppleBtn');
  btn.disabled = true;

  let cdMs = 0;
  const baseSuccessCd = 3000 + (game.basketLevel * 2000);

  if (exactPos >= appleGreenStart && exactPos <= appleGreenStart + 10) {
    btn.classList.add('btn-success');
    btn.textContent = 'Success!';
    const gained = game.basketLevel + 1;
    game.apples += gained;
    cdMs = applyCooldownMult(baseSuccessCd);
  } else {
    btn.classList.add('btn-fail');
    btn.textContent = 'Missed!';
    const baseMissCd = baseSuccessCd * 20;
    cdMs = applyCooldownMult(baseMissCd);
  }
  game.appleReadyTime = Date.now() + cdMs;
  game.appleCdDuration = cdMs;
  game.lastAppleMult = getHungerMult() * getElixirMult();

  saveGame();
  updateHungerUI();

  setTimeout(() => {
    btn.classList.remove('btn-success', 'btn-fail');
    btn.textContent = 'Pick Apples';
  }, 1000);
}

function eatApple(e) {
  if (!game || game.apples <= 0) {
    triggerError(e.target);
    return;
  }
  game.apples--;
  game.satiety = Math.min(100, game.satiety + 5);
  saveGame();
  updateHungerUI();
}

function drinkElixir(e) {
  if (!game || game.elixirs <= 0) {
    triggerError(e.target);
    return;
  }
  game.elixirs--;
  const now = Date.now();
  const currentEnd = game.elixirEndTime > now ? game.elixirEndTime : now;
  game.elixirEndTime = currentEnd + 150000;

  saveGame();
  updateHungerUI();
  updateBonusText();
}

function hitSword() {
  if (!game || game.selectedJobId !== 'sword' || game.slaves['sword']) return;

  const btn = document.getElementById('swordHitBtn');
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
    triggerError(btn);
    return;
  }

  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;
  if (isNight) {
    triggerNightPenalty('sword');
    return;
  }

  const power = getSwordPowerAtClick();
  document.getElementById('swordHitMarker').textContent = power + '%';

  swordHits += power;
  swordStrikes++;

  const textEl = document.getElementById('swordHitsText');

  if (swordStrikes >= 5) {
    const threshold = currentThreshold('sword');
    const success = swordHits >= threshold;

    btn.disabled = true;
    btn.textContent = 'Forging...';
    textEl.textContent = 'Final Power: ' + swordHits + ' / ' + threshold;
    textEl.style.transition = 'transform 0.2s, color 0.2s';
    textEl.style.color = '#f3e6c8';

    swordAnimating = true;

    let pulseCount = 0;
    const pulseInterval = setInterval(() => {
      textEl.style.transform = textEl.style.transform === 'scale(1.2)' ? 'scale(1)' : 'scale(1.2)';
      pulseCount++;
      if (pulseCount >= 6) {
        clearInterval(pulseInterval);
        textEl.style.transform = 'scale(1)';
      }
    }, 200);

    setTimeout(() => {
      swordAnimating = false;
      swordStartTime = performance.now();
      if (success) {
        game.workClicks++;
        let pay = currentPay('sword');
        const mult = getActionMultiplier();
        pay = round2(pay * mult);

        game.money = round2(game.money + pay);
        const cd = applyCooldownMult(baseCooldown('sword'));
        game.workCooldownEnd = Date.now() + cd;
        game.lastCooldownDuration = cd;
        game.lastCooldownMult = getHungerMult() * getElixirMult();
        showFloatingMoney(pay, mult, false);
        startCooldownTicker();
        btn.classList.add('btn-success');
        btn.textContent = 'Success!';
        textEl.style.color = '#a8c256';

        document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
        updateAllBuyButtons();
        updateBonusText();
        triggerAnim(true);
      } else {
        const penalty = round2(currentPay('sword') * 2);
        game.money = round2(Math.max(0, game.money - penalty));
        const cd = applyCooldownMult(60000); 
        game.workCooldownEnd = Date.now() + cd;
        game.lastCooldownDuration = cd;
        game.lastCooldownMult = getHungerMult() * getElixirMult();
        showFloatingPenalty(penalty);
        startCooldownTicker();
        btn.classList.add('btn-fail');
        btn.textContent = 'Failed!';
        textEl.style.color = '#b85a7a';

        document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
        updateAllBuyButtons();
        updateBonusText();
        triggerAnim(false);

        setTimeout(() => {
          showModal('Failed!', 'The sword broke! Matilda fined you ' + formatMoney(penalty) + '.', 'Accept', null, () => {
            closeModal();
          }, closeModal, 'small-modal');
        }, 600);
      }

      setTimeout(() => {
        document.getElementById('swordHitsText').textContent = 'Hits: 0 / 5';
        document.getElementById('swordHitMarker').textContent = '0%';
        swordStrikes = 0;
        swordHits = 0;
        updateWorkButton();
        if (game.selectedJobId === 'sword') {
           document.getElementById('swordHitsText').textContent = 'Hit Power: ' + swordHits + ' / ' + currentThreshold('sword');
        }
      }, 2500);

    }, 1500); 
  } else {
    textEl.textContent = 'Hit Power: ' + swordHits + ' / ' + currentThreshold('sword');
    textEl.style.transition = 'transform 0.1s';
    textEl.style.transform = 'scale(1.1)';
    setTimeout(() => textEl.style.transform = 'scale(1)', 100);
  }
  saveGame();
}

function generateLawnCurve() {
  lawnPoints = [];
  const angle = Math.random() * Math.PI * 2;
  const freq = 0.02 + Math.random() * 0.03;
  for (let x = 20; x <= 300; x += 2) {
    const y = 50 + Math.sin(x * freq + angle) * 30;
    lawnPoints.push({x, y, traced: false});
  }
}

function startLawnGame() {
  if (!game || game.selectedJobId !== 'lawn' || game.slaves['lawn']) return;
  const btn = document.getElementById('lawnStartBtn');
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
    triggerError(btn);
    return;
  }

  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;
  if (isNight) {
    triggerNightPenalty('lawn');
    return;
  }

  btn.classList.remove('btn-success', 'btn-fail', 'btn-cooldown');
  btn.textContent = 'Mowing...';
  btn.disabled = true;
  isLawnDrawing = false;
  lawnStarted = false;
  lawnProgress = 0;
  lawnAccuracy = 100;
  document.getElementById('lawnStatusText').textContent = 'Hold near the start dot';
  document.getElementById('lawnAccText').textContent = 'Accuracy: 100.00%';
  document.getElementById('lawnAccFill').style.width = '100%';
  generateLawnCurve();
  drawLawn();
}

function setupLawnCanvas() {
  const canvas = document.getElementById('lawnCanvas');
  if (!canvas) return;
  lawnCtx = canvas.getContext('2d');

  if (lawnPoints.length === 0) generateLawnCurve();

  canvas.onmousedown = (e) => {
    if (lawnStarted) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const startPt = lawnPoints[0];
    const dist = Math.hypot(startPt.x - x, startPt.y - y);
    if (dist < 25) {
        lawnStarted = true;
        isLawnDrawing = true;
        lastMouseX = x;
        lastMouseY = y;
        document.getElementById('lawnStatusText').textContent = 'Tracing...';
    }
  };

  canvas.onmousemove = (e) => {
    if (!isLawnDrawing) return;
    const rect = canvas.getBoundingClientRect();
    lastMouseX = e.clientX - rect.left;
    lastMouseY = e.clientY - rect.top;
    checkLawnAccuracy(lastMouseX, lastMouseY);
  };

  window.onmouseup = () => {
    if (isLawnDrawing) {
      isLawnDrawing = false;
      failLawnJob();
    }
  };

  drawLawn();
}

function checkLawnAccuracy(x, y) {
  if (!isLawnDrawing) return;

  let minDist = Infinity;
  let closestIdx = -1;

  lawnPoints.forEach((p, idx) => {
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < minDist) {
      minDist = d;
      closestIdx = idx;
    }
  });

  let drop = 0;
  if (minDist > 3) {
    drop = 0.05 + (minDist * 0.015);
  } else if (minDist > 1) {
    drop = 0.01 + (minDist * 0.005);
  }

  lawnAccuracy -= drop;
  document.getElementById('lawnAccFill').style.width = Math.max(0, lawnAccuracy) + '%';
  document.getElementById('lawnAccText').textContent = 'Accuracy: ' + Math.max(0, lawnAccuracy).toFixed(2) + '%';

  if (minDist <= 3) {
    for (let i = 0; i <= closestIdx; i++) {
       lawnPoints[i].traced = true;
    }
    lawnProgress = closestIdx / (lawnPoints.length - 1);
  }

  const { upg } = getJobData('lawn');
  const failThreshold = Math.max(50, 85 - (upg.precision * 3));

  if (lawnAccuracy < failThreshold) {
    isLawnDrawing = false;
    failLawnJob();
  } else if (closestIdx === lawnPoints.length - 1) {
    isLawnDrawing = false;
    finishLawnJob(true);
  }
  drawLawn(x, y);
}

function drawLawn(userX, userY) {
  if (!lawnCtx) return;
  lawnCtx.clearRect(0, 0, 320, 100);

  lawnCtx.lineJoin = 'round';
  lawnCtx.lineCap = 'round';

  lawnCtx.beginPath();
  lawnCtx.moveTo(lawnPoints[0].x, lawnPoints[0].y);
  for (let i = 1; i < lawnPoints.length; i++) {
    lawnCtx.lineTo(lawnPoints[i].x, lawnPoints[i].y);
  }
  lawnCtx.strokeStyle = '#5a4a6a';
  lawnCtx.lineWidth = 6;
  lawnCtx.stroke();

  lawnCtx.beginPath();
  for (let i = 1; i < lawnPoints.length; i++) {
    if (lawnPoints[i].traced) {
      lawnCtx.moveTo(lawnPoints[i-1].x, lawnPoints[i-1].y);
      lawnCtx.lineTo(lawnPoints[i].x, lawnPoints[i].y);
    }
  }
  lawnCtx.strokeStyle = '#a8c256';
  lawnCtx.lineWidth = 8;
  lawnCtx.stroke();

  const time = Date.now() / 200;
  const rad = 4 + Math.sin(time) * 2;

  lawnCtx.fillStyle = '#f3e6c8';
  lawnCtx.beginPath();
  lawnCtx.arc(lawnPoints[0].x, lawnPoints[0].y, rad, 0, Math.PI*2);
  lawnCtx.fill();

  const last = lawnPoints[lawnPoints.length-1];
  lawnCtx.beginPath();
  lawnCtx.arc(last.x, last.y, rad, 0, Math.PI*2);
  lawnCtx.fill();

  if (userX !== undefined && userY !== undefined) {
    lawnCtx.fillStyle = '#fff';
    lawnCtx.beginPath();
    lawnCtx.arc(userX, userY, 3, 0, Math.PI * 2);
    lawnCtx.fill();
  }
}

function finishLawnJob(success) {
  isLawnDrawing = false;
  const btn = document.getElementById('lawnStartBtn');
  btn.disabled = true;

  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;
  if (isNight) {
    triggerNightPenalty('lawn');
    document.getElementById('lawnStatusText').textContent = 'Caught by Matilda!';
    return;
  }

  if (success) {
    game.workClicks++;
    btn.classList.add('btn-success');
    btn.textContent = 'Success!';
    let pay = currentPay('lawn');
    const mult = getActionMultiplier();
    pay = round2(pay * mult);

    game.money = round2(game.money + pay);
    const cd = applyCooldownMult(baseCooldown('lawn'));
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingMoney(pay, mult, false);

    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(true);
  } else {
    btn.classList.add('btn-fail');
    btn.textContent = 'Failed!';
    const penalty = round2(currentPay('lawn') * 2);
    game.money = round2(Math.max(0, game.money - penalty));
    const cd = applyCooldownMult(30000); 
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingPenalty(penalty);
    showModal('Failed!', 'You ruined the lawn! Matilda fined you ' + formatMoney(penalty) + '.', 'Accept', null, () => {
        closeModal();
    }, closeModal, 'small-modal');

    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(false);
  }

  document.getElementById('lawnStatusText').textContent = success ? 'Success!' : 'Failed! Accuracy too low.';
  updateWorkButton();
  startCooldownTicker();
}

function failLawnJob() {
    finishLawnJob(false);
}

function startArmorerWork() {
  if (!game || game.selectedJobId !== 'armorer') return;
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
    triggerError(document.getElementById('armorerStartBtn'));
    return;
  }
  isCraftingActive = true;
  currentRecipeIndex = Math.floor(Math.random() * RECIPES.length);
  craftTableState.fill(null);
  renderArmorerUI();
}

function renderArmorerUI() {
  if (game.selectedJobId !== 'armorer') return;

  const startContainer = document.getElementById('armorerStartContainer');
  const craftContainer = document.getElementById('armorerCraftContainer');

  if (isCraftingActive) {
    startContainer.classList.add('hidden');
    craftContainer.classList.remove('hidden');
  } else {
    startContainer.classList.remove('hidden');
    craftContainer.classList.add('hidden');

    const btn = document.getElementById('armorerStartBtn');
    const onCooldown = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
    btn.disabled = !!onCooldown;
    btn.classList.toggle('btn-cooldown', !!onCooldown);
    if (onCooldown) btn.textContent = 'Cooldown...';
    else btn.textContent = 'Start Crafting';
    return;
  }

  document.getElementById('armorerOrderName').textContent = 'Order: ' + RECIPES[currentRecipeIndex].name;

  const table = document.getElementById('craftTable');
  table.innerHTML = '';
  for (let i = 0; i < 36; i++) {
    const slot = document.createElement('div');
    slot.className = 'craft-slot';
    slot.dataset.index = i;
    slot.textContent = craftTableState[i] || '';

    slot.ondragover = (e) => { e.preventDefault(); slot.classList.add('dragover'); };
    slot.ondragleave = () => { slot.classList.remove('dragover'); };
    slot.ondrop = (e) => {
      e.preventDefault();
      slot.classList.remove('dragover');
      if (!game.workCooldownEnd || Date.now() >= game.workCooldownEnd) {
        const res = e.dataTransfer.getData('text/plain');
        if (res) {
          craftTableState[i] = res;
          renderArmorerUI();
        }
      }
    };

    slot.onclick = () => {
      if (!game.workCooldownEnd || Date.now() >= game.workCooldownEnd) {
        if (isDeleteMode) {
          craftTableState[i] = null;
        } else if (selectedInvItem) {
          craftTableState[i] = selectedInvItem;
        }
        renderArmorerUI();
      }
    };

    table.appendChild(slot);
  }

  const invBar = document.getElementById('inventoryBar');
  invBar.innerHTML = '';
  RESOURCES.forEach(res => {
    const item = document.createElement('div');
    item.className = 'inv-item';
    if (selectedInvItem === res.id && !isDeleteMode) item.classList.add('selected');
    item.textContent = res.id;
    item.title = res.name;
    item.draggable = true;

    item.ondragstart = (e) => {
      e.dataTransfer.setData('text/plain', res.id);
      selectedInvItem = res.id;
      isDeleteMode = false;
      renderArmorerUI();
    };
    item.onclick = () => {
      isDeleteMode = false;
      selectedInvItem = selectedInvItem === res.id ? null : res.id;
      renderArmorerUI();
    };
    invBar.appendChild(item);
  });

  const delBtn = document.getElementById('deleteModeBtn');
  if (isDeleteMode) {
    delBtn.classList.add('active');
    selectedInvItem = null;
  } else {
    delBtn.classList.remove('active');
  }

  const btn = document.getElementById('craftBtn');
  const onCooldown = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
  btn.disabled = !!onCooldown;
  btn.classList.toggle('btn-cooldown', !!onCooldown);
}

function toggleDeleteMode() {
  isDeleteMode = !isDeleteMode;
  if (isDeleteMode) selectedInvItem = null;
  renderArmorerUI();
}

function clearCraftTable() {
  craftTableState.fill(null);
  renderArmorerUI();
}

function finishArmorerCraft() {
  if (!game || game.selectedJobId !== 'armorer' || !isCraftingActive) return;
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
    triggerError(document.getElementById('craftBtn'));
    return;
  }

  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;
  if (isNight) {
    triggerNightPenalty('armorer');
    return;
  }

  const recipe = RECIPES[currentRecipeIndex];
  let success = true;

  for (let i = 0; i < 36; i++) {
    if (craftTableState[i] !== recipe.grid[i]) {
      success = false;
      break;
    }
  }

  const btn = document.getElementById('craftBtn');
  btn.disabled = true;

  if (success) {
    game.workClicks++;
    btn.classList.add('btn-success');
    btn.textContent = 'Crafted!';

    let pay = currentPay('armorer');
    const mult = getActionMultiplier();
    pay = round2(pay * mult);

    game.money = round2(game.money + pay);
    const cd = applyCooldownMult(baseCooldown('armorer'));
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingMoney(pay, mult, false);
    startCooldownTicker();

    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(true);

    setTimeout(() => {
      isCraftingActive = false;
      craftTableState.fill(null);
      btn.classList.remove('btn-success');
      btn.textContent = 'Craft!';
      btn.disabled = false;
      renderArmorerUI();
    }, 1000);

  } else {
    btn.classList.add('btn-fail');
    btn.textContent = 'Failed!';

    const penalty = round2(currentPay('armorer') * 3);
    game.money = round2(Math.max(0, game.money - penalty));
    const cd = applyCooldownMult(90000); 
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingPenalty(penalty);
    startCooldownTicker();

    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(false);

    setTimeout(() => {
      const reset = () => {
        closeModal();
        isCraftingActive = false;
        craftTableState.fill(null);
        btn.classList.remove('btn-fail');
        btn.textContent = 'Craft!';
        renderArmorerUI();
      };
      showModal('Failed!', 'The armor is ruined! Matilda fined you ' + formatMoney(penalty) + '.', 'Accept', null, reset, reset, 'small-modal');
    }, 600);
  }
  saveGame();
}

function openRecipeBook() {
  currentBookPage = 0;
  showModal('Crafting Book', '<div id="bookContent"></div>', 'Close', null, closeModal, closeModal, 'book-modal');
  updateBookPageContent();
}

function updateBookPageContent() {
  const recipe = RECIPES[currentBookPage];
  let html = '<div class="book-page">';
  html += '<div class="book-recipe-name">' + recipe.name + '</div>';
  html += '<div class="book-grid">';
  for (let i = 0; i < 36; i++) {
    const val = recipe.grid[i];
    html += '<div class="book-slot">' + (val || '') + '</div>';
  }
  html += '</div>';
  html += '</div>';
  html += '<div class="book-nav">';
  html += '<button class="action-btn" onclick="prevBookPage()" ' + (currentBookPage === 0 ? 'disabled' : '') + '>&lt;</button>';
  html += '<div style="display:flex; align-items:center; color:#8a7fa5; font-size:12px;">Page ' + (currentBookPage + 1) + ' / ' + RECIPES.length + '</div>';
  html += '<button class="action-btn" onclick="nextBookPage()" ' + (currentBookPage === RECIPES.length - 1 ? 'disabled' : '') + '>&gt;</button>';
  html += '</div>';

  document.getElementById('bookContent').innerHTML = html;
}

function nextBookPage() {
  if (currentBookPage < RECIPES.length - 1) {
    currentBookPage++;
    updateBookPageContent();
  }
}

function prevBookPage() {
  if (currentBookPage > 0) {
    currentBookPage--;
    updateBookPageContent();
  }
}

function startWriterWork() {
  if (!game || game.selectedJobId !== 'writer') return;
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
    triggerError(document.getElementById('writerStartBtn'));
    return;
  }

  if (poems.length === 0) {
    alert("No poems loaded. Check poems.txt");
    return;
  }

  isWritingActive = true;
  const randomPoem = poems[Math.floor(Math.random() * poems.length)];
  currentPoemLines = randomPoem.split('\n').filter(l => l.length > 0);
  currentPoemText = currentPoemLines.join('\n').replace(/[’‘]/g, "'").replace(/[“”]/g, '"');

  writerIndex = 0;
  writerMistakeUsed = false;

  renderWriterUI();
}

function renderWriterUI() {
  if (game.selectedJobId !== 'writer') return;

  const startContainer = document.getElementById('writerStartContainer');
  const activeContainer = document.getElementById('writerActiveContainer');

  if (isWritingActive) {
    startContainer.classList.add('hidden');
    activeContainer.classList.remove('hidden');

    const container = document.getElementById('poemContainer');
    container.innerHTML = '';

    let globalIndex = 0;
    for (let l = 0; l < currentPoemLines.length; l++) {
      const lineDiv = document.createElement('div');
      lineDiv.style.marginBottom = '4px';

      const lineText = currentPoemLines[l];
      for (let c = 0; c < lineText.length; c++) {
        const span = document.createElement('span');
        span.className = 'poem-char';
        span.textContent = lineText[c];
        span.id = 'char-' + globalIndex;
        if (globalIndex === writerIndex) span.classList.add('current');
        if (globalIndex < writerIndex) span.classList.add('correct');

        lineDiv.appendChild(span);
        globalIndex++;
      }

      if (l < currentPoemLines.length - 1) {
        const span = document.createElement('span');
        span.className = 'poem-char';
        span.id = 'char-' + globalIndex;

        if (globalIndex === writerIndex) {
          span.textContent = '↵';
          span.classList.add('current');
        } else if (globalIndex < writerIndex) {
          span.textContent = '↵';
          span.classList.add('correct');
        } else {
          span.textContent = '';
        }

        lineDiv.appendChild(span);
        globalIndex++;
      }

      container.appendChild(lineDiv);
    }

    window.removeEventListener('keydown', handleWriterKeydown);
    window.addEventListener('keydown', handleWriterKeydown);

  } else {
    startContainer.classList.remove('hidden');
    activeContainer.classList.add('hidden');

    const btn = document.getElementById('writerStartBtn');
    const onCooldown = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
    btn.disabled = !!onCooldown;
    btn.classList.toggle('btn-cooldown', !!onCooldown);
    if (onCooldown) btn.textContent = 'Cooldown...';
    else btn.textContent = 'Start Writing';

    window.removeEventListener('keydown', handleWriterKeydown);
  }
}

const codeToChar = {
  'KeyA': 'a', 'KeyB': 'b', 'KeyC': 'c', 'KeyD': 'd', 'KeyE': 'e',
  'KeyF': 'f', 'KeyG': 'g', 'KeyH': 'h', 'KeyI': 'i', 'KeyJ': 'j',
  'KeyK': 'k', 'KeyL': 'l', 'KeyM': 'm', 'KeyN': 'n', 'KeyO': 'o',
  'KeyP': 'p', 'KeyQ': 'q', 'KeyR': 'r', 'KeyS': 's', 'KeyT': 't',
  'KeyU': 'u', 'KeyV': 'v', 'KeyW': 'w', 'KeyX': 'x', 'KeyY': 'y', 'KeyZ': 'z',
  'Space': ' ', 'Comma': ',', 'Period': '.', 'Quote': "'", 'Semicolon': ';', 'Slash': '/',
  'NumpadAdd': '+', 'NumpadSubtract': '-', 'NumpadMultiply': '*', 'NumpadDivide': '/'
};

function handleWriterKeydown(e) {
  if (!isWritingActive) return;

  if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Tab' || e.key === 'Shift' || e.key === 'Backspace' || e.key === 'Escape' || e.key === 'CapsLock') return;

  const expectedChar = currentPoemText[writerIndex];
  let typedChar = null;

  if (e.key === 'Enter') {
    typedChar = '\n';
  } else if (e.code.startsWith('Key') || e.code === 'Space' || e.code === 'Comma' || e.code === 'Period' || e.code === 'Quote' || e.code === 'Semicolon' || e.code === 'Slash') {
    typedChar = codeToChar[e.code];
  } else if (e.key.length === 1) {
    typedChar = e.key.toLowerCase();
  }

  if (!typedChar) return;

  e.preventDefault(); 

  if (typedChar === expectedChar) {
    const span = document.getElementById('char-' + writerIndex);
    if (span) {
      span.classList.remove('current');
      span.classList.remove('error');
      span.classList.add('correct');
    }
    writerIndex++;

    if (writerIndex < currentPoemText.length) {
      const nextSpan = document.getElementById('char-' + writerIndex);
      if (nextSpan) {
        nextSpan.classList.add('current');
        if (currentPoemText[writerIndex] === '\n') {
          nextSpan.textContent = '↵';
        }
      }
    } else {
      finishWriterJob(true);
    }
  } else {
    const upgrade = game.jobUpgrades['writer'] || { mistake: 0 };
    if (upgrade.mistake > 0 && !writerMistakeUsed) {
      writerMistakeUsed = true;
      const span = document.getElementById('char-' + writerIndex);
      if (span) {
        span.classList.add('error');
        setTimeout(() => span.classList.remove('error'), 1000); 
      }
    } else {
      finishWriterJob(false);
    }
  }
}

function finishWriterJob(success) {
  isWritingActive = false;
  window.removeEventListener('keydown', handleWriterKeydown);

  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;
  if (isNight) {
    triggerNightPenalty('writer');
    renderWriterUI();
    return;
  }

  if (success) {
    game.workClicks++;
    let pay = currentPay('writer');
    const mult = getActionMultiplier();
    pay = round2(pay * mult);

    game.money = round2(game.money + pay);
    const cd = applyCooldownMult(baseCooldown('writer'));
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingMoney(pay, mult, false);
    startCooldownTicker();

    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(true);
    renderWriterUI();

  } else {
    const penalty = round2(currentPay('writer') * 2);
    game.money = round2(Math.max(0, game.money - penalty));
    const cd = applyCooldownMult(60000);
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingPenalty(penalty);
    startCooldownTicker();

    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(false);
    renderWriterUI();

    showModal('Failed!', 'You ruined the poem! Matilda fined you ' + formatMoney(penalty) + '.', 'Accept', null, () => {
        closeModal();
    }, closeModal, 'small-modal');
  }
  saveGame();
}

function startScientistWork() {
  if (!game || game.selectedJobId !== 'scientist') return;
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
    triggerError(document.getElementById('scientistStartBtn'));
    return;
  }

  isResearchingActive = true;
  sciTasks = [];
  sciCurrentTaskIndex = 0;

  const upg = game.jobUpgrades['scientist'] || { degree: 1 };
  const degree = upg.degree || 1;

  if (degree === 1 || degree === 2) {
    const count = degree === 1 ? 10 : 7;
    for (let i = 0; i < count; i++) {
      let a = Math.floor(Math.random() * (degree === 1 ? 20 : 50)) + 1;
      let b = Math.floor(Math.random() * (degree === 1 ? 20 : 50)) + 1;
      let op, ans;
      if (degree === 1) {
        op = Math.random() < 0.5 ? '+' : '-';
        if (op === '+') { ans = a + b; } else { ans = Math.max(a, b) - Math.min(a, b); if (a < b) { const temp = a; a = b; b = temp; } }
      } else {
        op = Math.random() < 0.5 ? '*' : '/';
        if (op === '*') { ans = a * b; } else { ans = a; a = a * b; }
      }
      sciTasks.push({ type: 'math', question: `${a} ${op} ${b} =`, answer: ans });
    }
  } else if (degree === 3) {
    for (let i = 0; i < 5; i++) {
      const angle = Math.floor(Math.random() * 151) + 15;
      sciTasks.push({ type: 'angle', angle: angle });
    }
  } else if (degree === 4) {
    for (let t = 0; t < 3; t++) {
      const a = Math.floor(Math.random() * 100) + 20;
      const b = Math.floor(Math.random() * (140 - a)) + 20;
      const c = 180 - a - b;
      const angles = [a, b, c];
      for (let i = angles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [angles[i], angles[j]] = [angles[j], angles[i]];
      }
      sciTasks.push({ type: 'triangle', angles: angles });
    }
  } else if (degree === 5) {
    const shuffled = [...CHEM_EQUATIONS].sort(() => 0.5 - Math.random()).slice(0, 3);
    shuffled.forEach(rx => {
      sciTasks.push({ type: 'chem', eq: rx.eq, answers: rx.answers });
    });
  }

  document.getElementById('scientistStartContainer').classList.add('hidden');
  document.getElementById('scientistActiveContainer').classList.remove('hidden');
  renderScientistTask();
}

function formatChem(str) {
  if (!str) return '';
  let res = str.replace(/([A-Za-z\)])(\d+)/g, '$1<sub>$2</sub>');
  res = res.replace(/=/g, '→');
  res = res.replace(/\s*→\s*/g, ' → ');
  res = res.replace(/\s*\+\s*/g, ' + ');
  return `<span class="chem-text">${res}</span>`;
}

function renderScientistTask() {
  const task = sciTasks[sciCurrentTaskIndex];
  const taskText = document.getElementById('sciTaskText');
  const canvas = document.getElementById('sciCanvas');
  const submitBtn = document.getElementById('scientistSubmitBtn');

  taskText.style.display = 'none';
  taskText.innerHTML = '';
  taskText.classList.remove('chem-row');
  canvas.classList.add('hidden');

  if (task.type === 'math') {
    taskText.style.display = 'flex';
    taskText.innerHTML = `${task.question} <input type="text" class="sci-input" id="sci-input-0">`;
    setTimeout(() => document.getElementById('sci-input-0').focus(), 50);
  } else if (task.type === 'angle') {
    canvas.classList.remove('hidden');
    drawAngle(task.angle);

    taskText.style.display = 'flex';
    taskText.style.marginTop = '15px';
    taskText.innerHTML = `Angle: <input type="text" class="sci-input" id="sci-input-0" placeholder="°">`;
    setTimeout(() => document.getElementById('sci-input-0').focus(), 50);
  } else if (task.type === 'triangle') {
    canvas.classList.remove('hidden');
    drawTriangle(task.angles);

    taskText.style.display = 'flex';
    taskText.style.marginTop = '15px';
    taskText.innerHTML = `
      <input type="text" class="sci-input" id="sci-input-0" placeholder="A"> 
      <input type="text" class="sci-input" id="sci-input-1" placeholder="B"> 
      <input type="text" class="sci-input" id="sci-input-2" placeholder="C">`;
    setTimeout(() => document.getElementById('sci-input-0').focus(), 50);
  } else if (task.type === 'chem') {
    taskText.classList.add('chem-row');
    const parts = task.eq.split('_');
    let html = '';
    for (let i = 0; i < parts.length - 1; i++) {
      html += formatChem(parts[i]);
      html += `<input type="text" class="sci-input chem" id="sci-input-${i}">`;
    }
    html += formatChem(parts[parts.length - 1]);

    taskText.style.display = 'flex';
    taskText.innerHTML = html;
    setTimeout(() => document.getElementById('sci-input-0').focus(), 50);
  }

  if (sciCurrentTaskIndex === sciTasks.length - 1) {
    submitBtn.textContent = 'Submit Final';
  } else {
    submitBtn.textContent = 'Next';
  }

  submitBtn.disabled = false;
  submitBtn.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
}

function submitScientistTask() {
  if (!isResearchingActive) return;

  const task = sciTasks[sciCurrentTaskIndex];
  let success = true;
  const inputs = document.querySelectorAll('.sci-input');

  if (task.type === 'math') {
    const val = parseInt(inputs[0].value);
    if (val !== task.answer) { success = false; inputs[0].classList.add('error'); }
  } else if (task.type === 'angle') {
    const val = parseInt(inputs[0].value);
    if (isNaN(val) || Math.abs(val - task.angle) > 10) { success = false; inputs[0].classList.add('error'); }
  } else if (task.type === 'triangle') {
    const gA = parseInt(inputs[0].value);
    const gB = parseInt(inputs[1].value);
    const gC = parseInt(inputs[2].value);
    if (isNaN(gA) || Math.abs(gA - task.angles[0]) > 10) success = false;
    if (isNaN(gB) || Math.abs(gB - task.angles[1]) > 10) success = false;
    if (isNaN(gC) || Math.abs(gC - task.angles[2]) > 10) success = false;
    if (!success) inputs.forEach(inp => inp.classList.add('error'));
  } else if (task.type === 'chem') {
    for (let i = 0; i < task.answers.length; i++) {
      const val = parseInt(inputs[i].value);
      if (val !== task.answers[i]) {
        success = false;
        inputs[i].classList.add('error');
      }
    }
  }

  if (!success) {
    finishScientistJob(false, task);
    return;
  }

  if (sciCurrentTaskIndex < sciTasks.length - 1) {
    sciCurrentTaskIndex++;
    renderScientistTask();
  } else {
    finishScientistJob(true, null);
  }
}

function drawAngle(angle) {
  const canvas = document.getElementById('sciCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  canvas.width = 300 * dpr;
  canvas.height = 200 * dpr;
  canvas.style.width = '300px';
  canvas.style.height = '200px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, 300, 200);
  const cx = 150;
  const cy = 100;
  const r = 70;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, 0, angle * Math.PI / 180);
  ctx.fillStyle = 'rgba(168, 194, 86, 0.5)';
  ctx.fill();
  ctx.strokeStyle = '#a8c256';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#5a4a6a';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawTriangle(angles) {
  const canvas = document.getElementById('sciCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  canvas.width = 300 * dpr;
  canvas.height = 200 * dpr;
  canvas.style.width = '300px';
  canvas.style.height = '200px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, 300, 200);

  const A = angles[0];
  const B = angles[1];
  const C = angles[2];

  const sA = Math.sin(A * Math.PI / 180);
  const sB = Math.sin(B * Math.PI / 180);
  const sC = Math.sin(C * Math.PI / 180);

  const scale = 130 / Math.max(sA, sB, sC);
  const sideA = sA * scale;
  const sideB = sB * scale;
  const sideC = sC * scale;

  const Cx = (sideB * sideB - sideA * sideA + sideC * sideC) / (2 * sideC);
  const Cy = Math.sqrt(Math.max(0, sideB * sideB - Cx * Cx));

  const offsetX = (300 - sideC) / 2;
  const offsetY = 165;

  const ptA = { x: offsetX, y: offsetY };
  const ptB = { x: offsetX + sideC, y: offsetY };
  const ptC = { x: offsetX + Cx, y: offsetY - Cy };

  ctx.beginPath();
  ctx.moveTo(ptA.x, ptA.y);
  ctx.lineTo(ptB.x, ptB.y);
  ctx.lineTo(ptC.x, ptC.y);
  ctx.closePath();
  ctx.strokeStyle = '#a8c256';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(168, 194, 86, 0.2)';
  ctx.fill();

  ctx.fillStyle = '#a8c256';
  ctx.font = '16px Georgia';
  ctx.fillText('A', ptA.x - 15, ptA.y + 5);
  ctx.fillText('B', ptB.x + 5, ptB.y + 5);
  ctx.fillText('C', ptC.x, ptC.y - 10);
}

function finishScientistJob(success, failedTask) {
  isResearchingActive = false;

  const btn = document.getElementById('scientistSubmitBtn');
  btn.disabled = true;

  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;
  if (isNight) {
    triggerNightPenalty('scientist');
    return;
  }

  if (success) {
    game.workClicks++;
    let pay = currentPay('scientist');
    const mult = getActionMultiplier();
    pay = round2(pay * mult);

    game.money = round2(game.money + pay);
    const cd = applyCooldownMult(baseCooldown('scientist'));
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingMoney(pay, mult, false);
    startCooldownTicker();

    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(true);

    btn.classList.add('btn-success');
    btn.textContent = 'Success!';
    setTimeout(() => {
      document.getElementById('scientistActiveContainer').classList.add('hidden');
      document.getElementById('scientistStartContainer').classList.remove('hidden');
      btn.classList.remove('btn-success');
      renderScientistUI();
    }, 1000);

  } else {
    const penalty = round2(currentPay('scientist') * 3);
    game.money = round2(Math.max(0, game.money - penalty));
    const cd = applyCooldownMult(90000);
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingPenalty(penalty);
    startCooldownTicker();

    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(false);

    btn.classList.add('btn-fail');
    btn.textContent = 'Failed!';
    
    let failReason = "";
    if (failedTask) {
      if (failedTask.type === 'math') failReason = `Correct answer: ${failedTask.answer}`;
      if (failedTask.type === 'angle') failReason = `Correct angle: ${failedTask.angle}°`;
      if (failedTask.type === 'triangle') failReason = `Correct angles: A=${failedTask.angles[0]}°, B=${failedTask.angles[1]}°, C=${failedTask.angles[2]}°`;
      if (failedTask.type === 'chem') failReason = `Correct coefficients: ${failedTask.answers.join(', ')}`;
    }

    setTimeout(() => {
      const reset = () => {
        closeModal();
        document.getElementById('scientistActiveContainer').classList.add('hidden');
        document.getElementById('scientistStartContainer').classList.remove('hidden');
        btn.classList.remove('btn-fail');
        renderScientistUI();
      };
      showModal('Failed!', 'The research failed! Matilda fined you ' + formatMoney(penalty) + '.<br><br><span style="color:#a8c256; font-weight:bold;">' + failReason + '</span>', 'Accept', null, reset, reset, 'small-modal');
    }, 1000);
  }
  saveGame();
}

function renderScientistUI() {
  if (game.selectedJobId !== 'scientist') return;

  const startContainer = document.getElementById('scientistStartContainer');
  const activeContainer = document.getElementById('scientistActiveContainer');

  if (!isResearchingActive) {
    startContainer.classList.remove('hidden');
    activeContainer.classList.add('hidden');

    const btn = document.getElementById('scientistStartBtn');
    const onCooldown = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
    btn.disabled = !!onCooldown;
    btn.classList.toggle('btn-cooldown', !!onCooldown);
    if (onCooldown) btn.textContent = 'Cooldown...';
    else btn.textContent = 'Start Research';
  }
}

function processSlaves() {
  if (!game) return;
  let changed = false;
  const now = Date.now();
  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;

  let slaveMult = 1;
  if (game.calendarLevel > 0) {
    if (game.dayOfWeek === 5) slaveMult *= (game.calendarLevel === 3 ? 3 : 2);
    if (game.dayOfWeek === 6 && game.calendarLevel >= 2) slaveMult *= (game.calendarLevel === 3 ? 3 : 2);
  }

  JOBS.forEach(job => {
    if (game.slaves[job.id]) {
      if (!game.slaveNextWork[job.id]) game.slaveNextWork[job.id] = now;
      if (now >= game.slaveNextWork[job.id]) {
        const pay = round2(currentPay(job.id) * slaveMult);
        game.money = round2(game.money + pay);

        if (isNight) {
          game.slaveNightEarnings = (game.slaveNightEarnings || 0) + pay;
        }

        game.slaveNextWork[job.id] = now + applyCooldownMult(getSlaveCooldown(job.id));
        showFloatingMoney(pay, slaveMult, true);
        changed = true;
      }
    }
  });

  if (changed) {
    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    if (game.selectedJobId && game.slaves[game.selectedJobId]) {
        updateSelectedCooldownUI();
    }
  }
}

function updateSelectedCooldownUI() {
  if (!game.selectedJobId) return;
  const jobId = game.selectedJobId;
  const cd = applyCooldownMult(getSlaveCooldown(jobId));
  const nextWork = game.slaveNextWork[jobId] || Date.now();
  const remaining = Math.max(0, nextWork - Date.now());
  const pct = 1 - remaining / cd;
  const bar = document.getElementById('cooldownBar');
  const fill = document.getElementById('cooldownFill');
  const text = document.getElementById('cooldownText');

  if (remaining > 0) {
    bar.classList.remove('inactive');
    fill.style.width = Math.min(100, Math.max(0, pct * 100)) + '%';
    text.textContent = (remaining / 1000).toFixed(1) + 's';
  } else {
    fill.style.width = '0%';
    text.textContent = '0.0s';
  }
}

function switchTab(tab) {
  const activePanel = document.querySelector('.tab-panel.active');
  const oldTab = activePanel ? activePanel.id.replace('panel-', '') : null;

  if (oldTab === 'work' && tab !== 'work') {
    isLawnDrawing = false;
    lawnStarted = false;
  }

  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.remove('active');
  });
  document.getElementById('panel-' + tab).classList.add('active');
  if (tab === 'shop') renderShop();
  if (tab === 'garden') updateHungerUI();
  updateWorkButton();
  renderWorkArea();
}

function renderGame() {
  if (!game) return;
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderJobs();
  updateWorkButton();
  updateHint();
  updateBonusText();
  renderWorkArea();
  renderShop();
  updateHungerUI();
}

function renderWorkArea() {
  updateWorkButton();

  const isPlateJob = game.selectedJobId === 'plates' && !game.slaves['plates'];
  const isLawnJob = game.selectedJobId === 'lawn' && !game.slaves['lawn'];
  const isSwordJob = game.selectedJobId === 'sword' && !game.slaves['sword'];
  const isArmorerJob = game.selectedJobId === 'armorer' && !game.slaves['armorer'];
  const isWriterJob = game.selectedJobId === 'writer' && !game.slaves['writer'];
  const isScientistJob = game.selectedJobId === 'scientist' && !game.slaves['scientist'];

  document.getElementById('workBtnContainer').classList.toggle('hidden', isPlateJob || isLawnJob || isSwordJob || isArmorerJob || isWriterJob || isScientistJob);
  document.getElementById('plateContainer').classList.toggle('hidden', !isPlateJob);
  document.getElementById('lawnContainer').classList.toggle('hidden', !isLawnJob);
  document.getElementById('swordContainer').classList.toggle('hidden', !isSwordJob);
  document.getElementById('armorerContainer').classList.toggle('hidden', !isArmorerJob);
  document.getElementById('writerContainer').classList.toggle('hidden', !isWriterJob);
  document.getElementById('scientistContainer').classList.toggle('hidden', !isScientistJob);

  if (isPlateJob) {
    const maxPlates = currentPlates('plates');
    if (!game.plateLayout || game.plateLayout.length !== maxPlates) {
      generatePlateLayout(maxPlates);
    }
    renderPlateGrid();
  } else if (isSwordJob) {
    const sb = document.getElementById('swordHitBtn');
    if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
      sb.disabled = true;
      sb.classList.add('btn-cooldown');
      sb.classList.remove('btn-success', 'btn-fail');
      sb.textContent = 'Cooldown';
    } else {
      sb.disabled = false;
      sb.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
      sb.textContent = 'Strike!';
    }
    document.getElementById('swordHitsText').textContent = 'Hit Power: ' + swordHits + ' / ' + currentThreshold('sword');
    startSwordMeter();
  } else if (isLawnJob) {
    const lb = document.getElementById('lawnStartBtn');
    if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
      lb.disabled = true;
      lb.classList.add('btn-cooldown');
      lb.classList.remove('btn-success', 'btn-fail');
      lb.textContent = 'Cooldown';
    } else {
      lb.disabled = false;
      lb.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
      lb.textContent = 'Start Mowing';
    }
    generateLawnCurve();
    setupLawnCanvas();
  } else if (isArmorerJob) {
    renderArmorerUI();
  } else if (isWriterJob) {
    renderWriterUI();
  } else if (isScientistJob) {
    renderScientistUI();
  }
}

function generatePlateLayout(count) {
  const arr = Array.from({ length: count }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  game.plateLayout = arr;
  game.plateCurrentTarget = 1;
}

function renderPlateGrid() {
  const grid = document.getElementById('plateGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const isCooldown = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
  const count = game.plateLayout.length;
  const cols = Math.ceil(count / 2);
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  game.plateLayout.forEach(num => {
    const btn = document.createElement('button');
    btn.className = 'plate-btn';
    btn.textContent = num;
    btn.disabled = isCooldown || num < game.plateCurrentTarget;
    btn.onclick = () => clickPlate(num, btn);
    grid.appendChild(btn);
  });
}

function clickPlate(num, btn) {
  if (!game || game.selectedJobId !== 'plates' || game.slaves['plates']) return;
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) return;

  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;
  if (isNight) {
    triggerNightPenalty('plates');
    generatePlateLayout(currentPlates('plates'));
    renderPlateGrid();
    return;
  }

  if (num === game.plateCurrentTarget) {
    game.plateCurrentTarget++;
    const maxPlates = currentPlates('plates');
    if (game.plateCurrentTarget > maxPlates) {
      finishPlateJob();
    } else {
      btn.disabled = true;
      saveGame();
    }
  } else {
    btn.classList.add('error');
    game.plateCurrentTarget = 1;
    saveGame();
    setTimeout(() => {
      generatePlateLayout(currentPlates('plates'));
      renderPlateGrid();
    }, 300);
  }
}

function finishPlateJob() {
  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;
  if (isNight) {
    triggerNightPenalty('plates');
    generatePlateLayout(currentPlates('plates'));
    renderPlateGrid();
    return;
  }

  game.workClicks++;
  let pay = currentPay('plates');
  const mult = getActionMultiplier();
  pay = round2(pay * mult);

  const cd = applyCooldownMult(baseCooldown('plates'));
  game.money = round2(game.money + pay);
  game.workCooldownEnd = Date.now() + cd;
  game.lastCooldownDuration = cd;
  game.lastCooldownMult = getHungerMult() * getElixirMult();

  generatePlateLayout(currentPlates('plates'));
  saveGame();

  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  showFloatingMoney(pay, mult, false);
  updateWorkButton();
  updateAllBuyButtons();
  updateBonusText();
  renderPlateGrid();
  startCooldownTicker();
  triggerAnim(true);
}

function triggerNightPenalty(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  const basePenalty = round2(currentPay(job.id) * 12.5);
  const slavePenalty = game.slaveNightEarnings || 0;
  const totalPenalty = round2(basePenalty + slavePenalty);

  game.money = round2(Math.max(0, game.money - totalPenalty));
  game.slaveNightEarnings = 0;
  const cd = applyCooldownMult(30000);
  game.workCooldownEnd = Date.now() + cd;
  game.lastCooldownDuration = cd;
  game.lastCooldownMult = getHungerMult() * getElixirMult();

  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  showFloatingPenalty(totalPenalty);

  triggerAnim(false);

  const slaveText = slavePenalty > 0 ? '<div style="font-size: 11px; color: #8a7fa5; margin-bottom: 12px;">(Includes ' + formatMoney(slavePenalty) + ' from your slaves\' night shift)</div>' : '';

  const reset = () => {
    closeModal();
    startCooldownTicker();
  };

  showModal('Caught!', 
    '<div style="font-size: 13px; color: #b8a3d0; margin-bottom: 16px;">Matilda caught you working at night! She fined you:</div>' +
    '<div style="font-size: 36px; color: #b85a7a; font-weight: bold; text-shadow: 0 0 15px rgba(184,90,122,0.5); margin-bottom: 8px;">-' + formatMoney(totalPenalty) + '</div>' +
    slaveText +
    '<div style="font-size: 11px; color: #6b5a8a; font-style: italic;">You are locked out of work for 30s. Tip: check the time and sleep in Your Room.</div>', 
    'Accept', null, reset, reset, 'small-modal');

  updateWorkButton();
}

function getActionMultiplier() {
  let mult = 1;
  if (game.premiumLevel > 0 && game.workClicks % 10 === 0) {
    mult *= getPremiumMult();
  }
  if (game.calendarLevel > 0) {
    if (game.dayOfWeek === 5) mult *= (game.calendarLevel === 3 ? 3 : 2);
    if (game.dayOfWeek === 6 && game.calendarLevel >= 2) mult *= (game.calendarLevel === 3 ? 3 : 2);
  }
  return mult;
}

function renderJobs() {
  const list = document.getElementById('jobList');
  list.innerHTML = '';
  JOBS.forEach(job => {
    const hired = game.hiredJobs.includes(job.id);
    const selected = game.selectedJobId === job.id;
    const pay = currentPay(job.id);
    const cd = baseCooldown(job.id);
    const { upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv } = getJobData(job.id);

    const item = document.createElement('div');
    item.className = 'job-item' + (hired ? ' hired' : '') + (selected ? ' selected' : '');
    item.id = 'job-card-' + job.id;

    const statsHtml = hired
      ? '<div class="job-stats">' +
          '<span><span class="label">Pay:</span> <span id="job-' + job.id + '-pay">' + formatMoney(pay) + '</span></span>' +
          '<span><span class="label">Cooldown:</span> <span id="job-' + job.id + '-cd">' + (cd / 1000).toFixed(1) + 's</span></span>' +
        '</div>'
      : '<div class="job-stats"><span><span class="label">Base pay:</span> ' + formatMoney(job.basePay) + '</span></div>';

    let actionsHtml = '';
    if (hired) {
      const isSlave = !!game.slaves[job.id];
      actionsHtml = 
        '<button class="select-btn" ' + (selected || isSlave ? 'disabled' : '') + ' onclick="selectJob(\'' + job.id + '\')">' + (selected ? 'Selected' : (isSlave ? 'Automated' : 'Select')) + '</button>' +
        '<button class="upgrade-btn" onclick="toggleUpgradePanel(\'' + job.id + '\')">Upgrade</button>';
    } else {
      actionsHtml = '<button class="hire-btn" onclick="hireJob(\'' + job.id + '\', event)">Hire — ' + formatMoney(job.hireCost) + '</button>';
    }

    item.innerHTML =
      '<div class="job-header">' +
        '<div class="job-info">' +
          '<div class="job-name">' + job.name + '</div>' +
          '<div class="job-desc">' + job.desc + '</div>' +
          statsHtml +
        '</div>' +
        '<div class="job-actions">' + actionsHtml + '</div>' +
      '</div>' +
      (hired ? renderUpgradePanelHTML(job.id, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv) : '');

    list.appendChild(item);
  });
}

function renderUpgradePanelHTML(jobId, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv) {
  const isOpen = openUpgradePanels[jobId] ? ' open' : '';
  return '<div class="upgrade-wrapper' + isOpen + '" id="upg-wrap-' + jobId + '">' +
    '<div class="upgrade-inner">' +
      renderUpgradeInnerHTML(jobId, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv) +
    '</div>' +
  '</div>';
}

function renderUpgradeInnerHTML(jobId, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv) {
  const isSlave = !!game.slaves[jobId];
  const stamMaxed = upg.stamina >= stamMaxLv;
  const earnMaxed = upg.earnings >= earnMaxLv;
  const platesMaxed = upg.plates >= plateMaxLv;
  const precMaxed = upg.precision >= precMaxLv;

  const { job, mistakeMaxLv, degreeMaxLv } = getJobData(jobId);
  const mistakeMaxed = mistakeMaxLv === 0 || upg.mistake >= mistakeMaxLv;
  const degreeMaxed = degreeMaxLv === 0 || (upg.degree || 1) >= degreeMaxLv;

  const allMaxed = stamMaxed && earnMaxed && (plateMaxLv === 0 || platesMaxed) && (precMaxLv === 0 || precMaxed) && mistakeMaxed && degreeMaxed;

  const cd = baseCooldown(jobId);
  const nextCd = Math.max(job.maxCd, cd - job.cdStep);
  const pay = currentPay(jobId);
  const nextPay = Math.min(job.maxPay, round2(pay + job.payStep));

  let html = '';

  if (allMaxed && !isSlave) {
    html += '<div class="maxed-text">All stats maxed out.</div>';
  } else if (!isSlave) {
    const stamC = staminaCost(jobId);
    const earnC = earningsCost(jobId);
    const canStam = !stamMaxed && game.money >= stamC;
    const canEarn = !earnMaxed && game.money >= earnC;

    if (jobId !== 'armorer' && jobId !== 'writer' && jobId !== 'scientist') {
      html += 
        '<div class="upg-item">' +
          '<div class="upg-info">' +
            '<div class="upg-title">Stamina <span>Lv ' + upg.stamina + ' / ' + stamMaxLv + '</span></div>' +
            '<div class="upg-effect">-' + (job.cdStep/1000).toFixed(1) + 's cooldown per level</div>' +
            '<div class="upg-stats">' + (cd/1000).toFixed(1) + 's → ' + (nextCd/1000).toFixed(1) + 's</div>' +
          '</div>' +
          (stamMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : 
            '<button class="upg-buy" id="upg-stam-btn-' + jobId + '" onclick="buyUpgrade(\'' + jobId + '\', \'stamina\', event)" ' + (canStam ? '' : 'disabled') + '>' + formatMoney(stamC) + '</button>') +
        '</div>';
    }

    if (jobId !== 'scientist') {
      html += 
        '<div class="upg-item">' +
          '<div class="upg-info">' +
            '<div class="upg-title">Earnings <span>Lv ' + upg.earnings + ' / ' + earnMaxLv + '</span></div>' +
            '<div class="upg-effect">+' + formatMoney(job.payStep) + ' pay per level</div>' +
            '<div class="upg-stats">' + formatMoney(pay) + ' → ' + formatMoney(nextPay) + '</div>' +
          '</div>' +
          (earnMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : 
            '<button class="upg-buy" id="upg-earn-btn-' + jobId + '" onclick="buyUpgrade(\'' + jobId + '\', \'earnings\', event)" ' + (canEarn ? '' : 'disabled') + '>' + formatMoney(earnC) + '</button>') +
        '</div>';
    }

    if (job.basePlates) {
      const plates = currentPlates(jobId);
      const nextPlates = Math.max(job.minPlates, plates - job.plateStep);
      const platesC = platesCost(jobId);
      const canPlates = !platesMaxed && game.money >= platesC;

      html += 
        '<div class="upg-item">' +
          '<div class="upg-info">' +
            '<div class="upg-title">Capacity <span>Lv ' + upg.plates + ' / ' + plateMaxLv + '</span></div>' +
            '<div class="upg-effect">-' + job.plateStep + ' plates per level</div>' +
            '<div class="upg-stats">' + plates + ' plates → ' + nextPlates + ' plates</div>' +
          '</div>' +
          (platesMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : 
            '<button class="upg-buy" id="upg-plates-btn-' + jobId + '" onclick="buyUpgrade(\'' + jobId + '\', \'plates\', event)" ' + (canPlates ? '' : 'disabled') + '>' + formatMoney(platesC) + '</button>') +
        '</div>';
    }

    if (job.precBase) {
      const precC = precisionCost(jobId);
      const canPrec = !precMaxed && game.money >= precC;
      let effectText = '';

      if (job.id === 'sword') {
        const currentT = currentThreshold(jobId);
        const nextT = Math.max(job.minThreshold, currentT - 7);
        effectText = 'Threshold: ' + currentT + (precMaxed ? '' : ' → ' + nextT);
      } else if (job.id === 'lawn') {
        const currentT = Math.max(50, 85 - (upg.precision * 3));
        const nextT = Math.max(50, 85 - ((upg.precision + 1) * 3));
        effectText = 'Fail threshold: ' + currentT + '%' + (precMaxed ? '' : ' → ' + nextT + '%');
      }

      html += 
        '<div class="upg-item">' +
          '<div class="upg-info">' +
            '<div class="upg-title">Precision <span>Lv ' + upg.precision + ' / ' + precMaxLv + '</span></div>' +
            '<div class="upg-effect">' + effectText + '</div>' +
          '</div>' +
          (precMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : 
            '<button class="upg-buy" id="upg-prec-btn-' + jobId + '" onclick="buyUpgrade(\'' + jobId + '\', \'precision\', event)" ' + (canPrec ? '' : 'disabled') + '>' + formatMoney(precC) + '</button>') +
        '</div>';
    }

    if (jobId === 'writer') {
      const mCost = mistakeCost(jobId);
      const canM = !mistakeMaxed && game.money >= mCost;

      html += 
        '<div class="upg-item">' +
          '<div class="upg-info">' +
            '<div class="upg-title">Draft <span>Lv ' + upg.mistake + ' / ' + mistakeMaxLv + '</span></div>' +
            '<div class="upg-effect">Allows 1 typo without failing</div>' +
          '</div>' +
          (mistakeMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : 
            '<button class="upg-buy" id="upg-mistake-btn-' + jobId + '" onclick="buyUpgrade(\'' + jobId + '\', \'mistake\', event)" ' + (canM ? '' : 'disabled') + '>' + formatMoney(mCost) + '</button>') +
        '</div>';
    }

    if (jobId === 'scientist') {
      const deg = upg.degree || 1;
      const dCost = degreeCost(jobId);
      const canD = !degreeMaxed && game.money >= dCost;

      html += 
        '<div class="upg-item">' +
          '<div class="upg-info">' +
            '<div class="upg-title">Degree <span>Lv ' + deg + ' / ' + degreeMaxLv + '</span></div>' +
            '<div class="upg-effect">Unlocks new research and raises pay.</div>' +
            '<div class="upg-stats">' + formatMoney(pay) + (degreeMaxed ? '' : ' → ' + formatMoney(dCost === 20000000 ? 3000000 : dCost === 30000000 ? 4800000 : dCost === 45000000 ? 7200000 : 12000000)) + '</div>' +
          '</div>' +
          (degreeMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : 
            '<button class="upg-buy" id="upg-degree-btn-' + jobId + '" onclick="buyUpgrade(\'' + jobId + '\', \'degree\', event)" ' + (canD ? '' : 'disabled') + '>' + formatMoney(dCost) + '</button>') +
        '</div>';
    }
  }

  if (isSlave) {
    html += '<div class="slave-assigned">Assigned to Slave (Automated)</div>';
  } else if (game.hasSlaveLicense) {
    const sCost = slaveCost(jobId);
    const canSlave = allMaxed && game.money >= sCost;
    const slaveHint = (jobId === 'lawn' || jobId === 'sword' || jobId === 'armorer' || jobId === 'writer' || jobId === 'scientist') ? ' (Auto-succeeds)' : '';
    html += '<div class="upg-item" style="border-top: 1px dashed #3a3350; padding-top: 8px; margin-top: 2px;">' +
      '<div class="upg-info">' +
        '<div class="upg-title">Slave</div>' +
        '<div class="upg-effect">Automates this job permanently' + slaveHint + '</div>' +
      '</div>' +
      '<button class="upg-buy" id="upg-slave-btn-' + jobId + '" ' + (canSlave ? '' : 'disabled') + ' onclick="buySlave(\'' + jobId + '\', event)">' + 
      (allMaxed ? 'Buy — ' + formatMoney(sCost) : 'Locked') + 
      '</button>' +
    '</div>';
  }

  return html;
}

function toggleUpgradePanel(jobId) {
  const wrapper = document.getElementById('upg-wrap-' + jobId);
  if (wrapper) {
    wrapper.classList.toggle('open');
    openUpgradePanels[jobId] = wrapper.classList.contains('open');
  }
}

function selectJob(jobId) {
  if (game.selectedJobId === jobId || game.slaves[jobId]) return;
  game.selectedJobId = jobId;
  saveGame();

  if (jobId === 'plates') {
    generatePlateLayout(currentPlates('plates'));
  }
  if (jobId === 'sword') {
    swordHits = 0;
    swordStrikes = 0;
    swordStartTime = 0;
    swordAnimating = false;
  }
  if (jobId === 'armorer') {
    isCraftingActive = false;
    craftTableState.fill(null);
  }
  if (jobId === 'writer') {
    isWritingActive = false;
  }
  if (jobId === 'scientist') {
    isResearchingActive = false;
  }
  isLawnDrawing = false;
  lawnStarted = false;

  renderJobs();
  updateWorkButton();
  renderWorkArea();
  updateBonusText();
}

function hireJob(jobId, e) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job || game.hiredJobs.includes(jobId)) return;
  if (game.money < job.hireCost) {
    triggerError(e.target);
    return;
  }

  game.money = round2(game.money - job.hireCost);
  game.hiredJobs.push(jobId);
  if (!game.selectedJobId) game.selectedJobId = jobId;

  if (!game.jobUpgrades[jobId]) {
    game.jobUpgrades[jobId] = { stamina: 0, earnings: 0, plates: 0, precision: 0, mistake: 0, degree: 1 };
  }
  saveGame();

  if (jobId === 'plates') {
    generatePlateLayout(currentPlates('plates'));
  }
  if (jobId === 'armorer') {
    isCraftingActive = false;
    craftTableState.fill(null);
  }
  if (jobId === 'writer') {
    isWritingActive = false;
  }
  if (jobId === 'scientist') {
    isResearchingActive = false;
  }

  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  openUpgradePanels[jobId] = true;
  renderJobs();
  updateWorkButton();
  updateHint();
  renderWorkArea();
}

function buyUpgrade(jobId, type, e) {
  const { upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv, mistakeMaxLv, degreeMaxLv } = getJobData(jobId);
  let cost, maxed;
  if (type === 'stamina') {
    maxed = upg.stamina >= stamMaxLv;
    cost = staminaCost(jobId);
  } else if (type === 'earnings') {
    maxed = upg.earnings >= earnMaxLv;
    cost = earningsCost(jobId);
  } else if (type === 'plates') {
    maxed = upg.plates >= plateMaxLv;
    cost = platesCost(jobId);
  } else if (type === 'precision') {
    maxed = upg.precision >= precMaxLv;
    cost = precisionCost(jobId);
  } else if (type === 'mistake') {
    maxed = upg.mistake >= mistakeMaxLv;
    cost = mistakeCost(jobId);
  } else if (type === 'degree') {
    maxed = (upg.degree || 1) >= degreeMaxLv;
    cost = degreeCost(jobId);
  }

  if (maxed) return;
  if (game.money < cost) {
    triggerError(e.target);
    return;
  }

  game.money = round2(game.money - cost);
  if (type === 'degree') {
    upg.degree = (upg.degree || 1) + 1;
  } else {
    upg[type]++;
  }
  saveGame();

  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  document.getElementById('job-' + jobId + '-pay').textContent = formatMoney(currentPay(jobId));
  document.getElementById('job-' + jobId + '-cd').textContent = (baseCooldown(jobId) / 1000).toFixed(1) + 's';

  if (jobId === 'plates' && type === 'plates') {
    generatePlateLayout(currentPlates(jobId));
  }

  const inner = document.querySelector('#upg-wrap-' + jobId + ' .upgrade-inner');
  if (inner) {
      inner.innerHTML = renderUpgradeInnerHTML(jobId, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv);
  }

  updateAllBuyButtons();
  renderWorkArea();
}

function buySlave(jobId, e) {
  if (game.slaves[jobId]) return;
  const cost = slaveCost(jobId);
  if (game.money < cost) {
    triggerError(e.target);
    return;
  }

  game.money = round2(game.money - cost);
  game.slaves[jobId] = true;
  game.slaveNextWork[jobId] = Date.now() + applyCooldownMult(getSlaveCooldown(jobId));

  if (game.selectedJobId === jobId) {
      game.selectedJobId = null;
  }

  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  openUpgradePanels[jobId] = true;
  renderJobs();
  updateWorkButton();
  renderWorkArea();
}

function updateAllBuyButtons() {
  JOBS.forEach(j => {
    if (game.hiredJobs.includes(j.id)) {
      const { upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv, mistakeMaxLv, degreeMaxLv } = getJobData(j.id);
      const stamMaxed = upg.stamina >= stamMaxLv;
      const earnMaxed = upg.earnings >= earnMaxLv;
      const platesMaxed = plateMaxLv === 0 || upg.plates >= plateMaxLv;
      const precMaxed = precMaxLv === 0 || upg.precision >= precMaxLv;
      const mistakeMaxed = mistakeMaxLv === 0 || upg.mistake >= mistakeMaxLv;
      const degreeMaxed = degreeMaxLv === 0 || (upg.degree || 1) >= degreeMaxLv;

      if (j.id !== 'armorer' && j.id !== 'writer' && j.id !== 'scientist' && !stamMaxed) {
        const btn = document.getElementById('upg-stam-btn-' + j.id);
        if (btn) btn.disabled = game.money < staminaCost(j.id);
      }
      if (j.id !== 'scientist' && !earnMaxed) {
        const btn = document.getElementById('upg-earn-btn-' + j.id);
        if (btn) btn.disabled = game.money < earningsCost(j.id);
      }
      if (j.basePlates && !platesMaxed) {
        const btn = document.getElementById('upg-plates-btn-' + j.id);
        if (btn) btn.disabled = game.money < platesCost(j.id);
      }
      if (j.precBase && !precMaxed) {
        const btn = document.getElementById('upg-prec-btn-' + j.id);
        if (btn) btn.disabled = game.money < precisionCost(j.id);
      }
      if (j.id === 'writer' && !mistakeMaxed) {
        const btn = document.getElementById('upg-mistake-btn-' + j.id);
        if (btn) btn.disabled = game.money < mistakeCost(j.id);
      }
      if (j.id === 'scientist' && !degreeMaxed) {
        const btn = document.getElementById('upg-degree-btn-' + j.id);
        if (btn) btn.disabled = game.money < degreeCost(j.id);
      }

      if (game.hasSlaveLicense && !game.slaves[j.id] && stamMaxed && earnMaxed && platesMaxed && precMaxed && degreeMaxed) {
        const btn = document.getElementById('upg-slave-btn-' + j.id);
        if (btn) btn.disabled = game.money < slaveCost(j.id);
      }
    }
  });
}

function updateHint() {
  const hint = document.getElementById('workHint');
  if (!game.hiredJobs.length) {
    hint.textContent = 'Hire a job to begin earning.';
    hint.classList.remove('hidden');
  } else {
    hint.classList.add('hidden');
  }
}

function updateBonusText() {
  const el = document.getElementById('bonusText');
  let html = '';
  if (game.premiumLevel > 0 && game.hiredJobs.length > 0) {
    const clicksMod = game.workClicks % 10;
    if (clicksMod === 9) {
      html += '<div>Premium: next act (x' + getPremiumMult().toFixed(1) + ')</div>';
    } else {
      html += '<div>Premium in: ' + (10 - clicksMod) + ' acts (x' + getPremiumMult().toFixed(1) + ')</div>';
    }
  }

  if (game.calendarLevel > 0 && (game.dayOfWeek === 5 || (game.dayOfWeek === 6 && game.calendarLevel >= 2))) {
      const mult = game.calendarLevel === 3 ? 3 : 2;
      html += `<div style="color: #f3e6c8; margin-top: 4px;">Weekend Bonus: x${mult} active</div>`;
  }

  if (game.selectedJobId) {
    const hMult = getHungerMult();
    const eMult = getElixirMult();
    const hSpeed = (1 / hMult).toFixed(2);

    html += `<div style="color: #b85a7a; margin-top: 4px; font-weight: bold;">Hunger: ${hSpeed}x speed</div>`;

    if (eMult < 1) {
        html += `<div style="color: #a8c256; margin-top: 4px;">Elixir: 2x speed</div>`;
    }
  }

  if (Date.now() < game.elixirEndTime) {
    const rem = Math.floor((game.elixirEndTime - Date.now()) / 1000);
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    html += `<div style="color: #a8c256; margin-top: 4px; font-size: 11px;">(${m}m ${s}s left)</div>`;
  }

  el.innerHTML = html;
}

function updateWorkButton() {
  const btn = document.getElementById('workBtn');
  if (!btn) return;
  const onCooldown = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
  btn.disabled = game.hiredJobs.length === 0 || !game.selectedJobId || !!onCooldown || !!game.slaves[game.selectedJobId];
  btn.classList.toggle('btn-cooldown', !!onCooldown);
}

function doWork() {
  if (!game || !game.selectedJobId || game.slaves[game.selectedJobId]) return;
  if (game.selectedJobId === 'plates' || game.selectedJobId === 'lawn' || game.selectedJobId === 'sword' || game.selectedJobId === 'armorer' || game.selectedJobId === 'writer' || game.selectedJobId === 'scientist') return;

  const now = Date.now();
  if (game.workCooldownEnd && now < game.workCooldownEnd) return;

  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;
  if (isNight) {
    triggerNightPenalty(game.selectedJobId);
    return;
  }

  const job = JOBS.find(j => j.id === game.selectedJobId);
  if (!job) return;

  game.workClicks++;
  let pay = currentPay(job.id);
  const mult = getActionMultiplier();
  pay = round2(pay * mult);

  const cd = applyCooldownMult(baseCooldown(job.id));
  game.money = round2(game.money + pay);
  game.workCooldownEnd = now + cd;
  game.lastCooldownDuration = cd;
  game.lastCooldownMult = getHungerMult() * getElixirMult();
  saveGame();

  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  showFloatingMoney(pay, mult, false);
  updateWorkButton();
  updateAllBuyButtons();
  updateBonusText();

  startCooldownTicker();
  triggerAnim(true);
}

function showFloatingMoney(amount, mult, isSlave) {
  const container = document.getElementById('balanceContainer');
  const el = document.createElement('div');
  el.className = 'floating-money' + (isSlave ? ' slave-money' : '');
  el.innerHTML = '+' + formatMoney(amount) + (mult > 1 ? '<span class="mult-text">(x' + mult.toFixed(1) + ')</span>' : '');
  container.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

function showFloatingPenalty(amount) {
  const container = document.getElementById('balanceContainer');
  const el = document.createElement('div');
  el.className = 'floating-money penalty-money';
  el.innerHTML = '-' + formatMoney(amount);
  container.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

function startCooldownTicker() {
  const bar = document.getElementById('cooldownBar');
  const fill = document.getElementById('cooldownFill');
  const text = document.getElementById('cooldownText');

  bar.classList.remove('inactive');
  renderPlateGrid();

  const sb = document.getElementById('swordHitBtn');
  if (sb && !sb.classList.contains('btn-success') && !sb.classList.contains('btn-fail')) {
    sb.classList.add('btn-cooldown');
    sb.disabled = true;
  }
  const lb = document.getElementById('lawnStartBtn');
  if (lb && !lb.classList.contains('btn-success') && !lb.classList.contains('btn-fail')) {
    lb.classList.add('btn-cooldown');
  }
  const stb = document.getElementById('armorerStartBtn');
  if (stb && !stb.classList.contains('btn-success') && !stb.classList.contains('btn-fail')) {
    stb.classList.add('btn-cooldown');
    stb.disabled = true;
  }
  const cb = document.getElementById('craftBtn');
  if (cb && !cb.classList.contains('btn-success') && !cb.classList.contains('btn-fail')) {
    cb.classList.add('btn-cooldown');
    cb.disabled = true;
  }
  const wb = document.getElementById('writerStartBtn');
  if (wb && !wb.classList.contains('btn-success') && !wb.classList.contains('btn-fail')) {
    wb.classList.add('btn-cooldown');
    wb.disabled = true;
  }
  const scib = document.getElementById('scientistStartBtn');
  if (scib && !scib.classList.contains('btn-success') && !scib.classList.contains('btn-fail')) {
    scib.classList.add('btn-cooldown');
    scib.disabled = true;
  }
  const subb = document.getElementById('scientistSubmitBtn');
  if (subb) {
    subb.disabled = true;
    subb.classList.add('btn-cooldown');
  }

  if (cooldownInterval) clearInterval(cooldownInterval);

  let durationMult = game.lastCooldownMult || 1;
  let endTime = game.workCooldownEnd;

  cooldownInterval = setInterval(() => {
    const now = Date.now();

    const newMult = getHungerMult() * getElixirMult();
    if (newMult !== durationMult) {
      const remReal = endTime - now;
      const remBase = remReal / durationMult;
      endTime = now + remBase * newMult;
      game.workCooldownEnd = endTime;

      game.lastCooldownDuration = game.lastCooldownDuration / durationMult * newMult;

      durationMult = newMult;
      game.lastCooldownMult = newMult;
      saveGame();
    }

    if (game.workCooldownEnd && now < game.workCooldownEnd) {
      const remReal = game.workCooldownEnd - now;
      let pct = 1 - (remReal / game.lastCooldownDuration);
      if (pct < 0) pct = 0;
      if (pct > 1) pct = 1;
      fill.style.width = (pct * 100) + '%';

      const remGame = remReal / durationMult;
      text.textContent = (remGame / 1000).toFixed(1) + 's';
    } else {
      game.workCooldownEnd = 0;
      saveGame();
      bar.classList.add('inactive');
      fill.style.width = '0%';
      text.textContent = '0.0s';
      clearInterval(cooldownInterval);
      cooldownInterval = null;
      updateWorkButton();
      renderPlateGrid();

      const sb = document.getElementById('swordHitBtn');
      if (sb) {
         sb.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
         sb.textContent = 'Strike!';
         sb.disabled = false;
      }
      const lb = document.getElementById('lawnStartBtn');
      if (lb) {
         lb.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
         lb.textContent = 'Start Mowing';
         lb.disabled = false;
      }
      const stb = document.getElementById('armorerStartBtn');
      if (stb) {
         stb.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
         stb.textContent = 'Start Crafting';
         stb.disabled = false;
      }
      const cb = document.getElementById('craftBtn');
      if (cb) {
         cb.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
         cb.textContent = 'Craft!';
         cb.disabled = false;
      }
      const wb = document.getElementById('writerStartBtn');
      if (wb) {
         wb.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
         wb.textContent = 'Start Writing';
         wb.disabled = false;
      }
      const scib = document.getElementById('scientistStartBtn');
      if (scib) {
         scib.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
         scib.textContent = 'Start Research';
         scib.disabled = false;
      }
      const subb = document.getElementById('scientistSubmitBtn');
      if (subb) {
         subb.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
         subb.textContent = 'Submit Answer';
      }

      renderArmorerUI();
      renderWriterUI();
      renderScientistUI();
    }
  }, 50);
}

function renderShop() {
  if (!game) return;
  const list = document.getElementById('shopList');
  list.innerHTML = '';

  const plvl = getPremiumLevel();
  const pprice = getPremiumPrice();
  const pmaxed = plvl >= 10;

  const pBtnText = pmaxed ? 'MAXED' : (plvl === 0 ? 'Buy — ' : 'Upgrade — ') + formatMoney(pprice);
  const pDisabled = pmaxed || game.money < pprice;
  const pCurrent = plvl > 0 ? 'Level ' + plvl + ' (x' + getPremiumMult().toFixed(1) + ' every 10 acts)' : 'Not owned';

  list.innerHTML += `
    <div class="shop-item">
      <div class="shop-info">
        <div class="shop-title">Premium</div>
        <div class="shop-desc">Every 10th work click yields an extra multiplier to your earnings.</div>
        <div class="shop-current">${pCurrent}</div>
      </div>
      <button class="shop-buy" onclick="buyPremium(event)" ${pDisabled ? 'disabled' : ''}>${pBtnText}</button>
    </div>
  `;

  const lBtnText = game.hasSlaveLicense ? 'OWNED' : 'Buy — ' + formatMoney(50);
  const lDisabled = game.hasSlaveLicense || game.money < 50;
  list.innerHTML += `
    <div class="shop-item">
      <div class="shop-info">
        <div class="shop-title">Slave License</div>
        <div class="shop-desc">Allows purchasing slaves for fully upgraded jobs. Slaves automate income.</div>
        <div class="shop-current">${game.hasSlaveLicense ? 'Owned' : 'Not owned'}</div>
      </div>
      <button class="shop-buy" onclick="buyLicense(event)" ${lDisabled ? 'disabled' : ''}>${lBtnText}</button>
    </div>
  `;

  const cBtnText = game.hasClock ? 'OWNED' : 'Buy — ' + formatMoney(1500);
  const cDisabled = game.hasClock || game.money < 1500;
  list.innerHTML += `
    <div class="shop-item">
      <div class="shop-info">
        <div class="shop-title">Pocket Clock</div>
        <div class="shop-desc">A small clock to keep track of time. Displays current time in the Work tab.</div>
        <div class="shop-current">${game.hasClock ? 'Owned' : 'Not owned'}</div>
      </div>
      <button class="shop-buy" onclick="buyClock(event)" ${cDisabled ? 'disabled' : ''}>${cBtnText}</button>
    </div>
  `;

  const bLvl = game.basketLevel;
  const bPrice = getBasketPrice();
  const bBtnText = bLvl >= 4 ? 'MAXED' : 'Upgrade — ' + formatMoney(bPrice);
  const bDisabled = bLvl >= 4 || game.money < bPrice;
  list.innerHTML += `
    <div class="shop-item">
      <div class="shop-info">
        <div class="shop-title">Harvesting Basket</div>
        <div class="shop-desc">Collect more apples at once, but increases the tree's cooldown.</div>
        <div class="shop-current">Level ${bLvl} (${bLvl+1} apples / ${3 + bLvl*2}s)</div>
      </div>
      <button class="shop-buy" onclick="buyBasket(event)" ${bDisabled ? 'disabled' : ''}>${bBtnText}</button>
    </div>
  `;

  const ePrice = getElixirPrice();
  list.innerHTML += `
    <div class="shop-item">
      <div class="shop-info">
        <div class="shop-title">Herbal Elixir</div>
        <div class="shop-desc">Halves all cooldowns for 5 in-game hours. (Consumable)</div>
        <div class="shop-current">Owned: ${game.elixirs}</div>
      </div>
      <button class="shop-buy" onclick="buyElixir(event)" ${game.money < ePrice ? 'disabled' : ''}>Buy — ${formatMoney(ePrice)}</button>
    </div>
  `;

  const calLvl = game.calendarLevel;
  const calPrice = getCalendarPrice();
  const calBtnText = calLvl >= 3 ? 'MAXED' : 'Upgrade — ' + formatMoney(calPrice);
  const calDisabled = calLvl >= 3 || game.money < calPrice;
  const calDesc = calLvl === 0 ? 'Unlocks weekend income bonus (Sat x2)' : calLvl === 1 ? 'Unlocks Sunday bonus (Sun x2)' : calLvl === 2 ? 'Triples weekend income (Sat/Sun x3)' : 'Maxed';

  list.innerHTML += `
    <div class="shop-item">
      <div class="shop-info">
        <div class="shop-title">Calendar</div>
        <div class="shop-desc">Shows the day of the week. ${calDesc}</div>
        <div class="shop-current">Level ${calLvl}</div>
      </div>
      <button class="shop-buy" onclick="buyCalendar(event)" ${calDisabled ? 'disabled' : ''}>${calBtnText}</button>
    </div>
  `;
}

function buyPremium(e) {
  if (game.premiumLevel >= 10) return;
  const price = getPremiumPrice();
  if (game.money < price) {
    triggerError(e.target);
    return;
  }
  game.money = round2(game.money - price);
  game.premiumLevel++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateAllBuyButtons();
  updateBonusText();
}

function buyLicense(e) {
  if (game.hasSlaveLicense) return;
  if (game.money < 50) {
    triggerError(e.target);
    return;
  }
  game.money = round2(game.money - 50);
  game.hasSlaveLicense = true;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateAllBuyButtons();
  renderJobs();
}

function buyClock(e) {
  if (game.hasClock) return;
  if (game.money < 1500) {
    triggerError(e.target);
    return;
  }
  game.money = round2(game.money - 1500);
  game.hasClock = true;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateAllBuyButtons();
  updateClockUI();
}

function buyBasket(e) {
  if (game.basketLevel >= 4) return;
  const price = getBasketPrice();
  if (game.money < price) {
    triggerError(e.target);
    return;
  }
  game.money = round2(game.money - price);
  game.basketLevel++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
}

function buyElixir(e) {
  const price = getElixirPrice();
  if (game.money < price) {
    triggerError(e.target);
    return;
  }
  game.money = round2(game.money - price);
  game.elixirs++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateHungerUI();
}

function buyCalendar(e) {
  if (game.calendarLevel >= 3) return;
  const price = getCalendarPrice();
  if (game.money < price) {
    triggerError(e.target);
    return;
  }
  game.money = round2(game.money - price);
  game.calendarLevel++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  renderCalendar();
}

function backToMenu() {
  stopAllIntervals();
  const bar = document.getElementById('cooldownBar');
  if (bar) bar.classList.add('inactive');
  document.getElementById('cooldownFill').style.width = '0%';
  document.getElementById('cooldownText').textContent = '0.0s';
  showMenu();
}

function checkWindow() {
  if (!game) return;
  let diff = game.timeMinutes - game.lastCurtainTime;
  if (diff < 0) diff += 1440;

  if (diff < 120) {
    showModal('Try Later', 'You cannot open the curtains yet. Try again later. You can only look out the window once every 2 in-game hours.', 'Close', null, closeModal, closeModal, 'small-modal');
    return;
  }
  game.lastCurtainTime = game.timeMinutes;
  saveGame();

  const cL = document.getElementById('curtainLeft');
  const cR = document.getElementById('curtainRight');
  if (cL && cR) {
    cL.classList.remove('closed');
    cR.classList.remove('closed');
    setTimeout(() => {
      cL.classList.add('closed');
      cR.classList.add('closed');
    }, 2000);
  }
}

function sleep() {
  if (!game) return;

  if (game.lastSleepDay === game.dayOfWeek) {
    showModal('Already Slept', 'You already slept today. To skip a work day, you must pay a fine of 35% of your balance. Sleep anyway?', 'Pay Fine', 'Cancel', () => {
      closeModal();
      executeSleep(true);
    }, closeModal, 'small-modal');
    return;
  }

  executeSleep(false);
}

function executeSleep(isForced) {
  const cL = document.getElementById('curtainLeft');
  const cR = document.getElementById('curtainRight');
  const overlay = document.getElementById('sleepOverlay');

  const proceed = () => {
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';

    setTimeout(() => {
      let cost = round2(game.money * 0.05);
      if (isForced) {
        cost += round2(game.money * 0.35);
      }

      if (cost > 0) {
        game.money = round2(game.money - cost);
        showFloatingPenalty(cost);
      }

      const totalMins = game.timeMinutes + 480;
      const daysPassed = Math.floor(totalMins / 1440);
      game.timeMinutes = totalMins % 1440;

      if (daysPassed > 0) {
        game.dayOfWeek = (game.dayOfWeek + daysPassed) % 7;
      }
      game.lastSleepDay = game.dayOfWeek;

      game.satiety = Math.max(0, game.satiety - 25);
      game.slaveNightEarnings = 0;
      updateSkyUI();
      updateClockUI();
      updateHungerUI();
      renderCalendar();
      saveGame();

      const endSleep = () => {
        closeModal();
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      };

      let costText = '';
      if (cost > 0) {
        const label = isForced ? 'Tax + Fine paid:' : 'Tax paid:';
        costText = '<div style="font-size: 12px; color: #b8a37a; margin-top: 4px;">' + label + ' ' + formatMoney(cost) + '</div>';
      }

      showModal('Slept', 
        '<div style="font-size: 16px; color: #e8e3d8; margin-bottom: 8px;">You slept for 8 hours.</div>' + 
        '<div style="font-size: 12px; color: #b8a37a; margin-top: 4px;">Satiety lost: -25%</div>' +
        costText, 
        'Close', null, endSleep, endSleep, 'small-modal');
      document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    }, 1000);
  };

  if (!cL.classList.contains('closed')) {
    cL.classList.add('closed');
    cR.classList.add('closed');
    setTimeout(proceed, 800);
  } else {
    proceed();
  }
}

setInterval(() => {
  if (!playTimer) {
    const gStats = getGlobalStats();
    gStats.totalPlayTime++;
    writeGlobalStats(gStats);
  }
}, 1000);

showMenu();