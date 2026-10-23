// Глобальные переменные для взломщика
let chestAttemptRot = 0;

// ============================================================
// MINIGAME: APPLES
// ============================================================
function animateAppleRAF(ts) {
  if (!appleGameActive) { appleRAF = null; return; }
  if (!appleStartTime) appleStartTime = ts;
  const elapsed = performance.now() - appleStartTime;
  const cycle = (elapsed * 0.080) % 200;
  applePos = cycle <= 100 ? cycle : 200 - cycle;
  const ptr = document.getElementById('applePointer');
  if (ptr) ptr.style.left = applePos + '%';
  appleRAF = requestAnimationFrame(animateAppleRAF);
}

function getApplePosAtClick() {
  if (!appleStartTime) return applePos;
  const elapsed = performance.now() - appleStartTime;
  const cycle = (elapsed * 0.080) % 200;
  return cycle <= 100 ? cycle : 200 - cycle;
}

function startAppleGame() {
  if (!game) return;
  const btn = document.getElementById('startAppleBtn');
  if (game.appleReadyTime > Date.now()) { triggerError(btn); return; }
  if (appleGameActive) { pickApple(); return; }
  btn.classList.remove('btn-success', 'btn-fail');
  btn.textContent = 'Pick!';
  appleGameActive = true;
  appleGreenStart = Math.floor(Math.random() * 80) + 10;
  document.getElementById('appleGreenZone').style.left = appleGreenStart + '%';
  document.getElementById('applePointer').style.display = 'block';
  document.getElementById('appleTrack').classList.remove('hidden');
  applePos = 0;
  appleStartTime = 0;
  if (appleRAF) cancelAnimationFrame(appleRAF);
  appleRAF = requestAnimationFrame(animateAppleRAF);
}

function pickApple() {
  if (!game || !appleGameActive) return;
  const pos = getApplePosAtClick();
  appleGameActive = false;
  if (appleRAF) { cancelAnimationFrame(appleRAF); appleRAF = null; }
  document.getElementById('applePointer').style.display = 'none';
  document.getElementById('appleTrack').classList.add('hidden');
  const btn = document.getElementById('startAppleBtn');
  btn.disabled = true;
  let cd = 0;
  const base = 3000 + game.basketLevel * 2000;
  if (pos >= appleGreenStart && pos <= appleGreenStart + 10) {
    btn.classList.add('btn-success');
    btn.textContent = 'Success!';
    game.apples += game.basketLevel + 1;
    cd = applyCooldownMult(base);
  } else {
    btn.classList.add('btn-fail');
    btn.textContent = 'Missed!';
    cd = applyCooldownMult(base * 20);
  }
  game.appleReadyTime = Date.now() + cd;
  game.appleCdDuration = cd;
  game.lastAppleMult = getHungerMult() * getElixirMult();
  saveGame();
  updateHungerUI();
  setTimeout(() => {
    btn.classList.remove('btn-success', 'btn-fail');
    btn.textContent = 'Pick Apples';
  }, 1000);
}

function eatApple(e) {
  if (!game || game.apples <= 0) { triggerError(e.target); return; }
  game.apples--;
  game.satiety = Math.min(100, game.satiety + 5);
  saveGame();
  updateHungerUI();
}

function drinkElixir(e) {
  if (!game || game.elixirs <= 0) { triggerError(e.target); return; }
  game.elixirs--;
  const now = Date.now();
  game.elixirEndTime = (game.elixirEndTime > now ? game.elixirEndTime : now) + 150000;
  saveGame();
  updateHungerUI();
  updateBonusText();
}

// ============================================================
// MINIGAME: SWORD
// ============================================================
function startSwordMeter() {
  if (swordRAF) return;
  swordRAF = requestAnimationFrame(animateSwordMeterRAF);
}

function animateSwordMeterRAF() {
  if (!game) { swordRAF = null; return; }
  if (!swordStartTime) swordStartTime = performance.now();
  if (!swordAnimating) {
    const elapsed = performance.now() - swordStartTime;
    const cycle = (elapsed * 0.15) % 200;
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
  const cycle = (elapsed * 0.15) % 200;
  return Math.floor(cycle <= 100 ? cycle : 200 - cycle);
}

function hitSword() {
  if (!game || game.selectedJobId !== 'sword' || game.slaves['sword']) return;
  const btn = document.getElementById('swordHitBtn');
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) { triggerError(btn); return; }
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) { triggerNightPenalty('sword'); return; }

  const power = getSwordPowerAtClick();
  document.getElementById('swordHitMarker').textContent = power + '%';
  swordHits += power;
  swordStrikes++;
  const textEl = document.getElementById('swordHitsText');

  if (swordStrikes < 5) {
    textEl.textContent = 'Hit Power: ' + swordHits + ' / ' + currentThreshold('sword');
    textEl.style.transform = 'scale(1.1)';
    setTimeout(() => textEl.style.transform = 'scale(1)', 100);
    saveGame();
    return;
  }

  const threshold = currentThreshold('sword');
  const success = swordHits >= threshold;
  btn.disabled = true;
  btn.textContent = 'Forging...';
  textEl.textContent = 'Final Power: ' + swordHits + ' / ' + threshold;
  textEl.style.color = '#f3e6c8';
  swordAnimating = true;

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
      const pen = round2(currentPay('sword') * 2);
      game.money = round2(Math.max(0, game.money - pen));
      const cd = applyCooldownMult(60000);
      game.workCooldownEnd = Date.now() + cd;
      game.lastCooldownDuration = cd;
      game.lastCooldownMult = getHungerMult() * getElixirMult();
      showFloatingPenalty(pen);
      startCooldownTicker();
      btn.classList.add('btn-fail');
      btn.textContent = 'Failed!';
      textEl.style.color = '#b85a7a';
      document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
      updateAllBuyButtons();
      updateBonusText();
      triggerAnim(false);
      setTimeout(() => showModal('Failed!', 'Sword broke. Fine: ' + formatMoney(pen) + '.', 'Accept', null, closeModal, closeModal, 'small-modal'), 600);
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
  saveGame();
}

