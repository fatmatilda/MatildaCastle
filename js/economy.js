function round2(n) {
  return Math.round(n * 100) / 100;
}

function formatNumber(num) {
  const isNeg = num < 0;
  num = Math.abs(num);
  if (num < 1000) {
    return (isNeg ? '-' : '') + num.toFixed(0);
  }
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  let i = 0;
  while (num >= 1000 && i < suffixes.length - 1) {
    num /= 1000;
    i++;
  }
  const decimals = num >= 100 ? 0 : num >= 10 ? 1 : 2;
  return (isNeg ? '-' : '') + parseFloat(num.toFixed(decimals)) + suffixes[i];
}

function formatMoney(num) {
  const isNeg = num < 0;
  num = Math.abs(num);
  let str;
  if (num < 1000) {
    str = num.toFixed(2);
  } else {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    let i = 0;
    while (num >= 1000 && i < suffixes.length - 1) {
      num /= 1000;
      i++;
    }
    const decimals = num >= 100 ? 0 : num >= 10 ? 1 : 2;
    str = parseFloat(num.toFixed(decimals)) + suffixes[i];
  }
  return (isNeg ? '-$' : '$') + str;
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0s';
  seconds = Math.floor(seconds);
  if (seconds >= 3600) {
    return Math.floor(seconds / 3600) + 'h ' + Math.floor((seconds % 3600) / 60) + 'm';
  }
  if (seconds >= 60) {
    return Math.floor(seconds / 60) + 'm ' + (seconds % 60) + 's';
  }
  return seconds + 's';
}

function formatGameTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = Math.floor(mins % 60);
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

function getHungerMult() {
  if (!game) return 1;
  const sat = game.satiety;
  if (sat >= 50) {
    return 1 + (100 - sat) * 0.01;
  }
  return 1.5 + Math.pow((50 - sat) / 50, 2) * 2.5;
}

function getElixirMult() {
  if (!game || Date.now() > game.elixirEndTime) return 1;
  return 0.5;
}

function applyCooldownMult(baseMs) {
  return baseMs * getHungerMult() * getElixirMult();
}

function getPremiumLevel() {
  return (game && game.premiumLevel) || 0;
}

function getPremiumMult() {
  const lvl = getPremiumLevel();
  return lvl > 0 ? round2(1.2 + (lvl - 1) * 0.2) : 1;
}

function getPremiumPrice() {
  return round2(20 * Math.pow(1.5, getPremiumLevel()));
}

function getJobData(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  const upg = (game && game.jobUpgrades[jobId]) || { stamina: 0, earnings: 0, plates: 0, precision: 0, mistake: 0, degree: 1 };
  upg.plates = upg.plates || 0;
  upg.precision = upg.precision || 0;
  upg.mistake = upg.mistake || 0;
  upg.degree = upg.degree || 1;

  const stamMaxLv = job.cdStep === 0 ? 0 : Math.floor((job.baseCd - job.maxCd) / job.cdStep);
  const earnMaxLv = jobId === 'scientist' ? 0 : Math.floor((job.maxPay - job.basePay) / job.payStep);
  const plateMaxLv = job.basePlates ? Math.floor((job.basePlates - job.minPlates) / job.plateStep) : 0;
  const precMaxLv = job.baseThreshold ? job.maxPrecLv : (job.precBase ? job.maxPrecLv : 0);
  const mistakeMaxLv = jobId === 'writer' ? 1 : 0;
  const degreeMaxLv = jobId === 'scientist' ? 5 : 0;

  upg.stamina = Math.min(upg.stamina, stamMaxLv);
  upg.earnings = Math.min(upg.earnings, earnMaxLv);
  upg.plates = Math.min(upg.plates, plateMaxLv);
  upg.precision = Math.min(upg.precision, precMaxLv);
  upg.mistake = Math.min(upg.mistake, mistakeMaxLv);
  upg.degree = Math.min(upg.degree, degreeMaxLv);

  return { job, upg, stamMaxLv, earnMaxLv, plateMaxLv, precMaxLv, mistakeMaxLv, degreeMaxLv };
}

