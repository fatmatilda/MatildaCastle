const SAVE_KEY = 'matilda_castle_save';
const GLOBAL_STATS_KEY = 'matilda_global_stats';
const CURRENT_VERSION = 'v0.1.15';

const JACKPOT_LEVELS = [100000, 1000000, 10000000, 100000000, 1000000000];
const JACKPOT_MULTS = [5, 10, 15, 20, 30];

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

const DEFAULT_JOBS = [
  { id: 'boxes', name: 'Carry Boxes', desc: 'A simple job. Haul crates from dawn till dusk.', hireCost: 0, basePay: 0.50, baseCd: 5000, maxPay: 1.25, maxCd: 3000, payStep: 0.05, cdStep: 200, stamBase: 1, stamMult: 1.15, earnBase: 0.5, earnMult: 1.15 },
  { id: 'dishes', name: 'Wash Dishes', desc: 'Scrub pots in the scullery. Pays better, but takes longer.', hireCost: 20, basePay: 5, baseCd: 10000, maxPay: 8, maxCd: 5000, payStep: 0.25, cdStep: 250, stamBase: 3, stamMult: 1.18, earnBase: 2, earnMult: 1.18 },
  { id: 'plates', name: 'Plate Sorting', desc: 'Arrange plates in order. One mistake resets the sequence.', hireCost: 300, basePay: 16, baseCd: 12000, maxPay: 40, maxCd: 6000, payStep: 1.6, cdStep: 300, stamBase: 50, stamMult: 1.18, earnBase: 40, earnMult: 1.18, basePlates: 16, minPlates: 10, plateStep: 1, plateBase: 100, plateMult: 1.18 },
  { id: 'lawn', name: 'Lawn Mowing', desc: 'Trace the line perfectly to cut the grass.', hireCost: 3500, basePay: 150, baseCd: 15000, maxPay: 300, maxCd: 8000, payStep: 15, cdStep: 350, stamBase: 200, stamMult: 1.18, earnBase: 500, earnMult: 1.18, precBase: 1000, precMult: 1.18, maxPrecLv: 10 },
  { id: 'sword', name: 'Sword Forging', desc: 'Hit the power meter as close to 100 as possible.', hireCost: 25000, basePay: 1500, baseCd: 20000, maxPay: 5000, maxCd: 10000, payStep: 350, cdStep: 500, stamBase: 3000, stamMult: 1.18, earnBase: 5000, earnMult: 1.18, precBase: 10000, precMult: 1.18, maxPrecLv: 10, baseThreshold: 465, minThreshold: 400 },
  { id: 'armorer', name: 'Armor Crafter', desc: 'Craft armor by looking at the recipe book.', hireCost: 300000, basePay: 20000, baseCd: 30000, maxPay: 125000, maxCd: 15000, payStep: 5000, cdStep: 1500, stamBase: 100000, stamMult: 1.18, earnBase: 20000, earnMult: 1.18 },
  { id: 'writer', name: 'Writer', desc: 'Type the poem without making a mistake.', hireCost: 4000000, basePay: 300000, baseCd: 45000, maxPay: 900000, maxCd: 25000, payStep: 30000, cdStep: 2000, stamBase: 1000000, stamMult: 1.18, earnBase: 50000, earnMult: 1.18 },
  { id: 'scientist', name: 'Scientist', desc: 'Solve complex problems and equations.', hireCost: 30000000, basePay: 2100000, baseCd: 60000, maxPay: 12000000, maxCd: 40000, payStep: 2000000, cdStep: 2000, stamBase: 10000000, stamMult: 1.0, earnBase: 10000000, earnMult: 1.0 },
  { id: 'chest', name: 'Chest Locker', desc: 'Pick Matilda\'s locks. Be careful not to break the pick.', hireCost: 150000000, basePay: 10000000, baseCd: 90000, maxPay: 100000000, maxCd: 60000, payStep: 5000000, cdStep: 3000, stamBase: 5000000, stamMult: 1.3, earnBase: 10000000, earnMult: 1.15, precBase: 20000000, precMult: 1.3, maxPrecLv: 10 }
];