// ============================================================
// MINIGAME: LAWN
// ============================================================
function generateLawnCurve() {
  lawnPoints = [];
  const angle = Math.random() * Math.PI * 2;
  const freq = 0.02 + Math.random() * 0.03;
  for (let x = 20; x <= 300; x += 2) {
    lawnPoints.push({ x, y: 50 + Math.sin(x * freq + angle) * 30, traced: false });
  }
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
    const start = lawnPoints[0];
    if (Math.hypot(start.x - x, start.y - y) < 25) {
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
    if (isLawnDrawing) { isLawnDrawing = false; failLawnJob(); }
  };
  drawLawn();
}

function startLawnGame() {
  if (!game || game.selectedJobId !== 'lawn' || game.slaves['lawn']) return;
  const btn = document.getElementById('lawnStartBtn');
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) { triggerError(btn); return; }
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) { triggerNightPenalty('lawn'); return; }
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

function checkLawnAccuracy(x, y) {
  if (!isLawnDrawing) return;
  let minDist = Infinity, closestIdx = -1;
  lawnPoints.forEach((p, i) => {
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < minDist) { minDist = d; closestIdx = i; }
  });
  let drop = 0;
  if (minDist > 3) drop = 0.05 + minDist * 0.015;
  else if (minDist > 1) drop = 0.01 + minDist * 0.005;
  lawnAccuracy -= drop;
  document.getElementById('lawnAccFill').style.width = Math.max(0, lawnAccuracy) + '%';
  document.getElementById('lawnAccText').textContent = 'Accuracy: ' + Math.max(0, lawnAccuracy).toFixed(2) + '%';
  if (minDist <= 3) {
    for (let i = 0; i <= closestIdx; i++) lawnPoints[i].traced = true;
    lawnProgress = closestIdx / (lawnPoints.length - 1);
  }
  const { upg } = getJobData('lawn');
  const failTh = Math.max(50, 85 - upg.precision * 3);
  if (lawnAccuracy < failTh) { isLawnDrawing = false; failLawnJob(); }
  else if (closestIdx === lawnPoints.length - 1) { isLawnDrawing = false; finishLawnJob(true); }
  drawLawn(x, y);
}

function drawLawn(userX, userY) {
  if (!lawnCtx) return;
  lawnCtx.clearRect(0, 0, 320, 100);
  lawnCtx.lineJoin = 'round';
  lawnCtx.lineCap = 'round';
  lawnCtx.beginPath();
  lawnCtx.moveTo(lawnPoints[0].x, lawnPoints[0].y);
  for (let i = 1; i < lawnPoints.length; i++) lawnCtx.lineTo(lawnPoints[i].x, lawnPoints[i].y);
  lawnCtx.strokeStyle = '#5a4a6a';
  lawnCtx.lineWidth = 6;
  lawnCtx.stroke();
  lawnCtx.beginPath();
  for (let i = 1; i < lawnPoints.length; i++) {
    if (lawnPoints[i].traced) {
      lawnCtx.moveTo(lawnPoints[i - 1].x, lawnPoints[i - 1].y);
      lawnCtx.lineTo(lawnPoints[i].x, lawnPoints[i].y);
    }
  }
  lawnCtx.strokeStyle = '#a8c256';
  lawnCtx.lineWidth = 8;
  lawnCtx.stroke();
  const rad = 4 + Math.sin(Date.now() / 200) * 2;
  lawnCtx.fillStyle = '#f3e6c8';
  lawnCtx.beginPath();
  lawnCtx.arc(lawnPoints[0].x, lawnPoints[0].y, rad, 0, Math.PI * 2);
  lawnCtx.fill();
  const last = lawnPoints[lawnPoints.length - 1];
  lawnCtx.beginPath();
  lawnCtx.arc(last.x, last.y, rad, 0, Math.PI * 2);
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
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) { triggerNightPenalty('lawn'); document.getElementById('lawnStatusText').textContent = 'Caught!'; return; }
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
    const pen = round2(currentPay('lawn') * 2);
    game.money = round2(Math.max(0, game.money - pen));
    const cd = applyCooldownMult(30000);
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingPenalty(pen);
    showModal('Failed!', 'Lawn ruined. Fine: ' + formatMoney(pen) + '.', 'Accept', null, closeModal, closeModal, 'small-modal');
    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(false);
  }
  document.getElementById('lawnStatusText').textContent = success ? 'Success!' : 'Failed!';
  updateWorkButton();
  startCooldownTicker();
}

