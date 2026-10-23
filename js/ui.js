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

function hideAllScenes() {
  ['mainMenu', 'chapterSelect', 'chapterDesc'].forEach(id => document.getElementById(id).classList.add('hidden'));
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
  if (lawnAnimInterval) { clearInterval(lawnAnimInterval); lawnAnimInterval = null; }
  if (uiInterval) { clearInterval(uiInterval); uiInterval = null; }
  if (marketTickInterval) { clearInterval(marketTickInterval); marketTickInterval = null; }
  if (investTickInterval) { clearInterval(investTickInterval); investTickInterval = null; }
  if (distilleryTickInterval) { clearInterval(distilleryTickInterval); distilleryTickInterval = null; }
  if (appleRAF) { cancelAnimationFrame(appleRAF); appleRAF = null; }
  if (swordRAF) { cancelAnimationFrame(swordRAF); swordRAF = null; }
  window.removeEventListener('keydown', handleWriterKeydown);
}

function showModal(title, text, confirmLabel, cancelLabel, onConfirm, onCancel, customClass = '') {
  const root = document.getElementById('modalRoot');
  const cancelHtml = cancelLabel ? '<button id="modalCancel">' + cancelLabel + '</button>' : '';
  const isSpecial = ['Changelog', 'Statistics', 'Rules', 'Crafting Book', 'Outside', 'Slept', 'Promo Codes'].includes(title) || title.startsWith('Update');
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
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target.id === 'modalOverlay' && typeof onCancel === 'function') onCancel();
  });
}

function closeModal() {
  document.getElementById('modalRoot').innerHTML = '';
}

function showMenu() {
  stopAllIntervals();
  saveGame();
  showScene('mainMenu');
  checkVersionPopup();
}

function showChapters() {
  showScene('chapterSelect');
}

function selectChapter(n) {
  currentChapter = n;
  document.getElementById('continueBtn').disabled = !hasSave(n);
  showScene('chapterDesc');
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
    if (!res.ok) throw new Error();
    const text = await res.text();
    text.trim().split(/\n\s*\n/).forEach((block, i) => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 2) return;
      const hp = lines[0].split('|');
      const version = hp[0].trim();
      const date = hp[1] ? hp[1].trim() : '';
      html += `<div class="clog-item${i === 0 ? ' open' : ''}"><div class="clog-header" onclick="toggleChangelog(this)"><div><h3>${version}</h3><span class="date">${date}</span></div><span class="arrow">▶</span></div><div class="clog-body ${i === 0 ? '' : 'hidden'}"><ul>${lines.slice(1).map(c => `<li>${c.replace(/^-\s*/, '')}</li>`).join('')}</ul></div></div>`;
    });
  } catch (e) {
    html += '<div class="clog-item open"><div class="clog-header"><h3>Changelog Unavailable</h3></div></div>';
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
        '<div style="text-align:left;line-height:1.6;font-size:14px;">New in this version:<br><br>• Added Income Meter.<br>• Shop items sorted by price.</div>',
        'Okay', null, markSeen, markSeen
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
  showModal('Rules',
    '<div class="rules-tabs">' +
      '<button class="rules-tab active" onclick="switchRulesTab(\'basics\', event)">Basics</button>' +
      '<button class="rules-tab" onclick="switchRulesTab(\'time\', event)">Time</button>' +
      '<button class="rules-tab" onclick="switchRulesTab(\'hunger\', event)">Hunger</button>' +
      '<button class="rules-tab" onclick="switchRulesTab(\'shop\', event)">Shop</button>' +
    '</div>' +
    '<div class="rules-content active" id="rules-basics"><h3>Goal</h3><p>Earn money to buy a Coca-Cola. Give it to Matilda to escape.</p><h3>Work</h3><p>Each job has pay and cooldown. Upgrades improve them.</p></div>' +
    '<div class="rules-content" id="rules-time"><h3>Day & Night</h3><p>1 hour = 30 real sec.</p><h3>Night Work</h3><p>Forbidden. Fine: 12.5x pay + slave night earnings.</p><h3>Sleep</h3><p>Once per day (8h). 5% balance, -25% satiety.</p></div>' +
    '<div class="rules-content" id="rules-hunger"><h3>Satiety</h3><p>-1% every 12s.</p><h3>Apples</h3><p>+5% each in Garden.</p><h3>Elixirs</h3><p>Halve cooldowns for 5 game hours.</p></div>' +
    '<div class="rules-content" id="rules-shop"><h3>Premium</h3><p>Every 10th click extra multiplier.</p><h3>Calendar</h3><p>Weekend bonuses.</p><h3>Slaves</h3><p>Automate upgraded jobs.</p><h3>Clock</h3><p>Shows time in Work.</p><h3>Treasury</h3><p>Market speculation + investments.</p><h3>Distillery</h3><p>Age wine for profit. Butler auto-collects Great wine.</p></div>',
    'Close', null, closeModal, closeModal);
}

