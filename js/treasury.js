function getItemProfit(item) {
  const owned = item.owned || 0;
  const invested = item.totalInvested || 0;
  const currentValue = round2(item.currentPrice * owned);
  const profit = round2(currentValue - invested);
  const profitPct = invested > 0 ? (profit / invested) * 100 : 0;
  return { owned, invested, currentValue, profit, profitPct };
}

function formatProfit(info) {
  if (info.owned <= 0) return '';
  const color = info.profit >= 0 ? '#a8c256' : '#b85a7a';
  const sign = info.profit >= 0 ? '+' : '';
  return `<span style="color:${color}; font-weight:bold;">${sign}${formatMoney(info.profit)} (${sign}${info.profitPct.toFixed(2)}%)</span>`;
}

function processMarketTick() {
  if (!game || !game.hasTreasury) return;

  game.marketItems.forEach(item => {
    const rand = (Math.random() * 2) - 1;
    let change = Math.sign(rand) * Math.pow(Math.abs(rand), 4) * 0.25;

    if (item.streak > 0) {
      change -= item.streak * 0.01;
    } else if (item.streak < 0) {
      change += Math.abs(item.streak) * 0.01;
    }

    if (Math.random() < 0.015) {
      change = 0.6 + Math.random() * 1.0 - 1;
      item.streak = 0;
    } else {
      if (change > 0) item.streak = item.streak > 0 ? item.streak + 1 : 1;
      else if (change < 0) item.streak = item.streak < 0 ? item.streak - 1 : -1;
      else item.streak = 0;
    }

    let newPrice = item.currentPrice * (1 + change);
    if (newPrice < 1) newPrice = 1;
    item.currentPrice = newPrice;
    item.history.push(newPrice);
    if (item.history.length > 20) item.history.shift();
  });

  saveGame();
  if (document.getElementById('panel-treasury').classList.contains('active') &&
      document.getElementById('tres-market').classList.contains('active')) {
    renderMarketUI();
  }
}

function processInvestTick() {
  if (!game || !game.hasTreasury) return;

  game.investmentItems.forEach(item => {
    if ((item.owned || 0) <= 0) return;

    const base = INVEST_ITEMS.find(m => m.id === item.id);
    if (!base) return;

    const isGrowth = Math.random() < 0.7;
    const change = isGrowth
      ? base.rate * (0.8 + Math.random() * 0.4)
      : -base.rate * (0.5 + Math.random() * 1.0);

    let newPrice = item.currentPrice * (1 + change);
    if (newPrice < 1) newPrice = 1;
    item.currentPrice = newPrice;

    if (!item.history) item.history = [base.base];
    item.history.push(newPrice);
    if (item.history.length > 20) item.history.shift();
  });

  saveGame();
  if (document.getElementById('panel-treasury').classList.contains('active') &&
      document.getElementById('tres-investments').classList.contains('active')) {
    renderInvestUI();
  }
}

function switchTresTab(tabId) {
  openTresItemId = null;
  document.querySelectorAll('.tres-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tres-content').forEach(c => c.classList.remove('active'));

  if (tabId === 'market') {
    document.getElementById('tres-tab-market').classList.add('active');
    document.getElementById('tres-market').classList.add('active');
    renderMarketUI();
  } else {
    document.getElementById('tres-tab-investments').classList.add('active');
    document.getElementById('tres-investments').classList.add('active');
    renderInvestUI();
  }
}