function failLawnJob() { finishLawnJob(false); }

// ============================================================
// MINIGAME: PLATES
// ============================================================
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
  const cd = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
  const cols = Math.ceil(game.plateLayout.length / 2);
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  game.plateLayout.forEach(num => {
    const btn = document.createElement('button');
    btn.className = 'plate-btn';
    btn.textContent = num;
    btn.disabled = cd || num < game.plateCurrentTarget;
    btn.onclick = () => clickPlate(num, btn);
    grid.appendChild(btn);
  });
}

function clickPlate(num, btn) {
  if (!game || game.selectedJobId !== 'plates' || game.slaves['plates']) return;
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) return;
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) {
    triggerNightPenalty('plates');
    generatePlateLayout(currentPlates('plates'));
    renderPlateGrid();
    return;
  }
  if (num === game.plateCurrentTarget) {
    game.plateCurrentTarget++;
    if (game.plateCurrentTarget > currentPlates('plates')) {
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
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) {
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

// ============================================================
// MINIGAME: CHEST LOCKER (Dying Light Style)
// ============================================================
function startChestGame() {
  if (!game || game.selectedJobId !== 'chest' || game.slaves['chest']) return;
  const btn = document.getElementById('chestStartBtn');
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) { triggerError(btn); return; }
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) { triggerNightPenalty('chest'); return; }

  chestActive = true;
  chestIsTurning = false;
  chestJammed = false;
  chestTotalJamTime = 0;
  chestAttemptRot = 0;
  chestAngle = 0;
  chestTarget = Math.floor(Math.random() * 360);
  chestLastFrame = 0;
  chestMaxRot = 0;

  btn.disabled = true;
  btn.classList.add('btn-cooldown');
  btn.textContent = 'Picking...';
  
  document.getElementById('chestJamFill').style.width = '0%';
  document.getElementById('chestJamText').textContent = 'Lockpick break: 0%';
  document.getElementById('chestStatusText').textContent = 'Move mouse to rotate, hold LMB to pick.';

  const canvas = document.getElementById('chestCanvas');
  canvas.style.cursor = 'crosshair';

  canvas.onmousemove = (e) => {
    if (!chestActive || chestIsTurning || chestJammed) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    chestAngle = angle;
    drawChest();
  };

  canvas.onmousedown = (e) => {
    if (!chestActive || chestJammed) return;
    if (e.button !== 0) return;
    
    chestIsTurning = true;
    chestAttemptRot = 0;
    
    let dist = Math.abs(chestAngle - chestTarget);
    if (dist > 180) dist = 360 - dist;
    
    if (dist <= 5) {
      chestMaxRot = 360;
    } else {
      chestMaxRot = Math.max(0, (180 - dist) * 2);
    }

    if (!chestLastFrame) chestLastFrame = performance.now();
    if (chestRAF) cancelAnimationFrame(chestRAF);
    chestRAF = requestAnimationFrame(animateChestLock);
  };

  window.onmouseup = () => {
    if (!chestActive) return;
    
    if (chestJammed) {
      chestTotalJamTime += (Date.now() - chestJamStartTime);
      
      if (chestTotalJamTime >= 3000) {
         chestActive = false;
         chestJammed = false;
         if (chestRAF) cancelAnimationFrame(chestRAF);
         chestRAF = null;
         window.onmouseup = null;
         finishChestJob(false);
         return;
      }

      chestJammed = false;
      chestIsTurning = false;
      document.getElementById('chestStatusText').textContent = 'Jam reset. Try again.';
    } else {
      chestIsTurning = false;
    }
    
    chestAttemptRot = 0; 
    drawChest();
  };

  drawChest();
}

function animateChestLock(ts) {
  if (!chestActive) { chestRAF = null; return; }
  if (!chestLastFrame) chestLastFrame = ts;
  const dt = Math.min(0.1, (ts - chestLastFrame) / 1000);
  chestLastFrame = ts;

  if (chestIsTurning && !chestJammed) {
    const rotAmount = 180 * dt;
    chestAngle += rotAmount;
    if (chestAngle >= 360) chestAngle -= 360;

    chestAttemptRot += rotAmount;

    if (chestAttemptRot >= 360) {
      chestAttemptRot = 360;
      drawChest();
      
      chestActive = false;
      if (chestRAF) cancelAnimationFrame(chestRAF);
      chestRAF = null;
      window.onmouseup = null;
      
      finishChestJob(true);
      return;
    }

    if (chestAttemptRot >= chestMaxRot) {
      chestJammed = true;
      chestIsTurning = false;
      chestJamStartTime = Date.now();
      document.getElementById('chestStatusText').textContent = 'JAMMED! Release LMB to reset!';
      triggerError(document.getElementById('chestCanvas'));
      startJamTimer();
    }

    drawChest();
  }

  if (chestIsTurning || chestJammed) {
    chestRAF = requestAnimationFrame(animateChestLock);
  } else {
    chestRAF = null;
  }
}

