async function checkBalanceFile() {
  try {
    const res = await fetch('balance.txt');
    if (!res.ok) return;
    const val = parseFloat((await res.text()).replace(/[^0-9.]/g, ''));
    if (!isNaN(val)) {
      game.money = val;
      saveGame();
      document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    }
  } catch (e) {}
}

async function loadPoems() {
  try {
    const res = await fetch('poems.txt');
    if (!res.ok) return;
    const text = (await res.text()).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    poems = text.trim().split(/\n\s*\n/).map(p => p.trim()).filter(p => p);
  } catch (e) {
    poems = ["in matilda's castle, tall and grand,\nshe rules the halls with iron hand."];
  }
}

async function loadChemEquations() {
  try {
    const res = await fetch('him.txt');
    if (!res.ok) return;
    const lines = (await res.text()).trim().split('\n').filter(l => l);
    const parsed = lines.map(line => {
      const parts = line.split('/').map(p => p.trim());
      if (parts.length < 2) return null;
      const eq = parts[0];
      const answers = parts.slice(1).map(Number);
      if (answers.some(isNaN)) return null;
      const ph = (eq.match(/_/g) || []).length;
      if (ph === 0 || ph !== answers.length) return null;
      return { eq, answers };
    }).filter(x => x);
    const seen = new Set();
    CHEM_EQUATIONS = parsed.filter(x => {
      if (seen.has(x.eq)) return false;
      seen.add(x.eq);
      return true;
    });
  } catch (e) {
    CHEM_EQUATIONS = [{ eq: "_H2 + _O2 = _H2O", answers: [2, 1, 2] }];
  }
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
    hasPassiveIncomeMeter: false,
    hasTreasury: false,
    hasDistillery: false,
    grapeLevel: 1,
    hasButler: false,
    butlerOn: false,
    hasButler2: false,
    butler2On: false,
    barrels: [{ id: 1, startTime: 0, mustPrice: 0 }],
    offlineLevel: 0,
    lastQuitTime: Date.now(),
    usedPromos: [],
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

    // NEW v0.1.15
    jackpotLevel: 0,
    goldenApples: 0,
    sustenancePotions: 0,
    insurancePotions: 0,
    nightTotems: 0,
    sustenanceEndTime: 0,
    insuranceEndTime: 0,

    plateLayout: [],
    plateCurrentTarget: 1,
    marketItems: MARKET_ITEMS.map(i => ({
      id: i.id,
      currentPrice: i.base,
      history: [i.base],
      streak: 0,
      owned: 0,
      totalInvested: 0
    })),
    investmentItems: INVEST_ITEMS.map(i => ({
      id: i.id,
      currentPrice: i.base,
      history: [i.base],
      lastTick: Date.now(),
      owned: 0,
      totalInvested: 0
    })),
    lastMarketTick: Date.now(),
    lastInvestTick: Date.now(),
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

  const stats = getGlobalStats();
  stats.chapterStats[currentChapter].started++;
  writeGlobalStats(stats);

  launchChapter(currentChapter);
}

function continueGame() {
  if (!hasSave(currentChapter)) return;
  launchChapter(currentChapter);
}

