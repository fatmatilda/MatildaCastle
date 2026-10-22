function renderShop() {
  if (!game) return;
  const list = document.getElementById('shopList');
  list.innerHTML = '';

  const plvl = getPremiumLevel();
  const pprice = getPremiumPrice();
  const pmaxed = plvl >= 10;
  const pBtn = pmaxed ? 'MAXED' : (plvl === 0 ? 'Buy — ' : 'Upgrade — ') + formatMoney(pprice);
  const pCur = plvl > 0 ? 'Level ' + plvl + ' (x' + getPremiumMult().toFixed(1) + ')' : 'Not owned';
  list.innerHTML += `<div class="shop-item"><div class="shop-info"><div class="shop-title">Premium</div><div class="shop-desc">Every 10th work click gives a multiplier.</div><div class="shop-current">${pCur}</div></div><button class="shop-buy" onclick="buyPremium(event)" ${pmaxed || game.money < pprice ? 'disabled' : ''}>${pBtn}</button></div>`;

  const lBtn = game.hasSlaveLicense ? 'OWNED' : 'Buy — ' + formatMoney(50);
  list.innerHTML += `<div class="shop-item"><div class="shop-info"><div class="shop-title">Slave License</div><div class="shop-desc">Unlocks slaves for fully upgraded jobs.</div><div class="shop-current">${game.hasSlaveLicense ? 'Owned' : 'Not owned'}</div></div><button class="shop-buy" onclick="buyLicense(event)" ${game.hasSlaveLicense || game.money < 50 ? 'disabled' : ''}>${lBtn}</button></div>`;

  const cBtn = game.hasClock ? 'OWNED' : 'Buy — ' + formatMoney(1500);
  list.innerHTML += `<div class="shop-item"><div class="shop-info"><div class="shop-title">Pocket Clock</div><div class="shop-desc">Shows current game time in Work tab.</div><div class="shop-current">${game.hasClock ? 'Owned' : 'Not owned'}</div></div><button class="shop-buy" onclick="buyClock(event)" ${game.hasClock || game.money < 1500 ? 'disabled' : ''}>${cBtn}</button></div>`;

  const tBtn = game.hasTreasury ? 'OWNED' : 'Buy — ' + formatMoney(75000);
  list.innerHTML += `<div class="shop-item"><div class="shop-info"><div class="shop-title">Treasury</div><div class="shop-desc">Unlocks Market and Investments tab.</div><div class="shop-current">${game.hasTreasury ? 'Owned' : 'Not owned'}</div></div><button class="shop-buy" onclick="buyTreasury(event)" ${game.hasTreasury || game.money < 75000 ? 'disabled' : ''}>${tBtn}</button></div>`;

  const blvl = game.basketLevel;
  const bprice = getBasketPrice();
  const bBtn = blvl >= 4 ? 'MAXED' : 'Upgrade — ' + formatMoney(bprice);
  list.innerHTML += `<div class="shop-item"><div class="shop-info"><div class="shop-title">Harvesting Basket</div><div class="shop-desc">More apples per pick. Longer cooldown.</div><div class="shop-current">Level ${blvl} (${blvl + 1} apples / ${3 + blvl * 2}s)</div></div><button class="shop-buy" onclick="buyBasket(event)" ${blvl >= 4 || game.money < bprice ? 'disabled' : ''}>${bBtn}</button></div>`;

  const ePrice = getElixirPrice();
  list.innerHTML += `<div class="shop-item"><div class="shop-info"><div class="shop-title">Herbal Elixir</div><div class="shop-desc">Halves cooldowns for 5 game hours.</div><div class="shop-current">Owned: ${game.elixirs}</div></div><button class="shop-buy" onclick="buyElixir(event)" ${game.money < ePrice ? 'disabled' : ''}>Buy — ${formatMoney(ePrice)}</button></div>`;

  const calLvl = game.calendarLevel;
  const calPrice = getCalendarPrice();
  const calBtn = calLvl >= 3 ? 'MAXED' : 'Upgrade — ' + formatMoney(calPrice);
  const calDesc = calLvl === 0 ? 'Unlocks weekend bonus (Sat x2)' : calLvl === 1 ? 'Adds Sunday (x2)' : calLvl === 2 ? 'Weekend x3' : 'Maxed';
  list.innerHTML += `<div class="shop-item"><div class="shop-info"><div class="shop-title">Calendar</div><div class="shop-desc">${calDesc}</div><div class="shop-current">Level ${calLvl}</div></div><button class="shop-buy" onclick="buyCalendar(event)" ${calLvl >= 3 || game.money < calPrice ? 'disabled' : ''}>${calBtn}</button></div>`;
}