function startJamTimer() {
  const startTime = Date.now();
  const fill = document.getElementById('chestJamFill');
  const text = document.getElementById('chestJamText');

  const checkJam = () => {
    if (!chestJammed || !chestActive) return;
    const elapsed = Date.now() - startTime;
    const totalElapsed = chestTotalJamTime + elapsed;
    const limit = 3000;
    const pct = Math.min(100, Math.floor((totalElapsed / limit) * 100));
    
    fill.style.width = pct + '%';
    text.textContent = 'Lockpick break: ' + pct + '%';

    if (totalElapsed >= limit) {
      chestActive = false;
      chestJammed = false;
      if (chestRAF) cancelAnimationFrame(chestRAF);
      chestRAF = null;
      window.onmouseup = null;
      finishChestJob(false);
      return;
    }
    if (chestJammed) requestAnimationFrame(checkJam);
  };
  requestAnimationFrame(checkJam);
}

function drawChest() {
  const canvas = document.getElementById('chestCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = 300, h = 300;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, w, h);

  ctx.beginPath();
  ctx.arc(150, 150, 100, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1228';
  ctx.fill();
  ctx.strokeStyle = '#3a3350';
  ctx.lineWidth = 8;
  ctx.stroke();

  if (chestActive && chestAttemptRot > 0) {
    let startRad = -Math.PI / 2;
    let endRad = startRad + (chestAttemptRot * Math.PI / 180);
    
    // Убираем зазор в конце дуги, перекрывая её на 0.02 радиана
    if (chestAttemptRot >= 360) {
      endRad = startRad + Math.PI * 2 + 0.02;
    }

    ctx.beginPath();
    ctx.arc(150, 150, 90, startRad, endRad, false);
    ctx.strokeStyle = chestJammed ? '#b85a7a' : '#d4b8ff';
    ctx.lineWidth = 12;
    ctx.lineCap = 'butt'; 
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(140, 150);
  ctx.lineTo(160, 150);
  ctx.lineTo(160, 190);
  ctx.arc(150, 190, 10, 0, Math.PI);
  ctx.closePath();
  ctx.fillStyle = '#000';
  ctx.fill();

  const rad = chestAngle * Math.PI / 180;
  ctx.beginPath();
  ctx.moveTo(150, 150);
  ctx.lineTo(150 + Math.cos(rad) * 80, 150 + Math.sin(rad) * 80);
  ctx.strokeStyle = chestJammed ? '#b85a7a' : '#f3e6c8';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(150, 150, 6, 0, Math.PI * 2);
  ctx.fillStyle = chestJammed ? '#b85a7a' : '#f3e6c8';
  ctx.fill();
}

function finishChestJob(success) {
  chestActive = false;
  if (chestRAF) cancelAnimationFrame(chestRAF);
  window.onmouseup = null;

  const btn = document.getElementById('chestStartBtn');
  btn.disabled = true;

  if (game.timeMinutes >= 0 && game.timeMinutes < 360) {
    triggerNightPenalty('chest');
    document.getElementById('chestStatusText').textContent = 'Caught by Matilda!';
    return;
  }

  if (success) {
    game.workClicks++;
    btn.classList.add('btn-success');
    btn.textContent = 'Success!';
    document.getElementById('chestStatusText').textContent = 'Unlocked!';
    
    let pay = currentPay('chest');
    const mult = getActionMultiplier();
    pay = round2(pay * mult);

    game.money = round2(game.money + pay);
    const cd = applyCooldownMult(baseCooldown('chest'));
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
    document.getElementById('chestStatusText').textContent = 'Pick broke!';
    
    const pen = round2(currentPay('chest') * 2);
    game.money = round2(Math.max(0, game.money - pen));
    const cd = applyCooldownMult(60000); 
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingPenalty(pen);

    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(false);

    setTimeout(() => {
      showModal('Failed!', 'The lockpick broke! Matilda fined you ' + formatMoney(pen) + '.', 'Accept', null, closeModal, closeModal, 'small-modal');
    }, 600);
  }

  saveGame();
  updateWorkButton();
  startCooldownTicker();
  
  setTimeout(() => {
    document.getElementById('chestStatusText').textContent = 'Move mouse to rotate, hold LMB to pick.';
    if (btn.classList.contains('btn-cooldown')) btn.textContent = 'Cooldown';
    // Сбрасываем полоску только когда кулдаун уже пошел
    chestAttemptRot = 0;
    document.getElementById('chestJamFill').style.width = '0%';
    document.getElementById('chestJamText').textContent = 'Lockpick break: 0%';
    drawChest();
  }, 2500);
}

// ============================================================
// MINIGAME: ARMORER
// ============================================================
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
  const startC = document.getElementById('armorerStartContainer');
  const craftC = document.getElementById('armorerCraftContainer');
  if (!isCraftingActive) {
    startC.classList.remove('hidden');
    craftC.classList.add('hidden');
    const btn = document.getElementById('armorerStartBtn');
    const cd = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
    btn.disabled = !!cd;
    btn.classList.toggle('btn-cooldown', !!cd);
    btn.textContent = cd ? 'Cooldown...' : 'Start Crafting';
    return;
  }
  startC.classList.add('hidden');
  craftC.classList.remove('hidden');
  document.getElementById('armorerOrderName').textContent = 'Order: ' + RECIPES[currentRecipeIndex].name;
  const table = document.getElementById('craftTable');
  table.innerHTML = '';
  for (let i = 0; i < 36; i++) {
    const slot = document.createElement('div');
    slot.className = 'craft-slot';
    slot.dataset.index = i;
    slot.textContent = craftTableState[i] || '';
    slot.ondragover = e => { e.preventDefault(); slot.classList.add('dragover'); };
    slot.ondragleave = () => slot.classList.remove('dragover');
    slot.ondrop = e => {
      e.preventDefault();
      slot.classList.remove('dragover');
      if (!game.workCooldownEnd || Date.now() >= game.workCooldownEnd) {
        const res = e.dataTransfer.getData('text/plain');
        if (res) { craftTableState[i] = res; renderArmorerUI(); }
      }
    };
    slot.onclick = () => {
      if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) return;
      if (isDeleteMode) craftTableState[i] = null;
      else if (selectedInvItem) craftTableState[i] = selectedInvItem;
      renderArmorerUI();
    };
    table.appendChild(slot);
  }
  const inv = document.getElementById('inventoryBar');
  inv.innerHTML = '';
  RESOURCES.forEach(r => {
    const item = document.createElement('div');
    item.className = 'inv-item' + (selectedInvItem === r.id && !isDeleteMode ? ' selected' : '');
    item.textContent = r.id;
    item.title = r.name;
    item.draggable = true;
    item.ondragstart = e => {
      e.dataTransfer.setData('text/plain', r.id);
      selectedInvItem = r.id;
      isDeleteMode = false;
      renderArmorerUI();
    };
    item.onclick = () => {
      isDeleteMode = false;
      selectedInvItem = selectedInvItem === r.id ? null : r.id;
      renderArmorerUI();
    };
    inv.appendChild(item);
  });
  const delBtn = document.getElementById('deleteModeBtn');
  delBtn.classList.toggle('active', isDeleteMode);
  if (isDeleteMode) selectedInvItem = null;
  const craftBtn = document.getElementById('craftBtn');
  const cd = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
  craftBtn.disabled = !!cd;
  craftBtn.classList.toggle('btn-cooldown', !!cd);
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
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) {
    triggerNightPenalty('armorer');
    return;
  }
  const recipe = RECIPES[currentRecipeIndex];
  let success = true;
  for (let i = 0; i < 36; i++) {
    if (craftTableState[i] !== recipe.grid[i]) { success = false; break; }
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
    const pen = round2(currentPay('armorer') * 3);
    game.money = round2(Math.max(0, game.money - pen));
    const cd = applyCooldownMult(90000);
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingPenalty(pen);
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
      showModal('Failed!', 'Armor ruined. Fine: ' + formatMoney(pen) + '.', 'Accept', null, reset, reset, 'small-modal');
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
  const r = RECIPES[currentBookPage];
  let html = '<div class="book-page"><div class="book-recipe-name">' + r.name + '</div><div class="book-grid">';
  for (let i = 0; i < 36; i++) html += '<div class="book-slot">' + (r.grid[i] || '') + '</div>';
  html += '</div></div>';
  html += '<div class="book-nav">';
  html += `<button class="action-btn" onclick="prevBookPage()" ${currentBookPage === 0 ? 'disabled' : ''}>&lt;</button>`;
  html += `<div style="color:#8a7fa5;font-size:12px;">Page ${currentBookPage + 1} / ${RECIPES.length}</div>`;
  html += `<button class="action-btn" onclick="nextBookPage()" ${currentBookPage === RECIPES.length - 1 ? 'disabled' : ''}>&gt;</button>`;
  html += '</div>';
  document.getElementById('bookContent').innerHTML = html;
}

function nextBookPage() { if (currentBookPage < RECIPES.length - 1) { currentBookPage++; updateBookPageContent(); } }
function prevBookPage() { if (currentBookPage > 0) { currentBookPage--; updateBookPageContent(); } }

// ============================================================
// MINIGAME: WRITER
// ============================================================
function startWriterWork() {
  if (!game || game.selectedJobId !== 'writer') return;
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) { triggerError(document.getElementById('writerStartBtn')); return; }
  if (poems.length === 0) { alert('No poems loaded. Check poems.txt'); return; }
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
  const startC = document.getElementById('writerStartContainer');
  const activeC = document.getElementById('writerActiveContainer');
  if (!isWritingActive) {
    startC.classList.remove('hidden');
    activeC.classList.add('hidden');
    const btn = document.getElementById('writerStartBtn');
    const cd = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
    btn.disabled = !!cd;
    btn.classList.toggle('btn-cooldown', !!cd);
    btn.textContent = cd ? 'Cooldown...' : 'Start Writing';
    window.removeEventListener('keydown', handleWriterKeydown);
    return;
  }
  startC.classList.add('hidden');
  activeC.classList.remove('hidden');
  const container = document.getElementById('poemContainer');
  container.innerHTML = '';
  let gi = 0;
  for (let l = 0; l < currentPoemLines.length; l++) {
    const lineDiv = document.createElement('div');
    lineDiv.style.marginBottom = '4px';
    const lineText = currentPoemLines[l];
    for (let c = 0; c < lineText.length; c++) {
      const span = document.createElement('span');
      span.className = 'poem-char';
      span.textContent = lineText[c];
      span.id = 'char-' + gi;
      if (gi === writerIndex) span.classList.add('current');
      if (gi < writerIndex) span.classList.add('correct');
      lineDiv.appendChild(span);
      gi++;
    }
    if (l < currentPoemLines.length - 1) {
      const span = document.createElement('span');
      span.className = 'poem-char';
      span.id = 'char-' + gi;
      if (gi === writerIndex) { span.textContent = '↵'; span.classList.add('current'); }
      else if (gi < writerIndex) { span.textContent = '↵'; span.classList.add('correct'); }
      else span.textContent = '';
      lineDiv.appendChild(span);
      gi++;
    }
    container.appendChild(lineDiv);
  }
  window.removeEventListener('keydown', handleWriterKeydown);
  window.addEventListener('keydown', handleWriterKeydown);
}

