function renderShop() {
  if (!game) return;
  const list = document.getElementById('shopList');
  list.innerHTML = '';

  const items = [];

  // 1. Golden Apple
  const gaPrice = getGoldenApplePrice();
  items.push({
    price: gaPrice,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Golden Apple</div><div class="shop-desc">Instantly restores 100% satiety.</div><div class="shop-current">Owned: ${game.goldenApples}</div></div><button class="shop-buy" onclick="buyGoldenApple(event)" ${game.money < gaPrice ? 'disabled' : ''}>Buy — ${formatMoney(gaPrice)}</button></div>`
  });

  // 2. Sustenance Potion
  const spPrice = getSustenancePotionPrice();
  items.push({
    price: spPrice,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Sustenance Potion</div><div class="shop-desc">Halves hunger speed for 2.5 minutes.</div><div class="shop-current">Owned: ${game.sustenancePotions}</div></div><button class="shop-buy" onclick="buySustenance(event)" ${game.money < spPrice ? 'disabled' : ''}>Buy — ${formatMoney(spPrice)}</button></div>`
  });

  // 3. Insurance Potion
  const ipPrice = getInsurancePotionPrice();
  items.push({
    price: ipPrice,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Insurance Potion</div><div class="shop-desc">Blocks all minigame fines for 2.5 minutes.</div><div class="shop-current">Owned: ${game.insurancePotions}</div></div><button class="shop-buy" onclick="buyInsurance(event)" ${game.money < ipPrice ? 'disabled' : ''}>Buy — ${formatMoney(ipPrice)}</button></div>`
  });

  // 4. Premium
  const plvl = getPremiumLevel();
  const pprice = getPremiumPrice();
  const pmaxed = plvl >= 10;
  items.push({
    price: pmaxed ? Infinity : pprice,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Premium</div><div class="shop-desc">Every 10th work click gives a multiplier.</div><div class="shop-current">${plvl > 0 ? 'Level ' + plvl + ' (x' + getPremiumMult().toFixed(1) + ')' : 'Not owned'}</div></div><button class="shop-buy" onclick="buyPremium(event)" ${pmaxed || game.money < pprice ? 'disabled' : ''}>${pmaxed ? 'MAXED' : (plvl === 0 ? 'Buy — ' : 'Upgrade — ') + formatMoney(pprice)}</button></div>`
  });

  // 5. Slave License
  items.push({
    price: game.hasSlaveLicense ? Infinity : 50,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Slave License</div><div class="shop-desc">Unlocks slaves for fully upgraded jobs.</div><div class="shop-current">${game.hasSlaveLicense ? 'Owned' : 'Not owned'}</div></div><button class="shop-buy" onclick="buyLicense(event)" ${game.hasSlaveLicense || game.money < 50 ? 'disabled' : ''}>${game.hasSlaveLicense ? 'OWNED' : 'Buy — ' + formatMoney(50)}</button></div>`
  });

  // 6. Pocket Clock
  items.push({
    price: game.hasClock ? Infinity : 1500,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Pocket Clock</div><div class="shop-desc">Shows current game time in Work tab.</div><div class="shop-current">${game.hasClock ? 'Owned' : 'Not owned'}</div></div><button class="shop-buy" onclick="buyClock(event)" ${game.hasClock || game.money < 1500 ? 'disabled' : ''}>${game.hasClock ? 'OWNED' : 'Buy — ' + formatMoney(1500)}</button></div>`
  });

  // 7. Jackpot
  const jlvl = game.jackpotLevel || 0;
  const jprice = getJackpotPrice();
  const jmaxed = jlvl >= 5;
  const jCurrentMult = jmaxed ? JACKPOT_MULTS[4] : (jlvl > 0 ? JACKPOT_MULTS[jlvl - 1] : 0);
  const jNextMult = jmaxed ? 0 : JACKPOT_MULTS[jlvl];
  items.push({
    price: jmaxed ? Infinity : jprice,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Jackpot</div><div class="shop-desc">Every 100th act gives a multiplier.${jmaxed ? '' : ' Next: x' + jNextMult + '.'}</div><div class="shop-current">${jmaxed ? 'Level 5 / 5 (x' + jCurrentMult + ')' : jlvl === 0 ? 'Not owned' : 'Level ' + jlvl + ' / 5 (x' + jCurrentMult + ')'}</div></div><button class="shop-buy" onclick="buyJackpot(event)" ${jmaxed || game.money < jprice ? 'disabled' : ''}>${jmaxed ? 'MAXED' : (jlvl === 0 ? 'Buy — ' : 'Upgrade — ') + formatMoney(jprice)}</button></div>`
  });

  // 8. Night Totem
  const totemPrice = getTotemPrice();
  items.push({
    price: totemPrice,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Night Totem</div><div class="shop-desc">One-time use. Absorbs a night penalty — no money lost, no lockout.</div><div class="shop-current">Owned: ${game.nightTotems}</div></div><button class="shop-buy" onclick="buyTotem(event)" ${game.money < totemPrice ? 'disabled' : ''}>Buy — ${formatMoney(totemPrice)}</button></div>`
  });

  // 9. Harvesting Basket
  const blvl = game.basketLevel;
  const bprice = getBasketPrice();
  items.push({
    price: blvl >= 4 ? Infinity : bprice,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Harvesting Basket</div><div class="shop-desc">More apples per pick. Longer cooldown.</div><div class="shop-current">Level ${blvl} (${blvl + 1} apples / ${3 + blvl * 2}s)</div></div><button class="shop-buy" onclick="buyBasket(event)" ${blvl >= 4 || game.money < bprice ? 'disabled' : ''}>${blvl >= 4 ? 'MAXED' : 'Upgrade — ' + formatMoney(bprice)}</button></div>`
  });

  // 10. Offline Slave Work
  const oLvl = game.offlineLevel;
  const oMax = 20;
  const oCost = oLvl === 0 ? OFFLINE_COSTS[0] : (oLvl < oMax ? OFFLINE_COSTS[oLvl] : 0);
  const oMaxed = oLvl >= oMax;
  const oCap = oLvl > 0 ? OFFLINE_CAPS_HOURS[oLvl - 1] : 0;
  const oDesc = oLvl > 0 ? `Your slaves work offline at 30% efficiency. Limit: ${oCap} hours.` : 'Unlocks offline slave earnings (30% efficiency). Limit: 1 hour.';
  items.push({
    price: oMaxed ? Infinity : oCost,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Offline Slave Work</div><div class="shop-desc">${oDesc}</div><div class="shop-current">Level ${oLvl} / ${oMax}</div></div><button class="shop-buy" onclick="buyOffline(event)" ${oMaxed || game.money < oCost ? 'disabled' : ''}>${oMaxed ? 'MAXED' : (oLvl === 0 ? 'Buy — ' : 'Upgrade — ') + formatMoney(oCost)}</button></div>`
  });

  // 11. Calendar
  const calLvl = game.calendarLevel;
  const calPrice = getCalendarPrice();
  const calDesc = calLvl === 0 ? 'Unlocks weekend bonus (Fri x2)' : calLvl === 1 ? 'Adds Saturday (x2)' : calLvl === 2 ? 'Weekend x3' : 'Maxed';
  items.push({
    price: calLvl >= 3 ? Infinity : calPrice,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Calendar</div><div class="shop-desc">${calDesc}</div><div class="shop-current">Level ${calLvl}</div></div><button class="shop-buy" onclick="buyCalendar(event)" ${calLvl >= 3 || game.money < calPrice ? 'disabled' : ''}>${calLvl >= 3 ? 'MAXED' : 'Upgrade — ' + formatMoney(calPrice)}</button></div>`
  });

  // 12. Income Meter
  items.push({
    price: game.hasPassiveIncomeMeter ? Infinity : 50000,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Income Meter</div><div class="shop-desc">Shows your slaves' total income per second next to your balance.</div><div class="shop-current">${game.hasPassiveIncomeMeter ? 'Owned' : 'Not owned'}</div></div><button class="shop-buy" onclick="buyPassiveMeter(event)" ${game.hasPassiveIncomeMeter || game.money < 50000 ? 'disabled' : ''}>${game.hasPassiveIncomeMeter ? 'OWNED' : 'Buy — ' + formatMoney(50000)}</button></div>`
  });

  // 13. Treasury
  items.push({
    price: game.hasTreasury ? Infinity : 75000,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Treasury</div><div class="shop-desc">Unlocks Market and Investments tab.</div><div class="shop-current">${game.hasTreasury ? 'Owned' : 'Not owned'}</div></div><button class="shop-buy" onclick="buyTreasury(event)" ${game.hasTreasury || game.money < 75000 ? 'disabled' : ''}>${game.hasTreasury ? 'OWNED' : 'Buy — ' + formatMoney(75000)}</button></div>`
  });

  // 14. Herbal Elixir
  const ePrice = getElixirPrice();
  items.push({
    price: ePrice,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Herbal Elixir</div><div class="shop-desc">Halves cooldowns for 5 game hours.</div><div class="shop-current">Owned: ${game.elixirs}</div></div><button class="shop-buy" onclick="buyElixir(event)" ${game.money < ePrice ? 'disabled' : ''}>Buy — ${formatMoney(ePrice)}</button></div>`
  });

  // 15. Distillery
  items.push({
    price: game.hasDistillery ? Infinity : DISTILLERY_COST,
    html: `<div class="shop-item"><div class="shop-info"><div class="shop-title">Distillery</div><div class="shop-desc">Unlocks the Distillery tab. Age wine for profit.</div><div class="shop-current">${game.hasDistillery ? 'Owned' : 'Not owned'}</div></div><button class="shop-buy" onclick="buyDistillery(event)" ${game.hasDistillery || game.money < DISTILLERY_COST ? 'disabled' : ''}>${game.hasDistillery ? 'OWNED' : 'Buy — ' + formatMoney(DISTILLERY_COST)}</button></div>`
  });

  items.sort((a, b) => a.price - b.price);
  items.forEach(item => list.innerHTML += item.html);
}

