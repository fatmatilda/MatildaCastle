function getSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function writeSave(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function getGlobalStats() {
  let data = {
    totalPlayTime: 0,
    chapterStats: { 1: { started: 0, completed: 0, totalTime: 0 } }
  };
  try {
    const parsed = JSON.parse(localStorage.getItem(GLOBAL_STATS_KEY));
    if (parsed) {
      data.totalPlayTime = parsed.totalPlayTime || 0;
      data.chapterStats = parsed.chapterStats || data.chapterStats;
    }
  } catch (e) {}
  if (!data.chapterStats[1]) {
    data.chapterStats[1] = { started: 0, completed: 0, totalTime: 0 };
  }
  return data;
}

function writeGlobalStats(data) {
  localStorage.setItem(GLOBAL_STATS_KEY, JSON.stringify(data));
}

function hasSave(chapter) {
  const data = getSave();
  return !!(data && data[chapter] && data[chapter].started);
}

function saveGame() {
  if (!game) return;
  game.lastQuitTime = Date.now();
  const data = getSave();
  data[currentChapter] = game;
  writeSave(data);
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

  const hiredJobs = Array.isArray(s.hiredJobs) ? s.hiredJobs.slice() : [];
  let selectedJobId = s.selectedJobId || null;
  if (selectedJobId && !hiredJobs.includes(selectedJobId)) {
    selectedJobId = hiredJobs.length > 0 ? hiredJobs[0] : null;
  }

  let marketItems = s.marketItems;
  if (!marketItems) {
    marketItems = MARKET_ITEMS.map(i => ({
      id: i.id,
      currentPrice: i.base,
      history: [i.base],
      streak: 0,
      owned: 0,
      totalInvested: 0
    }));
  } else {
    MARKET_ITEMS.forEach(item => {
      const existing = marketItems.find(m => m.id === item.id);
      if (!existing) {
        marketItems.push({
          id: item.id,
          currentPrice: item.base,
          history: [item.base],
          streak: 0,
          owned: 0,
          totalInvested: 0
        });
      } else {
        if (!existing.history) existing.history = [item.base, existing.currentPrice];
        if (typeof existing.totalInvested !== 'number') existing.totalInvested = 0;
      }
    });
  }

  let investmentItems = s.investmentItems;
  if (!investmentItems) {
    investmentItems = INVEST_ITEMS.map(i => ({
      id: i.id,
      currentPrice: i.base,
      history: [i.base],
      lastTick: Date.now(),
      owned: 0,
      totalInvested: 0
    }));
  } else {
    INVEST_ITEMS.forEach(item => {
      const existing = investmentItems.find(m => m.id === item.id);
      if (!existing) {
        investmentItems.push({
          id: item.id,
          currentPrice: item.base,
          history: [item.base],
          lastTick: Date.now(),
          owned: 0,
          totalInvested: 0
        });
      } else {
        if (!existing.history) existing.history = [item.base, existing.currentPrice];
        if (typeof existing.totalInvested !== 'number') existing.totalInvested = 0;
      }
    });
  }

  return {
    started: !!s.started,
    money: typeof s.money === 'number' ? s.money : 0,
    hiredJobs: hiredJobs,
    selectedJobId: selectedJobId,
    jobUpgrades: upgrades,
    slaves: s.slaves || {},
    slaveNextWork: s.slaveNextWork || {},
    hasSlaveLicense: !!s.hasSlaveLicense,
    hasClock: !!s.hasClock,
    hasPassiveIncomeMeter: !!s.hasPassiveIncomeMeter,
    hasTreasury: !!s.hasTreasury,
    hasDistillery: !!s.hasDistillery,
    grapeLevel: typeof s.grapeLevel === 'number' ? s.grapeLevel : 1,
    hasButler: !!s.hasButler,
    butlerOn: !!s.butlerOn,
    hasButler2: !!s.hasButler2,
    butler2On: !!s.butler2On,
    barrels: Array.isArray(s.barrels) ? s.barrels : [{ id: 1, startTime: 0, mustPrice: 0 }],
    offlineLevel: typeof s.offlineLevel === 'number' ? s.offlineLevel : 0,
    lastQuitTime: typeof s.lastQuitTime === 'number' ? s.lastQuitTime : Date.now(),
    usedPromos: Array.isArray(s.usedPromos) ? s.usedPromos : [],
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

    // --- NEW v0.1.15 ---
    jackpotLevel: typeof s.jackpotLevel === 'number' ? s.jackpotLevel : 0,
    goldenApples: typeof s.goldenApples === 'number' ? s.goldenApples : 0,
    sustenancePotions: typeof s.sustenancePotions === 'number' ? s.sustenancePotions : 0,
    insurancePotions: typeof s.insurancePotions === 'number' ? s.insurancePotions : 0,
    nightTotems: typeof s.nightTotems === 'number' ? s.nightTotems : 0,
    sustenanceEndTime: typeof s.sustenanceEndTime === 'number' ? s.sustenanceEndTime : 0,
    insuranceEndTime: typeof s.insuranceEndTime === 'number' ? s.insuranceEndTime : 0,

    plateLayout: Array.isArray(s.plateLayout) ? s.plateLayout : [],
    plateCurrentTarget: typeof s.plateCurrentTarget === 'number' ? s.plateCurrentTarget : 1,
    marketItems: marketItems,
    investmentItems: investmentItems,
    lastMarketTick: Date.now(),
    lastInvestTick: Date.now(),
    satiety: typeof s.satiety === 'number' ? s.satiety : 100,
    lastSatietyDrop: typeof s.lastSatietyDrop === 'number' ? s.lastSatietyDrop : 0,
    apples: typeof s.apples === 'number' ? s.apples : 0,
    elixirs: typeof s.elixirs === 'number' ? s.elixirs : 0,
    basketLevel: typeof s.basketLevel === 'number' ? s.basketLevel : 0,
    appleReadyTime: typeof s.appleReadyTime === 'number' ? s.appleReadyTime : 0,
    appleCdDuration: typeof s.appleCdDuration === 'number' ? s.appleCdDuration : 0,
    lastAppleMult: typeof s.lastAppleMult === 'number' ? s.lastAppleMult : 1,
    elixirEndTime: typeof s.elixirEndTime === 'number'
      ? (s.elixirEndTime < 100000 ? 0 : s.elixirEndTime)
      : 0,
    calendarLevel: typeof s.calendarLevel === 'number' ? s.calendarLevel : 0,
    lawnProgress: typeof s.lawnProgress === 'number' ? s.lawnProgress : 0,
    lastSleepDay: typeof s.lastSleepDay === 'number' ? s.lastSleepDay : -1
  };
}