function baseCooldown(jobId) {
  const { job, upg } = getJobData(jobId);
  if (jobId === 'armorer' || jobId === 'writer' || jobId === 'scientist') return 60000;
  return Math.max(job.maxCd, job.baseCd - upg.stamina * job.cdStep);
}

function currentPay(jobId) {
  const { job, upg } = getJobData(jobId);
  if (jobId === 'scientist') {
    return [0, 2100000, 3000000, 4800000, 7200000, 12000000][upg.degree || 1] || 2100000;
  }
  return Math.min(job.maxPay, round2(job.basePay + upg.earnings * job.payStep));
}

function currentThreshold(jobId) {
  const { job, upg } = getJobData(jobId);
  if (!job.baseThreshold) return 0;
  return Math.max(job.minThreshold, job.baseThreshold - upg.precision * 7);
}

function currentPlates(jobId) {
  const { job, upg } = getJobData(jobId);
  if (!job.basePlates) return 0;
  return Math.max(job.minPlates, job.basePlates - upg.plates * job.plateStep);
}

function staminaCost(jobId) {
  const { job, upg } = getJobData(jobId);
  if (jobId === 'armorer' || jobId === 'writer' || jobId === 'scientist') return 0;
  return round2(job.stamBase * Math.pow(job.stamMult, upg.stamina));
}

function earningsCost(jobId) {
  const { job, upg } = getJobData(jobId);
  if (jobId === 'scientist') return 0;
  return round2(job.earnBase * Math.pow(job.earnMult, upg.earnings));
}

function platesCost(jobId) {
  const { job, upg } = getJobData(jobId);
  if (!job.plateBase) return 0;
  return round2(job.plateBase * Math.pow(job.plateMult, upg.plates));
}

function precisionCost(jobId) {
  const { job, upg } = getJobData(jobId);
  if (!job.precBase) return 0;
  return round2(job.precBase * Math.pow(job.precMult, upg.precision));
}

function mistakeCost(jobId) {
  return jobId === 'writer' ? 15000000 : 0;
}

function degreeCost(jobId) {
  const { upg } = getJobData(jobId);
  if (jobId !== 'scientist') return 0;
  return [0, 20000000, 30000000, 45000000, 67500000, 0][upg.degree || 1] || 0;
}

function slaveCost(jobId) {
  const { job } = getJobData(jobId);
  let base = staminaCost(jobId) + earningsCost(jobId);
  if (job.basePlates) base += platesCost(jobId);
  if (job.precBase) base += precisionCost(jobId);
  if (jobId === 'writer') base += mistakeCost(jobId);
  if (jobId === 'scientist') base += 20000000 + 30000000 + 45000000 + 67500000;
  return round2(base * 1.35);
}

function getSlaveCooldown(jobId) {
  if (jobId === 'boxes' || jobId === 'dishes') return baseCooldown(jobId);
  return ({ plates: 10000, lawn: 15000, sword: 15000, armorer: 25000, writer: 30000, scientist: 60000 })[jobId] || 60000;
}

function getElixirPrice() {
  let maxHire = 0;
  JOBS.forEach(j => {
    if (game.hiredJobs.includes(j.id)) maxHire = Math.max(maxHire, j.hireCost);
  });
  return Math.floor((maxHire || 20) * 0.5);
}

function getBasketPrice() {
  return [0, 2000, 6000, 18000, 50000][game.basketLevel + 1] || 0;
}

function getCalendarPrice() {
  return [15000, 80000, 500000][game.calendarLevel] || 0;
}

function getSlaveIncomePerSecond() {
  let total = 0;
  JOBS.forEach(job => {
    if (game.slaves[job.id]) {
      const pay = currentPay(job.id);
      const cd = getSlaveCooldown(job.id) / 1000; // переводим мс в секунды
      total += pay / cd;
    }
  });
  return total;
}