const MARKET_ITEMS = [
  { id: 'spoon', name: 'Silver Spoon', base: 100 },
  { id: 'ring', name: 'Ruby Ring', base: 1000 },
  { id: 'goblet', name: 'Gold Goblet', base: 10000 },
  { id: 'amulet', name: 'Sapphire Amulet', base: 100000 },
  { id: 'crown', name: 'Emerald Crown', base: 1000000 },
  { id: 'scepter', name: 'Diamond Scepter', base: 10000000 },
  { id: 'throne', name: 'Obsidian Throne', base: 100000000 },
  { id: 'egg', name: 'Dragon Egg', base: 1000000000 },
  { id: 'grimoire', name: 'Ancient Grimoire', base: 10000000000 },
  { id: 'portrait', name: "Matilda's Portrait", base: 100000000000 }
];

const INVEST_ITEMS = [
  { id: 'bread', name: 'Bread Ration Bond', base: 100, rate: 0.006 },
  { id: 'ale', name: 'Ale Tax Bond', base: 1000, rate: 0.007 },
  { id: 'blacksmith', name: 'Blacksmith Charter', base: 10000, rate: 0.008 },
  { id: 'merchant', name: 'Merchant Guild Share', base: 100000, rate: 0.009 },
  { id: 'silk', name: 'Silk Route Bond', base: 1000000, rate: 0.010 },
  { id: 'mining', name: 'Mining Concession', base: 10000000, rate: 0.011 },
  { id: 'shipwright', name: 'Shipwright Note', base: 100000000, rate: 0.012 },
  { id: 'treasury', name: 'Royal Treasury Note', base: 1000000000, rate: 0.013 },
  { id: 'noble', name: 'Noble Estate Deed', base: 10000000000, rate: 0.014 },
  { id: 'endowment', name: 'Crown Endowment', base: 100000000000, rate: 0.015 }
];

const WINE_STAGES = [
  { id: 'raw', name: 'Raw', min: 0, max: 180, mult: 0.25, color: '#6b5a8a' },
  { id: 'normal', name: 'Normal', min: 180, max: 300, mult: 1, color: '#a8c256' },
  { id: 'good', name: 'Good', min: 300, max: 420, mult: 2, color: '#4a90e2' },
  { id: 'great', name: 'Great', min: 420, max: 510, mult: 3, color: '#b8a37a' },
  { id: 'legendary', name: 'Legendary', min: 510, max: 570, mult: 5, color: '#e76f51' },
  { id: 'exquisite', name: 'Exquisite', min: 570, max: 600, mult: 10, color: '#d4b8ff' },
  { id: 'spoiled', name: 'Spoiled', min: 600, max: Infinity, mult: 0.1, color: '#b85a7a' }
];

const MAX_BARRELS = 20;
const BUTLER_COST = 25000000;
const BUTLER2_COST = 75000000;
const DISTILLERY_COST = 5000000;

const OFFLINE_CAPS_HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48];
const OFFLINE_COSTS = [5000, 15000, 40000, 100000, 250000, 600000, 1200000, 2500000, 5000000, 9000000, 15000000, 25000000, 40000000, 65000000, 95000000, 130000000, 170000000, 200000000, 225000000, 250000000];

let CHEM_EQUATIONS = [];
let poems = [];
let JOBS = [];

let game = null;
let currentChapter = 1;

let cooldownInterval = null;
let slaveInterval = null;
let playTimer = null;
let appleRAF = null;
let swordRAF = null;
let lawnAnimInterval = null;
let uiInterval = null;
let marketTickInterval = null;
let investTickInterval = null;
let distilleryTickInterval = null;
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
let lastMouseX;
let lastMouseY;

let isCraftingActive = false;
let currentRecipeIndex = 0;
let currentBookPage = 0;
let selectedInvItem = null;
let isDeleteMode = false;
let craftTableState = new Array(36).fill(null);

let isWritingActive = false;
let currentPoemLines = [];
let currentPoemText = "";
let writerIndex = 0;
let writerMistakeUsed = false;

let isResearchingActive = false;
let sciTasks = [];
let sciCurrentTaskIndex = 0;

let openTresItemId = null;

let chestActive = false;
let chestAngle = 0;
let chestTarget = 0;
let chestIsTurning = false;
let chestJammed = false;
let chestJamStartTime = 0;
let chestJamLimit = 3000;
let chestRAF = null;
let chestLastFrame = 0; 