// ============================================================
// BUY FUNCTIONS
// ============================================================
function buyGoldenApple(e) {
  const p = getGoldenApplePrice();
  if (game.money < p) { triggerError(e.target); return; }
  game.money = round2(game.money - p);
  game.goldenApples++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateHungerUI();
}

function buySustenance(e) {
  const p = getSustenancePotionPrice();
  if (game.money < p) { triggerError(e.target); return; }
  game.money = round2(game.money - p);
  game.sustenancePotions++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateHungerUI();
}

function buyInsurance(e) {
  const p = getInsurancePotionPrice();
  if (game.money < p) { triggerError(e.target); return; }
  game.money = round2(game.money - p);
  game.insurancePotions++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateHungerUI();
}

function buyTotem(e) {
  const p = getTotemPrice();
  if (game.money < p) { triggerError(e.target); return; }
  game.money = round2(game.money - p);
  game.nightTotems++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateHungerUI();
}

function buyJackpot(e) {
  if (game.jackpotLevel >= 5) return;
  const p = getJackpotPrice();
  if (game.money < p) { triggerError(e.target); return; }
  game.money = round2(game.money - p);
  game.jackpotLevel++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updateBonusText();
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

function buyOffline(e) {
  if (game.offlineLevel >= 20) return;
  const cost = OFFLINE_COSTS[game.offlineLevel];
  if (game.money < cost) { triggerError(e.target); return; }
  game.money = round2(game.money - cost);
  game.offlineLevel++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
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

function buyPassiveMeter(e) {
  if (game.hasPassiveIncomeMeter || game.money < 50000) { triggerError(e.target); return; }
  game.money = round2(game.money - 50000);
  game.hasPassiveIncomeMeter = true;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderShop();
  updatePassiveIncomeUI();
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

function buyDistillery(e) {
  if (game.hasDistillery || game.money < DISTILLERY_COST) { triggerError(e.target); return; }
  game.money = round2(game.money - DISTILLERY_COST);
  game.hasDistillery = true;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  document.getElementById('tab-distillery').classList.remove('hidden');
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

// ============================================================
// ROOM / SLEEP
// ============================================================
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