function drawLineChart(canvas, history, isUp) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width || 500;
  const h = rect.height || 180;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  if (!history || history.length < 2) {
    ctx.fillStyle = '#6b5a8a';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Not enough data yet', w / 2, h / 2);
    return;
  }

  const pad = { left: 60, right: 15, top: 15, bottom: 20 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = (max - min) || (max * 0.1) || 1;
  const displayMin = min - range * 0.1;
  const displayMax = max + range * 0.1;
  const displayRange = displayMax - displayMin;

  ctx.strokeStyle = '#3a3350';
  ctx.lineWidth = 1;
  ctx.font = '10px Georgia';
  ctx.fillStyle = '#8a7fa5';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH * i / 4);
    const val = displayMax - (displayRange * i / 4);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText(formatMoney(val), pad.left - 5, y);
  }

  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH);
  ctx.lineTo(w - pad.right, pad.top + chartH);
  ctx.strokeStyle = '#5a4a6a';
  ctx.stroke();

  const stepX = chartW / (history.length - 1);

  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (let i = 1; i < history.length; i++) {
    const prevVal = history[i - 1];
    const currVal = history[i];
    const isGrowing = currVal >= prevVal;
    ctx.strokeStyle = isGrowing ? '#a8c256' : '#b85a7a';

    const x1 = pad.left + stepX * (i - 1);
    const y1 = pad.top + chartH - ((prevVal - displayMin) / displayRange) * chartH;
    const x2 = pad.left + stepX * i;
    const y2 = pad.top + chartH - ((currVal - displayMin) / displayRange) * chartH;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  history.forEach((v, i) => {
    const x = pad.left + stepX * i;
    const y = pad.top + chartH - ((v - displayMin) / displayRange) * chartH;

    let color;
    if (i === 0) color = '#8a7fa5';
    else color = v >= history[i - 1] ? '#a8c256' : '#b85a7a';

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderMarketInventory() {
  const inv = document.getElementById('marketInventory');
  inv.innerHTML = '';
  const owned = game.marketItems.filter(m => (m.owned || 0) > 0);
  if (!owned.length) {
    inv.innerHTML = '<div class="tres-empty">You don\'t own anything yet.</div>';
    return;
  }
  owned.forEach(item => {
    const base = MARKET_ITEMS.find(m => m.id === item.id);
    if (!base) return;
    const info = getItemProfit(item);
    const el = document.createElement('div');
    el.className = 'tres-inv-item';
    el.innerHTML =
      `<div class="tres-inv-name">${base.name}<span class="tres-inv-qty">×${formatNumber(item.owned)}</span></div>` +
      `<div class="tres-inv-value">${formatMoney(info.currentValue)}</div>` +
      `<div class="tres-inv-profit" style="color:${info.profit >= 0 ? '#a8c256' : '#b85a7a'};">` +
        `${info.profit >= 0 ? '+' : ''}${formatMoney(info.profit)} (${info.profit >= 0 ? '+' : ''}${info.profitPct.toFixed(2)}%)` +
      `</div>`;
    el.onclick = () => {
      const acc = document.querySelector(`.tres-market-item[data-id="market-${item.id}"]`);
      if (!acc) return;
      document.querySelectorAll('.tres-market-item.open').forEach(a => {
        if (a !== acc) {
          a.classList.remove('open');
          a.querySelector('.tres-item-body').classList.add('hidden');
        }
      });
      acc.classList.add('open');
      acc.querySelector('.tres-item-body').classList.remove('hidden');
      openTresItemId = `market-${item.id}`;
      acc.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const canvas = acc.querySelector('.tres-chart');
      if (canvas) {
        const first = item.history[0];
        requestAnimationFrame(() => drawLineChart(canvas, item.history, item.currentPrice >= first));
      }
    };
    inv.appendChild(el);
  });
}

function renderInvestInventory() {
  const inv = document.getElementById('investInventory');
  inv.innerHTML = '';
  const owned = game.investmentItems.filter(m => (m.owned || 0) > 0);
  if (!owned.length) {
    inv.innerHTML = '<div class="tres-empty">Your portfolio is empty.</div>';
    return;
  }
  owned.forEach(item => {
    const base = INVEST_ITEMS.find(m => m.id === item.id);
    if (!base) return;
    const info = getItemProfit(item);
    const el = document.createElement('div');
    el.className = 'tres-inv-item';
    el.innerHTML =
      `<div class="tres-inv-name">${base.name}<span class="tres-inv-qty">×${formatNumber(item.owned)}</span></div>` +
      `<div class="tres-inv-value">${formatMoney(info.currentValue)}</div>` +
      `<div class="tres-inv-profit" style="color:${info.profit >= 0 ? '#a8c256' : '#b85a7a'};">` +
        `${info.profit >= 0 ? '+' : ''}${formatMoney(info.profit)} (${info.profit >= 0 ? '+' : ''}${info.profitPct.toFixed(2)}%)` +
      `</div>`;
    el.onclick = () => {
      const acc = document.querySelector(`.tres-market-item[data-id="invest-${item.id}"]`);
      if (!acc) return;
      document.querySelectorAll('.tres-market-item.open').forEach(a => {
        if (a !== acc) {
          a.classList.remove('open');
          a.querySelector('.tres-item-body').classList.add('hidden');
        }
      });
      acc.classList.add('open');
      acc.querySelector('.tres-item-body').classList.remove('hidden');
      openTresItemId = `invest-${item.id}`;
      acc.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const canvas = acc.querySelector('.tres-chart');
      if (canvas) {
        const hist = item.history || [];
        const first = hist[0];
        requestAnimationFrame(() => drawLineChart(canvas, hist, item.currentPrice >= first));
      }
    };
    inv.appendChild(el);
  });
}

function renderMarketUI() {
  if (!game) return;
  const list = document.getElementById('marketList');
  list.innerHTML = '';

  game.marketItems.forEach(item => {
    const base = MARKET_ITEMS.find(m => m.id === item.id);
    if (!base) return;

    const prev = item.history.length >= 2 ? item.history[item.history.length - 2] : item.currentPrice;
    const changePct = prev ? ((item.currentPrice - prev) / prev * 100) : 0;
    const first = item.history[0];
    const totalPct = first ? ((item.currentPrice - first) / first * 100) : 0;
    const isTotalUp = totalPct >= 0;
    const isOpen = openTresItemId === `market-${item.id}`;
    const info = getItemProfit(item);

    const el = document.createElement('div');
    el.className = 'tres-market-item' + (isOpen ? ' open' : '');
    el.dataset.id = `market-${item.id}`;
    el.innerHTML = `
      <div class="tres-item-header" onclick="toggleTresAccordion(this)">
        <div>
          <div class="tres-item-name">${base.name}</div>
          <div class="tres-item-sub">
            Owned: ${formatNumber(item.owned || 0)} • Base: ${formatMoney(base.base)}
            ${info.owned > 0 ? ' • PnL: ' + formatProfit(info) : ''}
          </div>
        </div>
        <div class="tres-item-price-col">
          <div class="tres-item-price">${formatMoney(item.currentPrice)}</div>
          <div class="tres-item-change ${changePct >= 0 ? 'up' : 'down'}">
            ${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%
          </div>
        </div>
      </div>
      <div class="tres-item-body ${isOpen ? '' : 'hidden'}">
        <div class="tres-chart-wrapper"><canvas class="tres-chart"></canvas></div>
        <div class="tres-info">
          Change since first: <span style="color: ${isTotalUp ? '#a8c256' : '#b85a7a'}; font-weight: bold;">
            ${isTotalUp ? '+' : ''}${totalPct.toFixed(2)}%
          </span>
        </div>
        <div class="tres-controls" style="margin-top: 10px;">
          <span class="ctrl-label">Buy:</span>
          <button class="tres-btn" onclick="marketBuy('${item.id}', 1)">x1</button>
          <button class="tres-btn" onclick="marketBuy('${item.id}', 10)">x10</button>
          <button class="tres-btn" onclick="marketBuy('${item.id}', 100)">x100</button>
          <button class="tres-btn all-btn" onclick="marketBuyAll('${item.id}')">All</button>
        </div>
        <div class="tres-controls">
          <span class="ctrl-label">Sell:</span>
          <button class="tres-btn sell-btn" onclick="marketSell('${item.id}', 1)" ${(item.owned || 0) < 1 ? 'disabled' : ''}>x1</button>
          <button class="tres-btn sell-btn" onclick="marketSell('${item.id}', 10)" ${(item.owned || 0) < 10 ? 'disabled' : ''}>x10</button>
          <button class="tres-btn sell-btn" onclick="marketSell('${item.id}', 100)" ${(item.owned || 0) < 100 ? 'disabled' : ''}>x100</button>
          <button class="tres-btn sell-btn all-btn" onclick="marketSellAll('${item.id}')" ${(item.owned || 0) < 1 ? 'disabled' : ''}>All</button>
        </div>
      </div>`;
    list.appendChild(el);
  });

  renderMarketInventory();

  if (openTresItemId && openTresItemId.startsWith('market-')) {
    const acc = document.querySelector(`.tres-market-item[data-id="${openTresItemId}"]`);
    if (acc) {
      const id = openTresItemId.replace('market-', '');
      const item = game.marketItems.find(m => m.id === id);
      const canvas = acc.querySelector('.tres-chart');
      if (item && canvas) {
        const first = item.history[0];
        requestAnimationFrame(() => drawLineChart(canvas, item.history, item.currentPrice >= first));
      }
    }
  }
}

function renderInvestUI() {
  if (!game) return;
  const list = document.getElementById('investList');
  list.innerHTML = '';

  game.investmentItems.forEach(item => {
    const base = INVEST_ITEMS.find(m => m.id === item.id);
    if (!base) return;

    const history = item.history || [base.base];
    const first = history[0];
    const totalPct = first ? ((item.currentPrice - first) / first * 100) : 0;
    const isUp = totalPct >= 0;
    const isOpen = openTresItemId === `invest-${item.id}`;
    const owned = item.owned || 0;
    const info = getItemProfit(item);
    // Always show the live market price. Previously it showed base.base when
    // owned=0, but since selling no longer resets the price, the buy price
    // and the displayed price must stay consistent.
    const displayPrice = item.currentPrice;

    const el = document.createElement('div');
    el.className = 'tres-market-item' + (isOpen ? ' open' : '');
    el.dataset.id = `invest-${item.id}`;
    el.innerHTML = `
      <div class="tres-item-header" onclick="toggleTresAccordion(this)">
        <div>
          <div class="tres-item-name">${base.name}</div>
          <div class="tres-item-sub">
            Owned: ${formatNumber(owned)} • Rate: +${(base.rate * 100).toFixed(1)}%/day
            ${info.owned > 0 ? ' • PnL: ' + formatProfit(info) : ''}
          </div>
        </div>
        <div class="tres-item-price-col">
          <div class="tres-item-price">${formatMoney(displayPrice)}</div>
          <div class="tres-item-change ${isUp ? 'up' : 'down'}">
            ${isUp ? '+' : ''}${totalPct.toFixed(2)}%
          </div>
        </div>
      </div>
      <div class="tres-item-body ${isOpen ? '' : 'hidden'}">
        <div class="tres-chart-wrapper"><canvas class="tres-chart"></canvas></div>
        <div class="tres-info">
          Change: <span style="color: ${isUp ? '#a8c256' : '#b85a7a'}; font-weight: bold;">
            ${isUp ? '+' : ''}${totalPct.toFixed(2)}%
          </span>
          ${owned === 0 ? '<span style="color:#8a7fa5;"> (не растёт, пока не куплено)</span>' : ''}
        </div>
        <div class="tres-controls" style="margin-top: 10px;">
          <span class="ctrl-label">Buy:</span>
          <button class="tres-btn" onclick="investBuy('${item.id}', 1)">x1</button>
          <button class="tres-btn" onclick="investBuy('${item.id}', 10)">x10</button>
          <button class="tres-btn" onclick="investBuy('${item.id}', 100)">x100</button>
          <button class="tres-btn all-btn" onclick="investBuyAll('${item.id}')">All</button>
        </div>
        <div class="tres-controls">
          <span class="ctrl-label">Sell:</span>
          <button class="tres-btn sell-btn" onclick="investSell('${item.id}', 1)" ${owned < 1 ? 'disabled' : ''}>x1</button>
          <button class="tres-btn sell-btn" onclick="investSell('${item.id}', 10)" ${owned < 10 ? 'disabled' : ''}>x10</button>
          <button class="tres-btn sell-btn" onclick="investSell('${item.id}', 100)" ${owned < 100 ? 'disabled' : ''}>x100</button>
          <button class="tres-btn sell-btn all-btn" onclick="investSellAll('${item.id}')" ${owned < 1 ? 'disabled' : ''}>All</button>
        </div>
      </div>`;
    list.appendChild(el);
  });

  renderInvestInventory();

  if (openTresItemId && openTresItemId.startsWith('invest-')) {
    const acc = document.querySelector(`.tres-market-item[data-id="${openTresItemId}"]`);
    if (acc) {
      const id = openTresItemId.replace('invest-', '');
      const item = game.investmentItems.find(m => m.id === id);
      const canvas = acc.querySelector('.tres-chart');
      if (item && canvas) {
        const hist = item.history || [];
        const first = hist[0];
        requestAnimationFrame(() => drawLineChart(canvas, hist, item.currentPrice >= first));
      }
    }
  }
}

function toggleTresAccordion(header) {
  const item = header.closest('.tres-market-item');
  const wasOpen = item.classList.contains('open');

  document.querySelectorAll('.tres-market-item.open').forEach(a => {
    a.classList.remove('open');
    a.querySelector('.tres-item-body').classList.add('hidden');
  });
  openTresItemId = null;

  if (wasOpen) return;

  item.classList.add('open');
  item.querySelector('.tres-item-body').classList.remove('hidden');
  openTresItemId = item.dataset.id;

  const id = item.dataset.id;
  const canvas = item.querySelector('.tres-chart');

  if (id.startsWith('market-')) {
    const mId = id.replace('market-', '');
    const mItem = game.marketItems.find(m => m.id === mId);
    if (mItem && canvas) {
      const first = mItem.history[0];
      requestAnimationFrame(() => drawLineChart(canvas, mItem.history, mItem.currentPrice >= first));
    }
  } else {
    const iId = id.replace('invest-', '');
    const iItem = game.investmentItems.find(m => m.id === iId);
    if (iItem && canvas) {
      const hist = iItem.history || [];
      const first = hist[0];
      requestAnimationFrame(() => drawLineChart(canvas, hist, iItem.currentPrice >= first));
    }
  }
}

function marketBuy(id, n) {
  const it = game.marketItems.find(m => m.id === id);
  if (!it) return;
  const cost = round2(it.currentPrice * n);
  if (game.money < cost) return;

  game.money = round2(game.money - cost);
  it.owned = (it.owned || 0) + n;
  it.totalInvested = round2((it.totalInvested || 0) + cost);

  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderMarketUI();
}

function marketBuyAll(id) {
  const it = game.marketItems.find(m => m.id === id);
  if (!it) return;
  const n = Math.floor(game.money / it.currentPrice);
  if (n <= 0) return;
  const cost = round2(it.currentPrice * n);
  showModal('Confirm Purchase',
    `Buy <span style="color:#a8c256;">${formatNumber(n)}</span> for <span style="color:#a8c256;">${formatMoney(cost)}</span>?`,
    'Yes', 'Cancel',
    () => { closeModal(); marketBuy(id, n); },
    closeModal, 'small-modal');
}

function marketSell(id, n) {
  const it = game.marketItems.find(m => m.id === id);
  if (!it || (it.owned || 0) < n) return;

  const gain = round2(it.currentPrice * n);
  game.money = round2(game.money + gain);

  const avgCost = it.owned > 0 ? (it.totalInvested || 0) / it.owned : 0;
  it.totalInvested = round2(Math.max(0, (it.totalInvested || 0) - avgCost * n));
  it.owned -= n;
  if (it.owned === 0) it.totalInvested = 0;

  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderMarketUI();
}

function marketSellAll(id) {
  const it = game.marketItems.find(m => m.id === id);
  if (!it || (it.owned || 0) <= 0) return;
  showModal('Confirm Sale',
    `Sell all <span style="color:#a8c256;">${formatNumber(it.owned)}</span> for <span style="color:#a8c256;">${formatMoney(it.currentPrice * it.owned)}</span>?`,
    'Yes', 'Cancel',
    () => { closeModal(); marketSell(id, it.owned); },
    closeModal, 'small-modal');
}

function investBuy(id, n) {
  const it = game.investmentItems.find(m => m.id === id);
  if (!it) return;
  const cost = round2(it.currentPrice * n);
  if (game.money < cost) return;

  game.money = round2(game.money - cost);
  it.owned = (it.owned || 0) + n;
  it.totalInvested = round2((it.totalInvested || 0) + cost);

  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderInvestUI();
}

function investBuyAll(id) {
  const it = game.investmentItems.find(m => m.id === id);
  if (!it) return;
  const n = Math.floor(game.money / it.currentPrice);
  if (n <= 0) return;
  const cost = round2(it.currentPrice * n);
  showModal('Confirm Purchase',
    `Buy <span style="color:#a8c256;">${formatNumber(n)}</span> for <span style="color:#a8c256;">${formatMoney(cost)}</span>?`,
    'Yes', 'Cancel',
    () => { closeModal(); investBuy(id, n); },
    closeModal, 'small-modal');
}

function investSell(id, n) {
  const it = game.investmentItems.find(m => m.id === id);
  if (!it || (it.owned || 0) < n) return;

  const gain = round2(it.currentPrice * n);
  game.money = round2(game.money + gain);

  const avgCost = it.owned > 0 ? (it.totalInvested || 0) / it.owned : 0;
  it.totalInvested = round2(Math.max(0, (it.totalInvested || 0) - avgCost * n));
  it.owned -= n;

  if (it.owned <= 0) {
    it.owned = 0;
    it.totalInvested = 0;
    // Price and history are intentionally NOT reset here. The old behaviour
    // (price reset to base on full sell) allowed an infinite "buy low →
    // sell high → price resets → buy low again" loop. The market price now
    // persists, and the chart keeps its full history.
  }

  saveGame();
  document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
  renderInvestUI();
}

function investSellAll(id) {
  const it = game.investmentItems.find(m => m.id === id);
  if (!it || (it.owned || 0) <= 0) return;
  showModal('Confirm Sale',
    `Sell all <span style="color:#a8c256;">${formatNumber(it.owned)}</span> for <span style="color:#a8c256;">${formatMoney(it.currentPrice * it.owned)}</span>?`,
    'Yes', 'Cancel',
    () => { closeModal(); investSell(id, it.owned); },
    closeModal, 'small-modal');
}