function buyPremium(e) {
  if (game.premiumLevel >= 10) return;
  const p = getPremiumPrice();
  if (game.money < p) { triggerError(e.target); return; }
  game.money = round2(game.money - p);
  game.premiumLevel++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateAllBuyButtons();
  updateBonusText();
}

function buyLicense(e) {
  if (game.hasSlaveLicense || game.money < 50) { triggerError(e.target); return; }
  game.money = round2(game.money - 50);
  game.hasSlaveLicense = true;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateAllBuyButtons();
  renderJobs();
}

function buyClock(e) {
  if (game.hasClock || game.money < 1500) { triggerError(e.target); return; }
  game.money = round2(game.money - 1500);
  game.hasClock = true;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateAllBuyButtons();
  updateClockUI();
}

function buyTreasury(e) {
  if (game.hasTreasury || game.money < 75000) { triggerError(e.target); return; }
  game.money = round2(game.money - 75000);
  game.hasTreasury = true;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  document.getElementById('tab-treasury').classList.remove('hidden');
  renderShop();
  updateAllBuyButtons();
}

function buyBasket(e) {
  if (game.basketLevel >= 4) return;
  const p = getBasketPrice();
  if (game.money < p) { triggerError(e.target); return; }
  game.money = round2(game.money - p);
  game.basketLevel++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
}

function buyElixir(e) {
  const p = getElixirPrice();
  if (game.money < p) { triggerError(e.target); return; }
  game.money = round2(game.money - p);
  game.elixirs++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateHungerUI();
}

function buyCalendar(e) {
  if (game.calendarLevel >= 3) return;
  const p = getCalendarPrice();
  if (game.money < p) { triggerError(e.target); return; }
  game.money = round2(game.money - p);
  game.calendarLevel++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  renderCalendar();
}

// ---- Room / Sleep ----
function checkWindow() {
  if (!game) return;
  let diff = game.timeMinutes - game.lastCurtainTime;
  if (diff < 0) diff += 1440;
  if (diff < 120) {
    showModal('Try Later', 'You can look out once every 2 game hours.', 'Close', null, closeModal, closeModal, 'small-modal');
    return;
  }
  game.lastCurtainTime = game.timeMinutes;
  saveGame();
  const left = document.getElementById('curtainLeft');
  const right = document.getElementById('curtainRight');
  if (left && right) {
    left.classList.remove('closed');
    right.classList.remove('closed');
    setTimeout(() => {
      left.classList.add('closed');
      right.classList.add('closed');
    }, 2000);
  }
}

function sleep() {
  if (!game) return;
  if (game.lastSleepDay === game.dayOfWeek) {
    showModal('Already Slept', 'You already slept today. Skip day for 35% fine?',
      'Pay Fine', 'Cancel',
      () => { closeModal(); executeSleep(true); },
      closeModal, 'small-modal');
    return;
  }
  executeSleep(false);
}

function executeSleep(forced) {
  const left = document.getElementById('curtainLeft');
  const right = document.getElementById('curtainRight');
  const overlay = document.getElementById('sleepOverlay');
  const proceed = () => {
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    setTimeout(() => {
      let cost = round2(game.money * 0.05);
      if (forced) cost += round2(game.money * 0.35);
      if (cost > 0) {
        game.money = round2(game.money - cost);
        showFloatingPenalty(cost);
      }
      const totalMins = game.timeMinutes + 480;
      const daysPassed = Math.floor(totalMins / 1440);
      game.timeMinutes = totalMins % 1440;
      if (daysPassed > 0) game.dayOfWeek = (game.dayOfWeek + daysPassed) % 7;
      game.lastSleepDay = game.dayOfWeek;
      game.satiety = Math.max(0, game.satiety - 25);
      game.slaveNightEarnings = 0;
      updateSkyUI();
      updateClockUI();
      updateHungerUI();
      renderCalendar();
      saveGame();
      const end = () => {
        closeModal();
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      };
      let costText = '';
      if (cost > 0) {
        costText = `<div style="font-size:12px;color:#b8a37a;margin-top:4px;">${forced ? 'Tax + Fine' : 'Tax'}: ${formatMoney(cost)}</div>`;
      }
      showModal('Slept',
        `<div style="font-size:16px;color:#e8e3d8;">Slept 8 hours.</div><div style="font-size:12px;color:#b8a37a;">Satiety -25%</div>${costText}`,
        'Close', null, end, end, 'small-modal');
      document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    }, 1000);
  };
  if (!left.classList.contains('closed')) {
    left.classList.add('closed');
    right.classList.add('closed');
    setTimeout(proceed, 800);
  } else proceed();
}