const codeToChar = {
  'KeyA': 'a', 'KeyB': 'b', 'KeyC': 'c', 'KeyD': 'd', 'KeyE': 'e', 'KeyF': 'f', 'KeyG': 'g', 'KeyH': 'h', 'KeyI': 'i', 'KeyJ': 'j', 'KeyK': 'k', 'KeyL': 'l', 'KeyM': 'm', 'KeyN': 'n', 'KeyO': 'o', 'KeyP': 'p', 'KeyQ': 'q', 'KeyR': 'r', 'KeyS': 's', 'KeyT': 't', 'KeyU': 'u', 'KeyV': 'v', 'KeyW': 'w', 'KeyX': 'x', 'KeyY': 'y', 'KeyZ': 'z',
  'Space': ' ', 'Comma': ',', 'Period': '.', 'Quote': "'", 'Semicolon': ';', 'Slash': '/'
};

function handleWriterKeydown(e) {
  if (!isWritingActive) return;
  if (e.ctrlKey || e.altKey || e.metaKey || ['Tab', 'Shift', 'Backspace', 'Escape', 'CapsLock'].includes(e.key)) return;
  const expected = currentPoemText[writerIndex];
  let typed = null;
  if (e.key === 'Enter') typed = '\n';
  else if (e.code.startsWith('Key') || ['Space', 'Comma', 'Period', 'Quote', 'Semicolon', 'Slash'].includes(e.code)) typed = codeToChar[e.code];
  else if (e.key.length === 1) typed = e.key.toLowerCase();
  if (!typed) return;
  e.preventDefault();
  if (typed === expected) {
    const span = document.getElementById('char-' + writerIndex);
    if (span) { span.classList.remove('current', 'error'); span.classList.add('correct'); }
    writerIndex++;
    if (writerIndex < currentPoemText.length) {
      const nextSpan = document.getElementById('char-' + writerIndex);
      if (nextSpan) {
        nextSpan.classList.add('current');
        if (currentPoemText[writerIndex] === '\n') nextSpan.textContent = '↵';
      }
    } else finishWriterJob(true);
  } else {
    const up = game.jobUpgrades['writer'] || { mistake: 0 };
    if (up.mistake > 0 && !writerMistakeUsed) {
      writerMistakeUsed = true;
      const span = document.getElementById('char-' + writerIndex);
      if (span) { span.classList.add('error'); setTimeout(() => span.classList.remove('error'), 1000); }
    } else finishWriterJob(false);
  }
}