async function launchChapter(n) {
  currentChapter = n;
  game = normalizeState(getSave()[n] || {});
  JOBS = JSON.parse(JSON.stringify(DEFAULT_JOBS));

  let offlineEarned = 0;
  let offlineTimeText = '';

  if (game.offlineLevel > 0 && game.lastQuitTime) {
    const now = Date.now();
    const diffSeconds = Math.max(0, Math.floor((now - game.lastQuitTime) / 1000));

    if (diffSeconds >= 30) {
      const maxSeconds = OFFLINE_CAPS_HOURS[game.offlineLevel - 1] * 3600;
      const actualSeconds = Math.min(diffSeconds, maxSeconds);

      const incomePerSec = getSlaveIncomePerSecond();
      offlineEarned = round2(incomePerSec * actualSeconds * 0.3);

      if (offlineEarned > 0) {
        game.money = round2(game.money + offlineEarned);

        const hoursAway = Math.floor(diffSeconds / 3600);
        const minsAway = Math.floor((diffSeconds % 3600) / 60);
        let timeText = '';
        if (hoursAway > 0) timeText += `${hoursAway}h `;
        if (minsAway > 0 || hoursAway === 0) timeText += `${minsAway}m`;
        offlineTimeText = timeText;
      }
    }
  }

  await checkBalanceFile();
  await loadPoems();
  await loadChemEquations();

  if (offlineEarned > 0) {
    setTimeout(() => {
      showModal('Welcome Back!',
        `<div style="font-size: 14px; color: #b8a3d0; margin-bottom: 12px;">You were away for <b>${offlineTimeText}</b>.</div>` +
        `<div style="font-size: 14px; color: #b8a3d0; margin-bottom: 20px;">Your slaves worked at 30% efficiency and earned:</div>` +
        `<div style="font-size: 32px; color: #a8c256; font-weight: bold; margin-bottom: 16px;">+${formatMoney(offlineEarned)}</div>` +
        `<div style="font-size: 11px; color: #8a7fa5;">Max offline time: ${OFFLINE_CAPS_HOURS[game.offlineLevel - 1]} hours.</div>`,
        'Collect', null,
        () => { closeModal(); saveGame(); },
        () => { closeModal(); saveGame(); },
        'small-modal');
    }, 500);
  }

  hideAllScenes();
  document.getElementById('gameScreen').classList.remove('hidden');
  document.getElementById('tab-treasury').classList.toggle('hidden', !game.hasTreasury);
  document.getElementById('tab-distillery').classList.toggle('hidden', !game.hasDistillery);

  switchTab('work');
  renderGame();
  updateSkyUI();
  updateClockUI();
  updateHungerUI();
  renderCalendar();
  updatePassiveIncomeUI();

  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
    startCooldownTicker();
  }
  if (game.appleReadyTime > Date.now()) {
    document.getElementById('startAppleBtn').disabled = true;
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

    // Sustenance Potion halves hunger speed (24s instead of 12s)
    const satietyThreshold = Date.now() < game.sustenanceEndTime ? 24000 : 12000;
    if (Date.now() - game.lastSatietyDrop > satietyThreshold) {
      game.satiety = Math.max(0, game.satiety - 1);
      game.lastSatietyDrop = Date.now();
      updateHungerUI();
    }

    if (sessionTime % 10 === 0) {
      game.playTime = (game.playTime || 0) + 10;
      const stats = getGlobalStats();
      stats.totalPlayTime += 10;
      stats.chapterStats[currentChapter].totalTime += 10;
      writeGlobalStats(stats);
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

  if (marketTickInterval) clearInterval(marketTickInterval);
  marketTickInterval = setInterval(processMarketTick, 60000);

  if (investTickInterval) clearInterval(investTickInterval);
  investTickInterval = setInterval(processInvestTick, 720000);

  if (distilleryTickInterval) clearInterval(distilleryTickInterval);
  distilleryTickInterval = setInterval(updateDistilleryTick, 1000);

  setupLawnCanvas();
  startSwordMeter();
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

  const isPlate = game.selectedJobId === 'plates' && !game.slaves['plates'];
  const isLawn = game.selectedJobId === 'lawn' && !game.slaves['lawn'];
  const isSword = game.selectedJobId === 'sword' && !game.slaves['sword'];
  const isChest = game.selectedJobId === 'chest' && !game.slaves['chest'];
  const isArmorer = game.selectedJobId === 'armorer' && !game.slaves['armorer'];
  const isWriter = game.selectedJobId === 'writer' && !game.slaves['writer'];
  const isScientist = game.selectedJobId === 'scientist' && !game.slaves['scientist'];

  document.getElementById('workBtnContainer').classList.toggle('hidden',
    isPlate || isLawn || isSword || isChest || isArmorer || isWriter || isScientist);
  document.getElementById('plateContainer').classList.toggle('hidden', !isPlate);
  document.getElementById('lawnContainer').classList.toggle('hidden', !isLawn);
  document.getElementById('swordContainer').classList.toggle('hidden', !isSword);
  const chestEl = document.getElementById('chestContainer');
  if (chestEl) chestEl.classList.toggle('hidden', !isChest);

  document.getElementById('armorerContainer').classList.toggle('hidden', !isArmorer);
  document.getElementById('writerContainer').classList.toggle('hidden', !isWriter);
  document.getElementById('scientistContainer').classList.toggle('hidden', !isScientist);

  if (isPlate) {
    const max = currentPlates('plates');
    if (!game.plateLayout || game.plateLayout.length !== max) {
      generatePlateLayout(max);
    }
    renderPlateGrid();
  } else if (isSword) {
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
    document.getElementById('swordHitsText').textContent =
      'Hit Power: ' + swordHits + ' / ' + currentThreshold('sword');
    startSwordMeter();
  } else if (isLawn) {
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
  } else if (isChest) {
    const cb = document.getElementById('chestStartBtn');
    if (cb) {
      if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) {
        cb.disabled = true;
        cb.classList.add('btn-cooldown');
        cb.classList.remove('btn-success', 'btn-fail');
        cb.textContent = 'Cooldown';
      } else {
        cb.disabled = false;
        cb.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
        cb.textContent = 'Start Picking';
      }
    }
    drawChest();
  } else if (isArmorer) {
    renderArmorerUI();
  } else if (isWriter) {
    renderWriterUI();
  } else if (isScientist) {
    renderScientistUI();
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
  if (tab === 'treasury') {
    if (document.getElementById('tres-market').classList.contains('active')) {
      renderMarketUI();
    } else {
      renderInvestUI();
    }
  }
  if (tab === 'distillery') {
    renderDistilleryUI();
  }

  updateWorkButton();
  renderWorkArea();
}

function updateSkyUI() {
  const el = document.getElementById('windowSky');
  const body = document.getElementById('celestialBody');
  if (!el || !game) return;

  const h = game.timeMinutes / 60;
  let c1, c2;

  if (h >= 6 && h < 12) { c1 = '#2c1e4a'; c2 = '#f4a261'; }
  else if (h >= 12 && h < 18) { c1 = '#4a90e2'; c2 = '#a1c4fd'; }
  else if (h >= 18 && h < 24) { c1 = '#e76f51'; c2 = '#f4a261'; }
  else { c1 = '#0b0b0f'; c2 = '#1a1228'; }

  el.style.background = `linear-gradient(180deg, ${c1}, ${c2})`;

  if (body) {
    if (h >= 6 && h < 24) {
      body.textContent = '☀️';
      const p = (h - 6) / 18;
      body.style.left = (p * 100) + '%';
      body.style.top = (100 - Math.sin(p * Math.PI) * 80) + '%';
    } else {
      body.textContent = '🌙';
      const p = h / 6;
      body.style.left = (p * 100) + '%';
      body.style.top = (100 - Math.sin(p * Math.PI) * 80) + '%';
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
  document.getElementById('invGoldenApples').textContent = game.goldenApples;
  document.getElementById('invSustenance').textContent = game.sustenancePotions;
  document.getElementById('invInsurance').textContent = game.insurancePotions;
  document.getElementById('invTotems').textContent = game.nightTotems;
}

function renderCalendar() {
  const el = document.getElementById('calendarDisplay');
  const txt = document.getElementById('calendarDay');
  if (!el || !txt || !game) return;
  if (game.calendarLevel > 0) {
    el.classList.remove('hidden');
    txt.textContent = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][game.dayOfWeek];
    el.classList.toggle('weekend', game.dayOfWeek >= 5);
  } else {
    el.classList.add('hidden');
  }
}

setInterval(() => {
  if (!playTimer) {
    const stats = getGlobalStats();
    stats.totalPlayTime++;
    writeGlobalStats(stats);
  }
}, 1000);

window.addEventListener('beforeunload', () => {
  if (game) {
    game.lastQuitTime = Date.now();
    saveGame();
  }
});

showMenu();