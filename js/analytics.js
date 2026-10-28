// js/analytics.js
const DEFAULT_TTL = 5 * 60 * 1000;

function getSessionId() {
  try {
    let id = sessionStorage.getItem('v_sid');
    if (!id) {
      id = (crypto.randomUUID && crypto.randomUUID()) ||
           (Date.now().toString(36) + Math.random().toString(36).slice(2));
      sessionStorage.setItem('v_sid', id);
    }
    return id;
  } catch { return null; }
}

function shouldSkip() {
  if (navigator.webdriver) return true;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return true;
  return false;
}

function logVisit(logUrl) {
  const payload = JSON.stringify({
    path: location.pathname,
    referrer: document.referrer || null,
    sessionId: getSessionId(),
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(logUrl, payload);
  } else {
    fetch(logUrl, { method: 'POST', body: payload, keepalive: true, mode: 'no-cors' });
  }
}

function renderStats(data) {
  document.querySelectorAll('[data-visit-stat]').forEach(el => {
    const v = data[el.dataset.visitStat];
    if (v != null) el.textContent = Number(v).toLocaleString();
  });
}

async function loadStats(statsUrl, cacheKey, ttl) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
    if (cached && Date.now() - cached.ts < ttl) {
      renderStats(cached.data);
      return;
    }
  } catch {}
  try {
    const r = await fetch(statsUrl);
    if (!r.ok) return;
    const data = await r.json();
    renderStats(data);
    sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

export function initAnalytics({
  baseUrl,
  statsCacheTtl = DEFAULT_TTL,
  cacheKey = 'visit_stats_v1',
} = {}) {
  if (!baseUrl) {
    console.warn('[analytics] baseUrl is required');
    return;
  }
  if (shouldSkip()) return;

  // 1. Fire-and-forget visit log — runs as early as init() is called
  logVisit(baseUrl + '/log');

  // 2. Fetch + render stats
  const run = () => loadStats(baseUrl + '/stats', cacheKey, statsCacheTtl);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}