function finishWriterJob(success) {
  isWritingActive = false;
  window.removeEventListener('keydown', handleWriterKeydown);
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) {
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
    const pen = round2(currentPay('writer') * 2);
    game.money = round2(Math.max(0, game.money - pen));
    const cd = applyCooldownMult(60000);
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingPenalty(pen);
    startCooldownTicker();
    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(false);
    renderWriterUI();
    showModal('Failed!', 'Poem ruined. Fine: ' + formatMoney(pen) + '.', 'Accept', null, closeModal, closeModal, 'small-modal');
  }
  saveGame();
}

// ============================================================
// MINIGAME: SCIENTIST
// ============================================================
function startScientistWork() {
  if (!game || game.selectedJobId !== 'scientist') return;
  if (game.workCooldownEnd && Date.now() < game.workCooldownEnd) { triggerError(document.getElementById('scientistStartBtn')); return; }
  isResearchingActive = true;
  sciTasks = [];
  sciCurrentTaskIndex = 0;
  const up = game.jobUpgrades['scientist'] || { degree: 1 };
  const degree = up.degree || 1;

  if (degree === 1 || degree === 2) {
    const count = degree === 1 ? 10 : 7;
    for (let i = 0; i < count; i++) {
      let a = Math.floor(Math.random() * (degree === 1 ? 20 : 50)) + 1;
      let b = Math.floor(Math.random() * (degree === 1 ? 20 : 50)) + 1;
      let op, ans;
      if (degree === 1) {
        op = Math.random() < 0.5 ? '+' : '-';
        if (op === '+') ans = a + b;
        else { ans = Math.max(a, b) - Math.min(a, b); if (a < b) { const t = a; a = b; b = t; } }
      } else {
        op = Math.random() < 0.5 ? '*' : '/';
        if (op === '*') ans = a * b;
        else { ans = a; a = a * b; }
      }
      sciTasks.push({ type: 'math', question: `${a} ${op} ${b} =`, answer: ans });
    }
  } else if (degree === 3) {
    for (let i = 0; i < 5; i++) sciTasks.push({ type: 'angle', angle: Math.floor(Math.random() * 151) + 15 });
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
      sciTasks.push({ type: 'triangle', angles });
    }
  } else if (degree === 5) {
    const shuffled = [...CHEM_EQUATIONS].sort(() => 0.5 - Math.random()).slice(0, 3);
    shuffled.forEach(rx => sciTasks.push({ type: 'chem', eq: rx.eq, answers: rx.answers }));
  }

  document.getElementById('scientistStartContainer').classList.add('hidden');
  document.getElementById('scientistActiveContainer').classList.remove('hidden');
  renderScientistTask();
}

