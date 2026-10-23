function getActionMultiplier() {
  let mult = 1;
  if (game.premiumLevel > 0 && game.workClicks % 10 === 0) mult *= getPremiumMult();
  if (game.calendarLevel > 0) {
    if (game.dayOfWeek === 5) mult *= game.calendarLevel === 3 ? 3 : 2;
    if (game.dayOfWeek === 6 && game.calendarLevel >= 2) mult *= game.calendarLevel === 3 ? 3 : 2;
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
      ? `<div class="job-stats"><span><span class="label">Pay:</span> <span id="job-${job.id}-pay">${formatMoney(pay)}</span></span><span><span class="label">CD:</span> <span id="job-${job.id}-cd">${(cd / 1000).toFixed(1)}s</span></span></div>`
      : `<div class="job-stats"><span><span class="label">Base:</span> ${formatMoney(job.basePay)}</span></div>`;

    let actionsHtml = '';
    if (hired) {
      const isSlave = !!game.slaves[job.id];
      actionsHtml = `
        <button class="select-btn" ${selected || isSlave ? 'disabled' : ''} onclick="selectJob('${job.id}')">${selected ? 'Selected' : isSlave ? 'Automated' : 'Select'}</button>
        <button class="upgrade-btn" onclick="toggleUpgradePanel('${job.id}')">Upgrade</button>`;
    } else {
      actionsHtml = `<button class="hire-btn" onclick="hireJob('${job.id}', event)">Hire — ${formatMoney(job.hireCost)}</button>`;
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

function renderUpgradePanelHTML(id, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv) {
  const isOpen = openUpgradePanels[id] ? ' open' : '';
  return `<div class="upgrade-wrapper${isOpen}" id="upg-wrap-${id}"><div class="upgrade-inner">${renderUpgradeInnerHTML(id, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv)}</div></div>`;
}

function renderUpgradeInnerHTML(id, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv) {
  const isSlave = !!game.slaves[id];
  const stamMaxed = upg.stamina >= stamMaxLv;
  const earnMaxed = upg.earnings >= earnMaxLv;
  const platesMaxed = upg.plates >= plateMaxLv;
  const precMaxed = upg.precision >= precMaxLv;

  const { job, mistakeMaxLv, degreeMaxLv } = getJobData(id);
  const mistakeMaxed = mistakeMaxLv === 0 || upg.mistake >= mistakeMaxLv;
  const degreeMaxed = degreeMaxLv === 0 || (upg.degree || 1) >= degreeMaxLv;
  const allMaxed = stamMaxed && earnMaxed && (plateMaxLv === 0 || platesMaxed) && (precMaxLv === 0 || precMaxed) && mistakeMaxed && degreeMaxed;

  const cd = baseCooldown(id);
  const nextCd = Math.max(job.maxCd, cd - job.cdStep);
  const pay = currentPay(id);
  const nextPay = Math.min(job.maxPay, round2(pay + job.payStep));

  let html = '';

  if (allMaxed && !isSlave) {
    html += '<div class="maxed-text">All stats maxed out.</div>';
  } else if (!isSlave) {
    const stamC = staminaCost(id);
    const earnC = earningsCost(id);
    const canStam = !stamMaxed && game.money >= stamC;
    const canEarn = !earnMaxed && game.money >= earnC;

    if (!['armorer', 'writer', 'scientist'].includes(id)) {
      html += `<div class="upg-item"><div class="upg-info"><div class="upg-title">Stamina <span>Lv ${upg.stamina} / ${stamMaxLv}</span></div><div class="upg-effect">-${(job.cdStep / 1000).toFixed(1)}s cooldown per level</div><div class="upg-stats">${(cd / 1000).toFixed(1)}s → ${(nextCd / 1000).toFixed(1)}s</div></div>${stamMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : `<button class="upg-buy" id="upg-stam-btn-${id}" onclick="buyUpgrade('${id}','stamina',event)" ${canStam ? '' : 'disabled'}>${formatMoney(stamC)}</button>`}</div>`;
    }

    if (id !== 'scientist') {
      html += `<div class="upg-item"><div class="upg-info"><div class="upg-title">Earnings <span>Lv ${upg.earnings} / ${earnMaxLv}</span></div><div class="upg-effect">+${formatMoney(job.payStep)} per level</div><div class="upg-stats">${formatMoney(pay)} → ${formatMoney(nextPay)}</div></div>${earnMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : `<button class="upg-buy" id="upg-earn-btn-${id}" onclick="buyUpgrade('${id}','earnings',event)" ${canEarn ? '' : 'disabled'}>${formatMoney(earnC)}</button>`}</div>`;
    }

    if (job.basePlates) {
      const pl = currentPlates(id);
      const np = Math.max(job.minPlates, pl - job.plateStep);
      const plC = platesCost(id);
      const canP = !platesMaxed && game.money >= plC;
      html += `<div class="upg-item"><div class="upg-info"><div class="upg-title">Capacity <span>Lv ${upg.plates} / ${plateMaxLv}</span></div><div class="upg-effect">-${job.plateStep} plates per level</div><div class="upg-stats">${pl} → ${np} plates</div></div>${platesMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : `<button class="upg-buy" id="upg-plates-btn-${id}" onclick="buyUpgrade('${id}','plates',event)" ${canP ? '' : 'disabled'}>${formatMoney(plC)}</button>`}</div>`;
    }

    if (job.precBase) {
      const pcC = precisionCost(id);
      const canP = !precMaxed && game.money >= pcC;
      let effect = '';
      if (id === 'sword') {
        const t = currentThreshold(id);
        const nt = Math.max(job.minThreshold, t - 7);
        effect = 'Threshold: ' + t + (precMaxed ? '' : ' → ' + nt);
      } else if (id === 'lawn') {
        const t = Math.max(50, 85 - upg.precision * 3);
        const nt = Math.max(50, 85 - (upg.precision + 1) * 3);
        effect = 'Fail: ' + t + '%' + (precMaxed ? '' : ' → ' + nt + '%');
      } else if (id === 'chest') {
        const currLimit = (3000 + upg.precision * 200) / 1000;
        const nextLimit = (3000 + (upg.precision + 1) * 200) / 1000;
        effect = 'Jam limit: ' + currLimit.toFixed(1) + 's → ' + nextLimit.toFixed(1) + 's';
      }
      html += `<div class="upg-item"><div class="upg-info"><div class="upg-title">Precision <span>Lv ${upg.precision} / ${precMaxLv}</span></div><div class="upg-effect">${effect}</div></div>${precMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : `<button class="upg-buy" id="upg-prec-btn-${id}" onclick="buyUpgrade('${id}','precision',event)" ${canP ? '' : 'disabled'}>${formatMoney(pcC)}</button>`}</div>`;
    }

    if (id === 'writer') {
      const mCost = mistakeCost(id);
      const canM = !mistakeMaxed && game.money >= mCost;
      html += `<div class="upg-item"><div class="upg-info"><div class="upg-title">Draft <span>Lv ${upg.mistake} / ${mistakeMaxLv}</span></div><div class="upg-effect">Allows 1 typo</div></div>${mistakeMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : `<button class="upg-buy" id="upg-mistake-btn-${id}" onclick="buyUpgrade('${id}','mistake',event)" ${canM ? '' : 'disabled'}>${formatMoney(mCost)}</button>`}</div>`;
    }

    if (id === 'scientist') {
      const deg = upg.degree || 1;
      const dCost = degreeCost(id);
      const canD = !degreeMaxed && game.money >= dCost;
      const nextPay = [0, 3000000, 4800000, 7200000, 12000000, 0][deg + 1] || 0;
      html += `<div class="upg-item"><div class="upg-info"><div class="upg-title">Degree <span>Lv ${deg} / ${degreeMaxLv}</span></div><div class="upg-effect">Unlocks new research and raises pay.</div><div class="upg-stats">${formatMoney(pay)}${degreeMaxed ? '' : ' → ' + formatMoney(nextPay)}</div></div>${degreeMaxed ? '<div class="maxed-text" style="margin:0;">MAXED</div>' : `<button class="upg-buy" id="upg-degree-btn-${id}" onclick="buyUpgrade('${id}','degree',event)" ${canD ? '' : 'disabled'}>${formatMoney(dCost)}</button>`}</div>`;
    }
  }

  if (isSlave) {
    html += '<div class="slave-assigned">Assigned to Slave (Automated)</div>';
  } else if (game.hasSlaveLicense) {
    const sCost = slaveCost(id);
    const canSlave = allMaxed && game.money >= sCost;
    const slaveHint = ['lawn', 'sword', 'armorer', 'writer', 'scientist', 'chest'].includes(id) ? ' (Auto-succeeds)' : '';
    html += `<div class="upg-item" style="border-top: 1px dashed #3a3350; padding-top: 8px; margin-top: 2px;"><div class="upg-info"><div class="upg-title">Slave</div><div class="upg-effect">Automates this job permanently${slaveHint}</div></div><button class="upg-buy" id="upg-slave-btn-${id}" ${canSlave ? '' : 'disabled'} onclick="buySlave('${id}',event)">${allMaxed ? 'Buy — ' + formatMoney(sCost) : 'Locked'}</button></div>`;
  }

  return html;
}

function toggleUpgradePanel(id) {
  const wrapper = document.getElementById('upg-wrap-' + id);
  if (wrapper) {
    wrapper.classList.toggle('open');
    openUpgradePanels[id] = wrapper.classList.contains('open');
  }
}

function selectJob(id) {
  if (game.selectedJobId === id || game.slaves[id]) return;
  game.selectedJobId = id;
  saveGame();
  
  if (id === 'plates') generatePlateLayout(currentPlates('plates'));
  
  if (id === 'sword') {
    swordHits = 0;
    swordStrikes = 0;
    swordStartTime = 0;
    swordAnimating = false;
  }
  
  if (id === 'chest') {
    chestActive = false;
    chestJammed = false;
    chestIsTurning = false;
    if (chestRAF) cancelAnimationFrame(chestRAF);
    window.onmouseup = null;
  }

  if (id === 'armorer') {
    isCraftingActive = false;
    craftTableState.fill(null);
  }
  if (id === 'writer') isWritingActive = false;
  if (id === 'scientist') isResearchingActive = false;
  
  isLawnDrawing = false;
  lawnStarted = false;
  
  renderJobs();
  updateWorkButton();
  renderWorkArea();
  updateBonusText();
}

function hireJob(id, e) {
  const job = JOBS.find(j => j.id === id);
  if (!job || game.hiredJobs.includes(id)) return;
  if (game.money < job.hireCost) { triggerError(e.target); return; }

  game.money = round2(game.money - job.hireCost);
  game.hiredJobs.push(id);
  if (!game.selectedJobId) game.selectedJobId = id;
  if (!game.jobUpgrades[id]) {
    game.jobUpgrades[id] = { stamina: 0, earnings: 0, plates: 0, precision: 0, mistake: 0, degree: 1 };
  }
  saveGame();

  if (id === 'plates') generatePlateLayout(currentPlates('plates'));

  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  openUpgradePanels[id] = true;
  renderJobs();
  updateWorkButton();
  updateHint();
  renderWorkArea();
}

function buyUpgrade(id, type, e) {
  const { upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv, mistakeMaxLv, degreeMaxLv } = getJobData(id);
  let cost, maxed;
  if (type === 'stamina') { maxed = upg.stamina >= stamMaxLv; cost = staminaCost(id); }
  else if (type === 'earnings') { maxed = upg.earnings >= earnMaxLv; cost = earningsCost(id); }
  else if (type === 'plates') { maxed = upg.plates >= plateMaxLv; cost = platesCost(id); }
  else if (type === 'precision') { maxed = upg.precision >= precMaxLv; cost = precisionCost(id); }
  else if (type === 'mistake') { maxed = upg.mistake >= mistakeMaxLv; cost = mistakeCost(id); }
  else if (type === 'degree') { maxed = (upg.degree || 1) >= degreeMaxLv; cost = degreeCost(id); }

  if (maxed) return;
  if (game.money < cost) { triggerError(e.target); return; }

  game.money = round2(game.money - cost);
  if (type === 'degree') upg.degree = (upg.degree || 1) + 1;
  else upg[type]++;
  saveGame();

  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  document.getElementById('job-' + id + '-pay').textContent = formatMoney(currentPay(id));
  document.getElementById('job-' + id + '-cd').textContent = (baseCooldown(id) / 1000).toFixed(1) + 's';

  if (id === 'plates' && type === 'plates') generatePlateLayout(currentPlates(id));

  const inner = document.querySelector('#upg-wrap-' + id + ' .upgrade-inner');
  if (inner) inner.innerHTML = renderUpgradeInnerHTML(id, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv);

  updateAllBuyButtons();
  renderWorkArea();
}

function buySlave(id, e) {
  if (game.slaves[id]) return;
  const cost = slaveCost(id);
  if (game.money < cost) { triggerError(e.target); return; }

  game.money = round2(game.money - cost);
  game.slaves[id] = true;
  game.slaveNextWork[id] = Date.now() + applyCooldownMult(getSlaveCooldown(id));
  if (game.selectedJobId === id) game.selectedJobId = null;

  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  openUpgradePanels[id] = true;
  renderJobs();
  updateWorkButton();
  renderWorkArea();
  updatePassiveIncomeUI();
}

function updateAllBuyButtons() {
  JOBS.forEach(j => {
    if (!game.hiredJobs.includes(j.id)) return;
    const { upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv, mistakeMaxLv, degreeMaxLv } = getJobData(j.id);
    const sM = upg.stamina >= stamMaxLv;
    const eM = upg.earnings >= earnMaxLv;
    const pM = plateMaxLv === 0 || upg.plates >= plateMaxLv;
    const prM = precMaxLv === 0 || upg.precision >= precMaxLv;
    const miM = mistakeMaxLv === 0 || upg.mistake >= mistakeMaxLv;
    const dM = degreeMaxLv === 0 || (upg.degree || 1) >= degreeMaxLv;

    if (!['armorer', 'writer', 'scientist'].includes(j.id) && !sM) {
      const b = document.getElementById('upg-stam-btn-' + j.id);
      if (b) b.disabled = game.money < staminaCost(j.id);
    }
    if (j.id !== 'scientist' && !eM) {
      const b = document.getElementById('upg-earn-btn-' + j.id);
      if (b) b.disabled = game.money < earningsCost(j.id);
    }
    if (j.basePlates && !pM) {
      const b = document.getElementById('upg-plates-btn-' + j.id);
      if (b) b.disabled = game.money < platesCost(j.id);
    }
    if (j.precBase && !prM) {
      const b = document.getElementById('upg-prec-btn-' + j.id);
      if (b) b.disabled = game.money < precisionCost(j.id);
    }
    if (j.id === 'writer' && !miM) {
      const b = document.getElementById('upg-mistake-btn-' + j.id);
      if (b) b.disabled = game.money < mistakeCost(j.id);
    }
    if (j.id === 'scientist' && !dM) {
      const b = document.getElementById('upg-degree-btn-' + j.id);
      if (b) b.disabled = game.money < degreeCost(j.id);
    }
    if (game.hasSlaveLicense && !game.slaves[j.id] && sM && eM && pM && prM && dM) {
      const b = document.getElementById('upg-slave-btn-' + j.id);
      if (b) b.disabled = game.money < slaveCost(j.id);
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
    const cm = game.workClicks % 10;
    html += cm === 9
      ? `<div>Premium: next act (x${getPremiumMult().toFixed(1)})</div>`
      : `<div>Premium in: ${10 - cm} acts (x${getPremiumMult().toFixed(1)})</div>`;
  }
  if (game.calendarLevel > 0 && (game.dayOfWeek === 5 || (game.dayOfWeek === 6 && game.calendarLevel >= 2))) {
    const m = game.calendarLevel === 3 ? 3 : 2;
    html += `<div style="color:#f3e6c8; margin-top:4px;">Weekend Bonus: x${m} active</div>`;
  }
  if (game.selectedJobId) {
    const hm = getHungerMult();
    const em = getElixirMult();
    html += `<div style="color:#b85a7a; margin-top:4px; font-weight:bold;">Hunger: ${(1 / hm).toFixed(2)}x speed</div>`;
    if (em < 1) html += `<div style="color:#a8c256; margin-top:4px;">Elixir: 2x speed</div>`;
  }
  if (Date.now() < game.elixirEndTime) {
    const rem = Math.floor((game.elixirEndTime - Date.now()) / 1000);
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    html += `<div style="color:#a8c256; margin-top:4px; font-size:11px;">(${m}m ${s}s left)</div>`;
  }
  el.innerHTML = html;
}

function updateWorkButton() {
  const btn = document.getElementById('workBtn');
  if (!btn) return;
  const onCd = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
  btn.disabled = game.hiredJobs.length === 0 || !game.selectedJobId || !!onCd || !!game.slaves[game.selectedJobId];
  btn.classList.toggle('btn-cooldown', !!onCd);
}

function doWork() {
  if (!game || !game.selectedJobId || game.slaves[game.selectedJobId]) return;
  if (['plates', 'lawn', 'sword', 'chest', 'armorer', 'writer', 'scientist'].includes(game.selectedJobId)) return;

  const now = Date.now();
  if (game.workCooldownEnd && now < game.workCooldownEnd) return;
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) {
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
  if (lb && !lb.classList.contains('btn-success') && !lb.classList.contains('btn-fail')) lb.classList.add('btn-cooldown');
  const cb = document.getElementById('chestStartBtn');
  if (cb && !cb.classList.contains('btn-success') && !cb.classList.contains('btn-fail')) {
    cb.classList.add('btn-cooldown');
    cb.disabled = true;
  }
  const stb = document.getElementById('armorerStartBtn');
  if (stb && !stb.classList.contains('btn-success') && !stb.classList.contains('btn-fail')) {
    stb.classList.add('btn-cooldown');
    stb.disabled = true;
  }
  const craftB = document.getElementById('craftBtn');
  if (craftB && !craftB.classList.contains('btn-success') && !craftB.classList.contains('btn-fail')) {
    craftB.classList.add('btn-cooldown');
    craftB.disabled = true;
  }
  const wb = document.getElementById('writerStartBtn');
  if (wb && !wb.classList.contains('btn-success') && !wb.classList.contains('btn-fail')) {
    wb.classList.add('btn-cooldown');
    wb.disabled = true;
  }
  const scb = document.getElementById('scientistStartBtn');
  if (scb && !scb.classList.contains('btn-success') && !scb.classList.contains('btn-fail')) {
    scb.classList.add('btn-cooldown');
    scb.disabled = true;
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
      endTime = now + (endTime - now) / durationMult * newMult;
      game.workCooldownEnd = endTime;
      game.lastCooldownDuration = game.lastCooldownDuration / durationMult * newMult;
      durationMult = newMult;
      game.lastCooldownMult = newMult;
      saveGame();
    }
    if (game.workCooldownEnd && now < game.workCooldownEnd) {
      const rem = game.workCooldownEnd - now;
      let pct = 1 - rem / game.lastCooldownDuration;
      if (pct < 0) pct = 0;
      if (pct > 1) pct = 1;
      fill.style.width = (pct * 100) + '%';
      text.textContent = (rem / durationMult / 1000).toFixed(1) + 's';
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
      resetWorkButtonsAfterCooldown();
    }
  }, 50);
}

function resetWorkButtonsAfterCooldown() {
  const ids = ['swordHitBtn', 'lawnStartBtn', 'chestStartBtn', 'armorerStartBtn', 'craftBtn', 'writerStartBtn', 'scientistStartBtn', 'scientistSubmitBtn'];
  const labels = {
    swordHitBtn: 'Strike!',
    lawnStartBtn: 'Start Mowing',
    chestStartBtn: 'Start Picking',
    armorerStartBtn: 'Start Crafting',
    craftBtn: 'Craft!',
    writerStartBtn: 'Start Writing',
    scientistStartBtn: 'Start Research',
    scientistSubmitBtn: 'Submit Answer'
  };
  ids.forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    b.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
    b.textContent = labels[id];
    if (id !== 'scientistSubmitBtn') b.disabled = false;
  });
  renderArmorerUI();
  renderWriterUI();
  renderScientistUI();
  if (game.selectedJobId === 'chest') drawChest();
}

function triggerNightPenalty(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  const basePen = round2(currentPay(jobId) * 12.5);
  const slavePen = game.slaveNightEarnings || 0;
  const total = round2(basePen + slavePen);

  game.money = round2(Math.max(0, game.money - total));
  game.slaveNightEarnings = 0;
  const cd = applyCooldownMult(30000);
  game.workCooldownEnd = Date.now() + cd;
  game.lastCooldownDuration = cd;
  game.lastCooldownMult = getHungerMult() * getElixirMult();

  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  showFloatingPenalty(total);
  triggerAnim(false);

  const slaveText = slavePen > 0
    ? `<div style="font-size: 11px; color: #8a7fa5; margin-bottom: 12px;">(Includes ${formatMoney(slavePen)} from slaves)</div>`
    : '';
  const reset = () => { closeModal(); startCooldownTicker(); };

  showModal('Caught!',
    `<div style="color: #b8a3d0; margin-bottom: 16px;">Night work is forbidden!</div><div style="font-size: 36px; color: #b85a7a; font-weight: bold;">-${formatMoney(total)}</div>${slaveText}<div style="font-size: 11px; color: #6b5a8a; margin-top: 8px;">Locked 30s.</div>`,
    'Accept', null, reset, reset, 'small-modal');

  updateWorkButton();
}

function processSlaves() {
  if (!game) return;
  let changed = false;
  const now = Date.now();
  const isNight = game.timeMinutes >= 0 && game.timeMinutes < 360;

  let slaveMult = 1;
  if (game.calendarLevel > 0) {
    if (game.dayOfWeek === 5) slaveMult *= game.calendarLevel === 3 ? 3 : 2;
    if (game.dayOfWeek === 6 && game.calendarLevel >= 2) slaveMult *= game.calendarLevel === 3 ? 3 : 2;
  }

  JOBS.forEach(job => {
    if (!game.slaves[job.id]) return;
    if (!game.slaveNextWork[job.id]) game.slaveNextWork[job.id] = now;
    if (now < game.slaveNextWork[job.id]) return;

    const pay = round2(currentPay(job.id) * slaveMult);
    game.money = round2(game.money + pay);
    if (isNight) game.slaveNightEarnings = (game.slaveNightEarnings || 0) + pay;
    game.slaveNextWork[job.id] = now + applyCooldownMult(getSlaveCooldown(job.id));
    showFloatingMoney(pay, slaveMult, true);
    changed = true;
  });

  if (changed) {
    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    if (game.selectedJobId && game.slaves[game.selectedJobId]) updateSelectedCooldownUI();
  }
}

function updateSelectedCooldownUI() {
  if (!game.selectedJobId || !game.slaves[game.selectedJobId]) return;
  const id = game.selectedJobId;
  const cd = applyCooldownMult(getSlaveCooldown(id));
  const nextWork = game.slaveNextWork[id] || Date.now();
  const rem = Math.max(0, nextWork - Date.now());
  const pct = 1 - rem / cd;
  const bar = document.getElementById('cooldownBar');
  const fill = document.getElementById('cooldownFill');
  const text = document.getElementById('cooldownText');
  if (rem > 0) {
    bar.classList.remove('inactive');
    fill.style.width = Math.min(100, Math.max(0, pct * 100)) + '%';
    text.textContent = (rem / 1000).toFixed(1) + 's';
  } else {
    fill.style.width = '0%';
    text.textContent = '0.0s';
  }
}

function updateFastUI() {
  if (!game) return;
  const now = Date.now();
  const newMult = getHungerMult() * getElixirMult();
  if (newMult !== game.lastAppleMult && game.appleReadyTime > now) {
    game.appleReadyTime = now + (game.appleReadyTime - now) / game.lastAppleMult * newMult;
    game.appleCdDuration = game.appleCdDuration / game.lastAppleMult * newMult;
    game.lastAppleMult = newMult;
    saveGame();
  }
  const fill = document.getElementById('appleCdFill');
  const txt = document.getElementById('appleCdText');
  if (fill && txt) {
    if (game.appleReadyTime > now) {
      const rem = game.appleReadyTime - now;
      const total = game.appleCdDuration || 3000;
      const pct = Math.min(100, Math.max(0, (1 - rem / total) * 100));
      fill.style.width = pct + '%';
      txt.textContent = (rem / (game.lastAppleMult || 1) / 1000).toFixed(1) + 's';
      document.getElementById('startAppleBtn').disabled = true;
    } else {
      fill.style.width = '0%';
      txt.textContent = '0.0s';
      document.getElementById('startAppleBtn').disabled = false;
    }
  }
  if (game.slaves[game.selectedJobId]) updateSelectedCooldownUI();
  updatePassiveIncomeUI();
}