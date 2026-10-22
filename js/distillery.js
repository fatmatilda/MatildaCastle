function getBarrelCost() {
  const count = game.barrels.length;
  if (count >= MAX_BARRELS) return 0;
  return 150000 * Math.pow(1.45, count - 1);
}

function getGrapeCost() {
  const level = game.grapeLevel;
  if (level >= 10) return 0;
  const prices = [0, 1000000, 3000000, 7000000, 15000000, 30000000, 50000000, 80000000, 120000000, 180000000];
  return prices[level];
}

function getBaseMustPrice() {
  return 100000 + (game.grapeLevel - 1) * 16666.67;
}

function getWineStage(startTime) {
  if (!startTime) return null;
  const elapsed = Math.floor((Date.now() - startTime) / 1000); // в секундах
  for (let stage of WINE_STAGES) {
    if (elapsed >= stage.min && elapsed < stage.max) {
      return { ...stage, elapsed };
    }
  }
  return WINE_STAGES[WINE_STAGES.length - 1];
}

function getWineSellPrice(barrel) {
  if (!barrel.startTime || !barrel.mustPrice) return 0;
  const stage = getWineStage(barrel.startTime);
  const barrelBonus = 1 + (game.barrels.length - 1) * 0.06; // 6% за каждую бочку
  return round2(barrel.mustPrice * stage.mult * barrelBonus);
}