function formatChem(str) {
  if (!str) return '';
  let res = str.replace(/([A-Za-z\)])(\d+)/g, '$1<sub>$2</sub>');
  res = res.replace(/=/g, '→').replace(/\s*→\s*/g, ' → ').replace(/\s*\+\s*/g, ' + ');
  return `<span class="chem-text">${res}</span>`;
}

function renderScientistTask() {
  const task = sciTasks[sciCurrentTaskIndex];
  const tt = document.getElementById('sciTaskText');
  const cv = document.getElementById('sciCanvas');
  const btn = document.getElementById('scientistSubmitBtn');
  tt.style.display = 'none';
  tt.innerHTML = '';
  tt.classList.remove('chem-row');
  cv.classList.add('hidden');

  if (task.type === 'math') {
    tt.style.display = 'flex';
    tt.innerHTML = `${task.question} <input type="text" class="sci-input" id="sci-input-0">`;
    setTimeout(() => document.getElementById('sci-input-0').focus(), 50);
  } else if (task.type === 'angle') {
    cv.classList.remove('hidden');
    drawAngle(task.angle);
    tt.style.display = 'flex';
    tt.style.marginTop = '15px';
    tt.innerHTML = `Angle: <input type="text" class="sci-input" id="sci-input-0" placeholder="°">`;
    setTimeout(() => document.getElementById('sci-input-0').focus(), 50);
  } else if (task.type === 'triangle') {
    cv.classList.remove('hidden');
    drawTriangle(task.angles);
    tt.style.display = 'flex';
    tt.style.marginTop = '15px';
    tt.innerHTML = `<input type="text" class="sci-input" id="sci-input-0" placeholder="A"><input type="text" class="sci-input" id="sci-input-1" placeholder="B"><input type="text" class="sci-input" id="sci-input-2" placeholder="C">`;
    setTimeout(() => document.getElementById('sci-input-0').focus(), 50);
  } else if (task.type === 'chem') {
    tt.classList.add('chem-row');
    const parts = task.eq.split('_');
    let html = '';
    for (let i = 0; i < parts.length - 1; i++) {
      html += formatChem(parts[i]) + `<input type="text" class="sci-input chem" id="sci-input-${i}">`;
    }
    html += formatChem(parts[parts.length - 1]);
    tt.style.display = 'flex';
    tt.innerHTML = html;
    setTimeout(() => document.getElementById('sci-input-0').focus(), 50);
  }

  btn.textContent = sciCurrentTaskIndex === sciTasks.length - 1 ? 'Submit Final' : 'Next';
  btn.disabled = false;
  btn.classList.remove('btn-cooldown', 'btn-success', 'btn-fail');
}

function submitScientistTask() {
  if (!isResearchingActive) return;
  const task = sciTasks[sciCurrentTaskIndex];
  let success = true;
  const inputs = document.querySelectorAll('.sci-input');

  if (task.type === 'math') {
    if (parseInt(inputs[0].value) !== task.answer) { success = false; inputs[0].classList.add('error'); }
  } else if (task.type === 'angle') {
    const v = parseInt(inputs[0].value);
    if (isNaN(v) || Math.abs(v - task.angle) > 10) { success = false; inputs[0].classList.add('error'); }
  } else if (task.type === 'triangle') {
    const gA = parseInt(inputs[0].value);
    const gB = parseInt(inputs[1].value);
    const gC = parseInt(inputs[2].value);
    if (isNaN(gA) || Math.abs(gA - task.angles[0]) > 10) success = false;
    if (isNaN(gB) || Math.abs(gB - task.angles[1]) > 10) success = false;
    if (isNaN(gC) || Math.abs(gC - task.angles[2]) > 10) success = false;
    if (!success) inputs.forEach(x => x.classList.add('error'));
  } else if (task.type === 'chem') {
    for (let i = 0; i < task.answers.length; i++) {
      if (parseInt(inputs[i].value) !== task.answers[i]) { success = false; inputs[i].classList.add('error'); }
    }
  }

  if (!success) { finishScientistJob(false, task); return; }
  if (sciCurrentTaskIndex < sciTasks.length - 1) { sciCurrentTaskIndex++; renderScientistTask(); }
  else finishScientistJob(true, null);
}

