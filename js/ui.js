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
  if (typeof artistFlashTimeout !== 'undefined' && artistFlashTimeout) { clearTimeout(artistFlashTimeout); artistFlashTimeout = null; }
  if (typeof artistCountdownTimeout !== 'undefined' && artistCountdownTimeout) { clearTimeout(artistCountdownTimeout); artistCountdownTimeout = null; }
  window.removeEventListener('keydown', handleWriterKeydown);
}

function showModal(title, text, confirmLabel, cancelLabel, onConfirm, onCancel, customClass = '') {
  const root = document.getElementById('modalRoot');
  const cancelHtml = cancelLabel ? '<button id="modalCancel">' + cancelLabel + '</button>' : '';
  const isSpecial = ['Changelog', 'Statistics', 'Rules', 'Crafting Book', 'Outside', 'Slept', 'Promo Codes', 'Saved by the Totem!'].includes(title) || title.startsWith('Update');
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

function showChapters() { showScene('chapterSelect'); }

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
  } catch (e) { html += '<div class="clog-item open"><div class="clog-header"><h3>Changelog Unavailable</h3></div></div>'; }
  html += '</div>';
  showModal('Changelog', html, 'Close', null, closeModal, closeModal);
}

function checkVersionPopup() {
  if (updateShown) return;
  if (localStorage.getItem('seen_' + CURRENT_VERSION) !== 'true') {
    updateShown = true;
    setTimeout(() => {
      const markSeen = () => { localStorage.setItem('seen_' + CURRENT_VERSION, 'true'); closeModal(); };
      showModal(
        'Update ' + CURRENT_VERSION,
        '<div style="text-align:left;line-height:1.6;font-size:14px;">New in this version:<br><br>• Added Jackpot upgrade (x5–x30 every 100th act)<br>• Added Golden Apple, Sustenance Potion, Insurance Potion<br>• Added Night Totem — survives night penalty<br>• All consumable prices scale with your top job\'s base pay<br>• Sustenance halves hunger speed, Insurance blocks minigame fines</div>',
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
      '<button class="rules-tab" onclick="switchRulesTab(\'jobs\', event)">Jobs</button>' +
      '<button class="rules-tab" onclick="switchRulesTab(\'time\', event)">Time</button>' +
      '<button class="rules-tab" onclick="switchRulesTab(\'items\', event)">Items</button>' +
      '<button class="rules-tab" onclick="switchRulesTab(\'economy\', event)">Economy</button>' +
    '</div>' +
    '<div class="rules-content active" id="rules-basics">' +
      '<h3>Goal</h3><p>Earn money to buy a Coca-Cola. Give it to Matilda to escape.</p>' +
      '<h3>Working</h3><p>Select a job and click "Work" (or play a minigame). Each job has a base pay and a cooldown.</p>' +
      '<h3>Upgrades</h3><ul>' +
        '<li><b>Stamina:</b> Reduces the cooldown between jobs.</li>' +
        '<li><b>Earnings:</b> Increases the base payout of the job.</li>' +
        '<li><b>Special:</b> Some jobs have unique stats (Capacity for Plates, Precision for Lawn/Sword/Chest, Degree for Scientist).</li>' +
      '</ul>' +
      '<h3>Slaves</h3><p>Once you max out ALL upgrades for a specific job and buy the <b>Slave License</b> in the Shop, you can buy a Slave. Slaves work automatically forever, even when you are offline (with the Offline upgrade).</p>' +
    '</div>' +
    '<div class="rules-content" id="rules-jobs">' +
      '<h3>Simple Jobs</h3><p>Boxes and Dishes just require clicking the Work button.</p>' +
      '<h3>Plate Sorting</h3><p>Click the plates in numerical order (1, 2, 3...). One mistake resets the sequence.</p>' +
      '<h3>Lawn Mowing</h3><p>Click and hold near the start dot. Trace the line perfectly with your mouse. Moving too far away from the line drops your accuracy and you fail.</p>' +
      '<h3>Sword Forging</h3><p>Hit the moving power meter 5 times. The sum of your 5 hits must reach the threshold (starts at 465).</p>' +
      '<h3>Armor Crafter</h3><p>Look at the Order name. Open the Book to see the recipe. Drag and drop (or click) resources from the bottom bar to fill the 6x6 grid exactly as shown.</p>' +
      '<h3>Writer</h3><p>Type the displayed poem exactly as shown. You can buy a "Draft" upgrade to allow 1 typo.</p>' +
      '<h3>Scientist</h3><p>Solve tasks based on your Degree: basic math, angles, triangle angles, or chemistry equations (fill in the missing coefficients).</p>' +
      '<h3>Chest Locker</h3><p>Move your mouse to rotate the pick. Hold LMB to start picking. The pick will jam if you start at the wrong angle. Release LMB to reset a jam. If the jam bar fills completely, you fail.</p>' +
      '<h3>Artist</h3><p>After a 3-second countdown, 8 colored blocks flash in sequence. Memorize the order, then repeat it by clicking the blocks. Each round the sequence grows by 1. Complete all rounds for a big payout. Precision upgrade gives up to 2 mistakes per run.</p>' +
    '</div>' +
    '<div class="rules-content" id="rules-time">' +
      '<h3>Day & Night Cycle</h3><p>1 real second = 2 game minutes. A full day is 24 game hours (12 real minutes).</p>' +
      '<h3>Night Work</h3><p>Working between 00:00 and 06:00 is forbidden. If you try, you get caught and fined 12.5x your current job\'s pay, plus any money your slaves earned during the night.</p>' +
      '<h3>Sleeping</h3><p>You can sleep once per game day. Sleeping passes 8 hours, costs 5% of your current balance as a tax, and reduces satiety by 25%. If you try to sleep twice in one day, you can force it for a 35% fine.</p>' +
      '<h3>Calendar</h3><p>If bought in the shop, Fridays (and later Saturdays/Sundays) give a x2 or x3 multiplier to all earnings.</p>' +
    '</div>' +
    '<div class="rules-content" id="rules-items">' +
      '<h3>Satiety (Hunger)</h3><p>Drops by 1% every 12 seconds. Low satiety drastically increases your work cooldowns (up to 2.5x longer).</p>' +
      '<h3>Apples & Golden Apples</h3><p>Eat regular apples in the Garden for +5% satiety. Golden Apples instantly restore 100%.</p>' +
      '<h3>Herbal Elixir</h3><p>Halves all cooldowns for 5 game hours (2.5 real minutes).</p>' +
      '<h3>Sustenance Potion</h3><p>Halves the speed at which you get hungry for 5 game hours (2.5 real minutes).</p>' +
      '<h3>Insurance Potion</h3><p>For 5 game hours (2.5 real minutes), you lose NO money when you fail a minigame.</p>' +
      '<h3>Night Totem</h3><p>One-time use. If you get caught working at night, the Totem shatters and absorbs the entire fine and lockout.</p>' +
    '</div>' +
    '<div class="rules-content" id="rules-economy">' +
      '<h3>Premium & Jackpot</h3><ul>' +
        '<li><b>Premium:</b> Every 10th click gives a massive multiplier.</li>' +
        '<li><b>Jackpot:</b> Every 100th click gives an even bigger multiplier (up to x30).</li>' +
      '</ul>' +
      '<h3>Treasury (Market)</h3><p>Buy items when prices are low, sell when they are high. Prices fluctuate every minute. There is a PnL tracker to show your profits.</p>' +
      '<h3>Treasury (Investments)</h3><p>Long-term bonds. They grow steadily over time, but only if you own them.</p>' +
      '<h3>Distillery</h3><p>Buy must, wait for it to age, and sell it. Different stages give different multipliers (up to x10 for Exquisite). If you wait too long (over 10 mins), the wine spoils.</p>' +
      '<h3>Offline Work</h3><p>Buy upgrades in the shop to let your slaves earn money while the game is closed (up to 30% efficiency).</p>' +
    '</div>',
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
  if (!hasSave(currentChapter)) { startNewGame(); return; }
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
    'Activate', 'Cancel', () => submitPromoCode(), closeModal, 'small-modal'
  );
  setTimeout(() => {
    const inp = document.getElementById('promoInput');
    if (inp) {
      inp.focus();
      inp.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitPromoCode(); });
    }
  }, 100);
}

async function submitPromoCode() {
  const input = document.getElementById('promoInput'), errorEl = document.getElementById('promoError');
  if (!input || !errorEl) return;
  const code = input.value.trim();
  if (!code) { errorEl.textContent = 'Please enter a code.'; return; }
  if (game.usedPromos.includes(code)) { errorEl.textContent = 'You have already used this code!'; return; }
  errorEl.textContent = 'Checking...'; errorEl.style.color = '#8a7fa5';
  try {
    const res = await fetch('codes.txt');
    if (!res.ok) throw new Error('Failed to load codes');
    const text = await res.text();
    let found = null;
    const lines = text.split('\n');
    for (let line of lines) {
      line = line.trim(); if (!line) continue;
      const parts = line.split('-'); if (parts.length < 2) continue;
      const c = parts[0].trim();
      if (c === code) {
        const rewardPart = parts[1].trim();
        const [type, amountStr] = rewardPart.split(':');
        const amount = parseInt(amountStr, 10);
        if (!isNaN(amount)) found = { type: type.trim(), amount };
        break;
      }
    }
    if (!found) { errorEl.textContent = 'Invalid code.'; errorEl.style.color = '#b85a7a'; return; }
    if (found.type === 'm') { game.money = round2(game.money + found.amount); document.getElementById('balanceDisplay').textContent = formatMoney(game.money); errorEl.textContent = `+ $${found.amount}`; errorEl.style.color = '#a8c256'; }
    else if (found.type === 'a') { game.apples += found.amount; updateHungerUI(); errorEl.textContent = `+ ${found.amount} Apples`; errorEl.style.color = '#a8c256'; }
    else if (found.type === 'e') { game.elixirs += found.amount; updateHungerUI(); errorEl.textContent = `+ ${found.amount} Elixirs`; errorEl.style.color = '#a8c256'; }
    else { errorEl.textContent = 'Unknown reward type.'; errorEl.style.color = '#b85a7a'; return; }
    game.usedPromos.push(code); saveGame();
    input.disabled = true; document.getElementById('modalConfirm').disabled = true;
    setTimeout(() => { closeModal(); }, 2000);
  } catch (e) { errorEl.textContent = 'Error loading codes. (Make sure codes.txt exists)'; errorEl.style.color = '#b85a7a'; }
}

// ============================================================
// CONSUMABLES
// ============================================================
function eatGoldenApple(e) { if (!game || game.goldenApples <= 0) { triggerError(e.target); return; } game.goldenApples--; game.satiety = 100; saveGame(); updateHungerUI(); }
function drinkSustenance(e) {
  if (!game || game.sustenancePotions <= 0) { triggerError(e.target); return; }
  game.sustenancePotions--;
  const now = Date.now();
  game.sustenanceEndTime = (game.sustenanceEndTime > now ? game.sustenanceEndTime : now) + 150000;
  saveGame(); updateHungerUI(); updateBonusText();
}
function drinkInsurance(e) {
  if (!game || game.insurancePotions <= 0) { triggerError(e.target); return; }
  game.insurancePotions--;
  const now = Date.now();
  game.insuranceEndTime = (game.insuranceEndTime > now ? game.insuranceEndTime : now) + 150000;
  saveGame(); updateHungerUI(); updateBonusText();
}