function formatWineTime(seconds) {
  if (!seconds || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// --- Покупки ---
function upgradeGrape(e) {
  if (game.grapeLevel >= 10) return;
  const cost = getGrapeCost();
  if (game.money < cost) { triggerError(e.target); return; }
  game.money = round2(game.money - cost);
  game.grapeLevel++;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderDistilleryUI();
}

function buyBarrel(e) {
  if (game.barrels.length >= MAX_BARRELS) return;
  const cost = getBarrelCost();
  if (game.money < cost) { triggerError(e.target); return; }
  game.money = round2(game.money - cost);
  game.barrels.push({ id: Date.now(), startTime: 0, mustPrice: 0 });
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderDistilleryUI();
}

function buyButler(e) {
  if (game.hasButler || game.money < BUTLER_COST) { triggerError(e.target); return; }
  game.money = round2(game.money - BUTLER_COST);
  game.hasButler = true;
  game.butlerOn = true;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderDistilleryUI();
}

function toggleButler() {
  if (!game.hasButler) return;
  game.butlerOn = !game.butlerOn;
  saveGame();
  renderDistilleryUI();
}

function buyButler2(e) {
  if (game.hasButler2 || game.money < BUTLER2_COST) { triggerError(e.target); return; }
  game.money = round2(game.money - BUTLER2_COST);
  game.hasButler2 = true;
  game.butler2On = true;
  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderDistilleryUI();
}

function toggleButler2() {
  if (!game.hasButler2) return;
  game.butler2On = !game.butler2On;
  saveGame();
  renderDistilleryUI();
}

// --- Взаимодействие с бочками ---
function handleBarrelClick(index) {
  const barrel = game.barrels[index];
  if (!barrel) return;

  if (barrel.startTime === 0) {
    // Покупаем сусло
    const price = getBaseMustPrice();
    if (game.money < price) {
      showModal('Not Enough Money', `You need ${formatMoney(price)} to buy must.`, 'Close', null, closeModal, closeModal, 'small-modal');
      return;
    }
    game.money = round2(game.money - price);
    barrel.startTime = Date.now();
    barrel.mustPrice = price;
    saveGame();
    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    renderDistilleryUI();
  } else {
    // Продаем вино
    const sellPrice = getWineSellPrice(barrel);
    game.money = round2(game.money + sellPrice);
    const stage = getWineStage(barrel.startTime);
    
    showFloatingMoney(sellPrice, 1, false);
    if (stage.id === 'spoiled') {
      triggerError(document.getElementById('distilleryGrid')); // визуально показываем, что убыток
    } else {
      triggerAnim(true);
    }

    barrel.startTime = 0;
    barrel.mustPrice = 0;
    saveGame();
    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
    renderDistilleryUI();
  }
}

// --- Тикер и автосбор ---
function updateDistilleryTick() {
  if (!game || !game.hasDistillery) return;
  let changed = false;

  // Бултер 1: собирает вино на стадии "Great"
  if (game.hasButler && game.butlerOn) {
    game.barrels.forEach((barrel) => {
      if (barrel.startTime > 0) {
        const stage = getWineStage(barrel.startTime);
        if (stage.id === 'great' && stage.elapsed >= 420) {
          const sellPrice = getWineSellPrice(barrel);
          game.money = round2(game.money + sellPrice);
          showFloatingMoney(sellPrice, 1, true);
          barrel.startTime = 0;
          barrel.mustPrice = 0;
          changed = true;
        }
      }
    });
  }

  // Бултер 2: автоматически заливает сусло в пустые бочки
  if (game.hasButler2 && game.butler2On) {
    const price = getBaseMustPrice();
    game.barrels.forEach(barrel => {
      if (barrel.startTime === 0 && game.money >= price) {
        game.money = round2(game.money - price);
        barrel.startTime = Date.now();
        barrel.mustPrice = price;
        changed = true;
      }
    });
  }

  if (changed) {
    saveGame();
    document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  }

  if (document.getElementById('panel-distillery').classList.contains('active')) {
    renderDistilleryUI();
  }
}

// --- Отрисовка UI ---
function renderDistilleryUI() {
  if (!game) return;

  // --- Хедер (безопасное обновление) ---
  const elGrapeLevel = document.getElementById('grapeLevelText');
  if (elGrapeLevel) elGrapeLevel.textContent = game.grapeLevel;

  const elGrapeCost = document.getElementById('grapeCostText');
  if (elGrapeCost) elGrapeCost.textContent = game.grapeLevel >= 10 ? 'MAXED' : formatMoney(getGrapeCost());

  const upgradeBtn = document.getElementById('upgradeGrapeBtn');
  if (upgradeBtn) {
    upgradeBtn.disabled = game.grapeLevel >= 10 || game.money < getGrapeCost();
    if (game.grapeLevel >= 10) upgradeBtn.textContent = 'MAXED';
  }

  const elBarrelCount = document.getElementById('barrelCountText');
  if (elBarrelCount) elBarrelCount.textContent = game.barrels.length;

  const elBarrelCost = document.getElementById('barrelCostText');
  if (elBarrelCost) elBarrelCost.textContent = game.barrels.length >= MAX_BARRELS ? 'MAXED' : formatMoney(getBarrelCost());

  const buyBarrelBtn = document.getElementById('buyBarrelBtn');
  if (buyBarrelBtn) {
    buyBarrelBtn.disabled = game.barrels.length >= MAX_BARRELS || game.money < getBarrelCost();
    if (game.barrels.length >= MAX_BARRELS) buyBarrelBtn.textContent = 'MAXED';
  }

  const elButlerStatus = document.getElementById('butlerStatus');
  if (elButlerStatus) elButlerStatus.textContent = game.hasButler ? (game.butlerOn ? 'ON' : 'OFF') : 'Not owned';

  const butlerBuyBtn = document.getElementById('butlerBuyBtn');
  const butlerToggleBtn = document.getElementById('butlerToggleBtn');
  
  if (butlerBuyBtn && butlerToggleBtn) {
    if (game.hasButler) {
      butlerBuyBtn.classList.add('hidden');
      butlerToggleBtn.classList.remove('hidden');
      butlerToggleBtn.textContent = game.butlerOn ? 'Turn OFF' : 'Turn ON';
      butlerToggleBtn.style.borderColor = game.butlerOn ? '#a8c256' : '#b85a7a';
      butlerToggleBtn.style.color = game.butlerOn ? '#a8c256' : '#b85a7a';
    } else {
      butlerBuyBtn.classList.remove('hidden');
      butlerToggleBtn.classList.add('hidden');
      butlerBuyBtn.textContent = `Buy — ${formatMoney(BUTLER_COST)}`;
      butlerBuyBtn.disabled = game.money < BUTLER_COST;
    }
  }

  const elButler2Status = document.getElementById('butler2Status');
  if (elButler2Status) elButler2Status.textContent = game.hasButler2 ? (game.butler2On ? 'ON' : 'OFF') : 'Not owned';

  const butler2BuyBtn = document.getElementById('butler2BuyBtn');
  const butler2ToggleBtn = document.getElementById('butler2ToggleBtn');
  
  if (butler2BuyBtn && butler2ToggleBtn) {
    if (game.hasButler2) {
      butler2BuyBtn.classList.add('hidden');
      butler2ToggleBtn.classList.remove('hidden');
      butler2ToggleBtn.textContent = game.butler2On ? 'Turn OFF' : 'Turn ON';
      butler2ToggleBtn.style.borderColor = game.butler2On ? '#a8c256' : '#b85a7a';
      butler2ToggleBtn.style.color = game.butler2On ? '#a8c256' : '#b85a7a';
    } else {
      butler2BuyBtn.classList.remove('hidden');
      butler2ToggleBtn.classList.add('hidden');
      butler2BuyBtn.textContent = `Buy — ${formatMoney(BUTLER2_COST)}`;
      butler2BuyBtn.disabled = game.money < BUTLER2_COST;
    }
  }

  // --- Сетка бочек ---
  const grid = document.getElementById('distilleryGrid');
  if (!grid) return;

  if (grid.children.length !== game.barrels.length) {
    grid.innerHTML = '';
    for (let i = 0; i < game.barrels.length; i++) {
      const el = document.createElement('div');
      el.className = 'barrel';
      el.dataset.index = i;
      el.onclick = ((idx) => () => handleBarrelClick(idx))(i);
      grid.appendChild(el);
    }
  }

  game.barrels.forEach((barrel, index) => {
    const el = grid.children[index];
    if (!el) return;

    if (barrel.startTime === 0) {
      if (!el.classList.contains('empty')) {
        el.classList.add('empty');
        el.innerHTML = `<div style="font-size:20px; margin-bottom:2px;">🛢️</div><div class="empty-price" style="font-size:11px; line-height:1.2;">Buy Must<br>${formatMoney(getBaseMustPrice())}</div>`;
      } else {
        const priceEl = el.querySelector('.empty-price');
        if (priceEl) {
          const newHtml = `Buy Must<br>${formatMoney(getBaseMustPrice())}`;
          if (priceEl.innerHTML !== newHtml) priceEl.innerHTML = newHtml;
        }
      }
    } else {
      el.classList.remove('empty');
      const stage = getWineStage(barrel.startTime);
      const sellPrice = getWineSellPrice(barrel);
      const pct = Math.min(100, (stage.elapsed / 600) * 100);

      if (!el.querySelector('.wine-name')) {
        el.innerHTML = `
          <div class="wine-name" style="font-size:11px; line-height:1.2; margin-bottom:2px;"></div>
          <div class="wine-timer" style="font-size:10px;"></div>
          <div class="wine-price" style="font-size:11px; margin-top:2px;"></div>
          <div class="barrel-progress-bg">
            <div class="barrel-progress-fill"></div>
          </div>
        `;
      }

      const nameEl = el.querySelector('.wine-name');
      const timerEl = el.querySelector('.wine-timer');
      const priceEl = el.querySelector('.wine-price');
      const fillEl = el.querySelector('.barrel-progress-fill');

      if (nameEl) {
        if (nameEl.textContent !== stage.name) nameEl.textContent = stage.name;
        if (nameEl.style.color !== stage.color) nameEl.style.color = stage.color;
      }
      if (timerEl) {
        const timeStr = formatWineTime(stage.elapsed);
        if (timerEl.textContent !== timeStr) timerEl.textContent = timeStr;
      }
      if (priceEl) {
        const priceStr = formatMoney(sellPrice);
        if (priceEl.textContent !== priceStr) priceEl.textContent = priceStr;
      }
      if (fillEl) {
        fillEl.style.width = pct + '%';
        fillEl.style.backgroundColor = stage.color;
      }
    }
  });
}

function openDistilleryBook() {
  const bonus = 6 * (game.barrels.length - 1);
  const basePrice = Math.round(100000 + (game.grapeLevel - 1) * 16666.67);
  const currentBase = Math.round(basePrice * (1 + bonus / 100));

  let stagesHtml = '';
  WINE_STAGES.forEach(stage => {
    let timeText;
    if (stage.id === 'spoiled') {
      timeText = '10:00+';
    } else {
      const min = Math.floor(stage.min / 60);
      const minS = stage.min % 60;
      const max = Math.floor(stage.max / 60);
      const maxS = stage.max % 60;
      timeText = `${min}:${minS < 10 ? '0' : ''}${minS} – ${max}:${maxS < 10 ? '0' : ''}${maxS}`;
    }
    const priceStr = formatMoney(currentBase * stage.mult);
    stagesHtml += `
      <tr style="border-bottom: 1px solid #2a2038;">
        <td style="color:${stage.color}; font-weight:bold; padding: 8px 4px;">${stage.name}</td>
        <td style="font-family:monospace; padding: 8px 4px;">${timeText}</td>
        <td style="text-align:center; padding: 8px 4px;">x${stage.mult}</td>
        <td style="text-align:right; color:#a8c256; font-weight:bold; padding: 8px 4px;">${priceStr}</td>
      </tr>`;
  });

  const html = `
    <div class="rules-content active" style="display:block;">
      <h3 style="margin-top:0;">Wine Aging Stages</h3>
      <p style="font-size:12px; margin-bottom:12px; color:#8a7fa5;">Price shows value for your current setup (<b>${formatMoney(currentBase)}</b> per must).</p>
      
      <div style="width: 100%; margin-bottom: 24px;">
        <table style="width:100%; font-size:12px; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid #5a4a6a;">
              <th style="text-align:left; padding:6px 4px; color:#8a7fa5; font-weight:normal; letter-spacing:1px;">Stage</th>
              <th style="text-align:left; padding:6px 4px; color:#8a7fa5; font-weight:normal; letter-spacing:1px;">Time</th>
              <th style="text-align:center; padding:6px 4px; color:#8a7fa5; font-weight:normal; letter-spacing:1px;">Mult</th>
              <th style="text-align:right; padding:6px 4px; color:#8a7fa5; font-weight:normal; letter-spacing:1px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${stagesHtml}
          </tbody>
        </table>
      </div>

      <h3>How It Works</h3>
      <ul style="font-size:12px; line-height: 1.6; margin-bottom: 20px; padding-left: 18px;">
        <li>Click an <b>empty barrel</b> to buy must and start aging.</li>
        <li>Click an <b>aging barrel</b> to sell the wine at its current stage.</li>
        <li>Perfect timing is <b>Exquisite (9:30 – 10:00)</b> — x10 price.</li>
        <li>After 10 minutes, wine <b>spoils</b> — you lose almost everything.</li>
        <li>Each extra barrel gives <b>+6%</b> to the value of ALL wine.</li>
      </ul>

      <h3>Your Current Bonuses</h3>
      <ul style="font-size:12px; line-height: 1.6; margin-bottom: 20px; padding-left: 18px;">
        <li>Grape Level: <b>${game.grapeLevel} / 10</b> (base must: ${formatMoney(basePrice)})</li>
        <li>Barrels Owned: <b>${game.barrels.length} / 20</b> (+${bonus}% value)</li>
        <li>Total Base per Must: <b style="color:#a8c256;">${formatMoney(currentBase)}</b></li>
        <li>Butler: <b>${game.hasButler ? (game.butlerOn ? 'ON (collects at Great)' : 'OFF') : 'Not owned'}</b></li>
      </ul>

      <h3>Butler (Auto-Collector)</h3>
      <ul style="font-size:12px; line-height: 1.6; margin-bottom: 20px; padding-left: 18px;">
        <li>Automatically sells wine when it reaches <b>Great</b> stage (x3).</li>
        <li>Safe income, but you can't reach Exquisite (x10) with it.</li>
        <li>Can be toggled ON/OFF at any time.</li>
      </ul>

      <h3>Brewer (Auto-Buyer)</h3>
      <ul style="font-size:12px; line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
        <li>Automatically buys must and fills empty barrels.</li>
        <li>Works perfectly with the Butler to create a fully automated passive income loop.</li>
        <li>Can be toggled ON/OFF at any time.</li>
      </ul>
    </div>`;

  showModal('Distillery Rules', html, 'Close', null, closeModal, closeModal, 'book-modal');
}