function showStats() {
  const g = getGlobalStats();
  const s = getSave()[currentChapter] || { playTime: 0 };
  const c = g.chapterStats[1];
  const html =
    '<div class="stats-tabs">' +
      '<button class="stats-tab active" onclick="switchStatsTab(\'overall\', event)">Overall</button>' +
      '<button class="stats-tab" onclick="switchStatsTab(\'ch1\', event)">Chapter I</button>' +
    '</div>' +
    '<div class="stats-content active" id="stats-overall"><div class="stats-highlight"><div class="stats-highlight-title">Total Time</div><div class="stats-highlight-value">' + formatTime(g.totalPlayTime) + '</div></div></div>' +
    '<div class="stats-content" id="stats-ch1"><div class="stats-highlight"><div class="stats-highlight-title">Chapter I Time</div><div class="stats-highlight-value">' + formatTime(c.totalTime) + '</div></div><div class="stats-row"><span>Current Save</span><span>' + formatTime(s.playTime) + '</span></div><div class="stats-row"><span>Started / Completed</span><span>' + c.started + ' / ' + c.completed + '</span></div></div>';
  showModal('Statistics', html, 'Close', null, closeModal, closeModal);
}

function switchStatsTab(tabId, e) {
  document.querySelectorAll('.stats-tab').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  document.querySelectorAll('.stats-content').forEach(c => c.classList.remove('active'));
  document.getElementById('stats-' + tabId).classList.add('active');
}

function requestNewGame() {
  if (!hasSave(currentChapter)) {
    startNewGame();
    return;
  }
  showModal('Start Over?', 'All progress will be erased.', 'Start Over', 'Cancel',
    () => { closeModal(); startNewGame(); }, closeModal);
}

function backToMenu() {
  stopAllIntervals();
  const bar = document.getElementById('cooldownBar');
  if (bar) bar.classList.add('inactive');
  document.getElementById('cooldownFill').style.width = '0%';
  document.getElementById('cooldownText').textContent = '0.0s';
  showMenu();
}

function openPromoModal() {
  showModal('Promo Codes',
    `<div style="text-align:center; padding: 10px 0;">
      <p>Enter your promo code below:</p>
      <input type="text" id="promoInput" class="sci-input" style="width: 220px; font-size: 16px; margin-bottom: 10px; text-transform: none;" placeholder="Code">
      <div id="promoError" style="color: #b85a7a; font-size: 13px; min-height: 20px; font-weight: bold;"></div>
    </div>`,
    'Activate',
    'Cancel',
    () => submitPromoCode(),
    closeModal,
    'small-modal'
  );
  
  setTimeout(() => {
    const inp = document.getElementById('promoInput');
    if (inp) {
      inp.focus();
      inp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitPromoCode();
      });
    }
  }, 100);
}

async function submitPromoCode() {
  const input = document.getElementById('promoInput');
  const errorEl = document.getElementById('promoError');
  if (!input || !errorEl) return;
  
  const code = input.value.trim();
  if (!code) {
    errorEl.textContent = 'Please enter a code.';
    return;
  }

  if (game.usedPromos.includes(code)) {
    errorEl.textContent = 'You have already used this code!';
    return;
  }

  errorEl.textContent = 'Checking...';
  errorEl.style.color = '#8a7fa5';

  try {
    const res = await fetch('codes.txt');
    if (!res.ok) throw new Error('Failed to load codes');
    const text = await res.text();
    
    let found = null;
    const lines = text.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      const parts = line.split('-');
      if (parts.length < 2) continue;
      const c = parts[0].trim();
      if (c === code) {
        const rewardPart = parts[1].trim();
        const [type, amountStr] = rewardPart.split(':');
        const amount = parseInt(amountStr, 10);
        if (!isNaN(amount)) {
          found = { type: type.trim(), amount };
        }
        break;
      }
    }

    if (!found) {
      errorEl.textContent = 'Invalid code.';
      errorEl.style.color = '#b85a7a';
      return;
    }

    if (found.type === 'm') {
      game.money = round2(game.money + found.amount);
      document.getElementById('balanceDisplay').textContent = formatMoney(game.money);
      errorEl.textContent = `+ $${found.amount}`;
      errorEl.style.color = '#a8c256';
    } else if (found.type === 'a') {
      game.apples += found.amount;
      updateHungerUI();
      errorEl.textContent = `+ ${found.amount} Apples`;
      errorEl.style.color = '#a8c256';
    } else if (found.type === 'e') {
      game.elixirs += found.amount;
      updateHungerUI();
      errorEl.textContent = `+ ${found.amount} Elixirs`;
      errorEl.style.color = '#a8c256';
    } else {
      errorEl.textContent = 'Unknown reward type.';
      errorEl.style.color = '#b85a7a';
      return;
    }

    game.usedPromos.push(code);
    saveGame();
    
    input.disabled = true;
    document.getElementById('modalConfirm').disabled = true;
    
    setTimeout(() => { closeModal(); }, 2000);

  } catch (e) {
    errorEl.textContent = 'Error loading codes. (Make sure codes.txt exists)';
    errorEl.style.color = '#b85a7a';
  }
}