function drawAngle(angle) {
  const c = document.getElementById('sciCanvas');
  const ctx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  c.width = 300 * dpr;
  c.height = 200 * dpr;
  c.style.width = '300px';
  c.style.height = '200px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, 300, 200);
  const cx = 150, cy = 100, r = 70;
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
  ctx.stroke();
}

function drawTriangle(angles) {
  const c = document.getElementById('sciCanvas');
  const ctx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  c.width = 300 * dpr;
  c.height = 200 * dpr;
  c.style.width = '300px';
  c.style.height = '200px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, 300, 200);
  const A = angles[0], B = angles[1], C = angles[2];
  const sA = Math.sin(A * Math.PI / 180);
  const sB = Math.sin(B * Math.PI / 180);
  const sC = Math.sin(C * Math.PI / 180);
  const scale = 130 / Math.max(sA, sB, sC);
  const sideA = sA * scale, sideB = sB * scale, sideC = sC * scale;
  const Cx = (sideB * sideB - sideA * sideA + sideC * sideC) / (2 * sideC);
  const Cy = Math.sqrt(Math.max(0, sideB * sideB - Cx * Cx));
  const offsetX = (300 - sideC) / 2, offsetY = 165;
  const pA = { x: offsetX, y: offsetY };
  const pB = { x: offsetX + sideC, y: offsetY };
  const pC = { x: offsetX + Cx, y: offsetY - Cy };
  ctx.beginPath();
  ctx.moveTo(pA.x, pA.y);
  ctx.lineTo(pB.x, pB.y);
  ctx.lineTo(pC.x, pC.y);
  ctx.closePath();
  ctx.strokeStyle = '#a8c256';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(168, 194, 86, 0.2)';
  ctx.fill();
  ctx.fillStyle = '#a8c256';
  ctx.font = '16px Georgia';
  ctx.fillText('A', pA.x - 15, pA.y + 5);
  ctx.fillText('B', pB.x + 5, pB.y + 5);
  ctx.fillText('C', pC.x, pC.y - 10);
}

function finishScientistJob(success, failedTask) {
  isResearchingActive = false;
  const btn = document.getElementById('scientistSubmitBtn');
  btn.disabled = true;
  if (game.timeMinutes >= 0 && game.timeMinutes < 360) { triggerNightPenalty('scientist'); return; }

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
    const pen = round2(currentPay('scientist') * 3);
    game.money = round2(Math.max(0, game.money - pen));
    const cd = applyCooldownMult(90000);
    game.workCooldownEnd = Date.now() + cd;
    game.lastCooldownDuration = cd;
    game.lastCooldownMult = getHungerMult() * getElixirMult();
    showFloatingPenalty(pen);
    startCooldownTicker();
    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    updateAllBuyButtons();
    updateBonusText();
    triggerAnim(false);
    btn.classList.add('btn-fail');
    btn.textContent = 'Failed!';
    let reason = '';
    if (failedTask) {
      if (failedTask.type === 'math') reason = 'Correct answer: ' + failedTask.answer;
      if (failedTask.type === 'angle') reason = 'Correct angle: ' + failedTask.angle + '°';
      if (failedTask.type === 'triangle') reason = `Correct angles: A=${failedTask.angles[0]}° B=${failedTask.angles[1]}° C=${failedTask.angles[2]}°`;
      if (failedTask.type === 'chem') reason = 'Correct coefficients: ' + failedTask.answers.join(', ');
    }
    setTimeout(() => {
      const reset = () => {
        closeModal();
        document.getElementById('scientistActiveContainer').classList.add('hidden');
        document.getElementById('scientistStartContainer').classList.remove('hidden');
        btn.classList.remove('btn-fail');
        renderScientistUI();
      };
      showModal('Failed!', 'Research failed. Fine: ' + formatMoney(pen) + '.<br><br><span style="color:#a8c256;font-weight:bold;">' + reason + '</span>', 'Accept', null, reset, reset, 'small-modal');
    }, 1000);
  }
  saveGame();
}

function renderScientistUI() {
  if (game.selectedJobId !== 'scientist') return;
  const startC = document.getElementById('scientistStartContainer');
  const activeC = document.getElementById('scientistActiveContainer');
  if (!isResearchingActive) {
    startC.classList.remove('hidden');
    activeC.classList.add('hidden');
    const btn = document.getElementById('scientistStartBtn');
    const cd = game.workCooldownEnd && Date.now() < game.workCooldownEnd;
    btn.disabled = !!cd;
    btn.classList.toggle('btn-cooldown', !!cd);
    btn.textContent = cd ? 'Cooldown...' : 'Start Research';
  }
}